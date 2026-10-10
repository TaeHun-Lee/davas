import { RECOMMENDATION_MOOD_GENRES, SPACE_MAX_MEMBERS, SPACE_MIN_MEMBERS } from '@davas/shared';
import { DAY_MS } from '../common/time';
import { predictTaste, type TasteProfile } from './taste-profile';

export const GROUP_RECOMMENDATION_ALGORITHM_VERSION = 'group-content-v2-taste';
export const DEFAULT_GROUP_LAMBDA = 0.6;
export const DEFAULT_GROUP_GAMMA = 0.1;

export type CandidateAvailability = {
  status: string;
  expiresAt: Date;
  offers: Array<{ provider: string; offerType: string; confidence: number }>;
  observedAt: Date;
};

export type RecommendationCandidate = {
  id: string;
  mediaType: 'MOVIE' | 'TV';
  title: string;
  runtime: number | null;
  genres: string[];
  director?: string | null;
  releaseDate: string | null;
  rating: number | null;
  voteCount: number;
  availability: CandidateAvailability;
};

export type NormalizedRecommendationRequest = {
  region: string;
  services: string[];
  contentTypes: Array<'MOVIE' | 'TV'>;
  runtimeMin: number | null;
  runtimeMax: number | null;
  moodTags: string[];
  avoidTags: string[];
  rewatchPolicy: 'EXCLUDE' | 'ALLOW';
};

export type ParticipantPrediction = {
  accountId: string;
  score: number;
  uncertainty: number;
};

export type RankedCandidate = {
  candidate: RecommendationCandidate;
  participantScores: ParticipantPrediction[];
  groupBase: number;
  finalScore: number;
  scoreParts: Record<string, number>;
  channels: string[];
  diversityPenalty?: number;
};

export const clamp01 = (value: number) => Math.min(Math.max(value, 0), 1);
const normalized = (value: string) => value.trim().toLocaleLowerCase('en-US');

/** The features taste is read from: a title's genres, lower-cased. */
export const tasteFeatures = (genres: readonly string[]) => genres.map(normalized);
export const round = (value: number) => Number(value.toFixed(5));

/**
 * The genres a mood or avoid tag stands for. A mood the web offers ("웃긴") stands for the
 * genres that carry it; any other tag is read as a genre name ("공포").
 */
export function tagGenreNames(tag: string): readonly string[] {
  return RECOMMENDATION_MOOD_GENRES[tag.trim()] ?? [tag];
}

/** Whether a mood or avoid tag fits a title's genres. */
export function tagMatchesGenres(tag: string, genres: readonly string[]) {
  const titleGenres = new Set(genres.map(normalized));
  return tagGenreNames(tag).some((genre) => titleGenres.has(normalized(genre)));
}

export function standardDeviation(values: number[]) {
  if (values.length === 0) return 0;
  const mean = values.reduce((total, value) => total + value, 0) / values.length;
  return Math.sqrt(values.reduce((total, value) => total + (value - mean) ** 2, 0) / values.length);
}

export function calculateGroupBase(
  scores: number[],
  lambda = DEFAULT_GROUP_LAMBDA,
  gamma = DEFAULT_GROUP_GAMMA,
) {
  if (scores.length < SPACE_MIN_MEMBERS || scores.length > SPACE_MAX_MEMBERS) {
    throw new Error(
      `Group scores require ${SPACE_MIN_MEMBERS} to ${SPACE_MAX_MEMBERS} participants`,
    );
  }
  const mean = scores.reduce((total, value) => total + value, 0) / scores.length;
  const floor = Math.min(...scores);
  const dispersion = standardDeviation(scores);
  return {
    mean: round(mean),
    floor: round(floor),
    dispersion: round(dispersion),
    groupBase: round(clamp01(lambda * floor + (1 - lambda) * mean - gamma * dispersion)),
  };
}

export function qualityPrior(candidate: RecommendationCandidate) {
  const rating = candidate.rating === null ? 0.55 : clamp01(candidate.rating / 10);
  const confidence = Math.min(Math.log10(candidate.voteCount + 1) / 4, 1);
  return round(0.55 + (rating - 0.55) * confidence);
}

/**
 * A person's predicted enjoyment of a title, 0–1: their taste for its features (see
 * taste-profile.ts), the title's quality and the requested mood. A person with no history
 * for these features gets the title's quality around 0.5 and a high uncertainty, never
 * somebody else's taste.
 */
export function scoreParticipant(
  accountId: string,
  candidate: RecommendationCandidate,
  profile: TasteProfile,
  universe: ReadonlyMap<string, number>,
  moodTags: string[],
): ParticipantPrediction {
  const taste = predictTaste(profile, tasteFeatures(candidate.genres), universe);
  const moodFit = moodTags.length
    ? moodTags.filter((tag) => tagMatchesGenres(tag, candidate.genres)).length / moodTags.length
    : 0;
  const quality = qualityPrior(candidate);
  return {
    accountId,
    score: round(clamp01(0.5 + 0.2 * taste.affinity + 0.3 * (quality - 0.55) + 0.05 * moodFit)),
    uncertainty: round(taste.uncertainty),
  };
}

// A title is fresh for two years after release, most on release day.
const FRESHNESS_DAYS = 730;

export function freshness(candidate: RecommendationCandidate, now: Date) {
  if (!candidate.releaseDate) return 0;
  const days = (now.getTime() - Date.parse(candidate.releaseDate)) / DAY_MS;
  return days < 0 ? 0 : round(Math.max(0, 1 - days / FRESHNESS_DAYS));
}

/**
 * Where a title lands for the group: the group base (the least happy person weighs most),
 * plus the requested mood, quality, freshness and safe exploration, minus how unsure the
 * predictions are. A single person's ranking, as the backtest replays it, uses their score as
 * the base.
 */
export function rankCandidate(
  candidate: RecommendationCandidate,
  participantScores: ParticipantPrediction[],
  context: { moodTags: string[]; channels: string[]; now: Date },
): RankedCandidate {
  const scores = participantScores.map(({ score }) => score);
  const group =
    scores.length >= SPACE_MIN_MEMBERS
      ? calculateGroupBase(scores)
      : { mean: scores[0], floor: scores[0], dispersion: 0, groupBase: scores[0] };
  const contextFit = context.moodTags.some((tag) => tagMatchesGenres(tag, candidate.genres))
    ? 0.04
    : 0;
  const qualityBonus = qualityPrior(candidate) * 0.06;
  const freshnessBonus = 0.12 * freshness(candidate, context.now);
  const explorationBonus = context.channels.includes('SAFE_EXPLORATION') ? 0.015 : 0;
  const uncertaintyRisk =
    (participantScores.reduce((total, prediction) => total + prediction.uncertainty, 0) /
      participantScores.length) *
    0.06;
  return {
    candidate,
    participantScores,
    groupBase: group.groupBase,
    finalScore: round(
      clamp01(
        group.groupBase +
          contextFit +
          qualityBonus +
          freshnessBonus +
          explorationBonus -
          uncertaintyRisk,
      ),
    ),
    channels: context.channels,
    scoreParts: {
      mean: group.mean,
      floor: group.floor,
      dispersion: group.dispersion,
      contextFit: round(contextFit),
      qualityPrior: round(qualityBonus),
      freshnessBonus: round(freshnessBonus),
      explorationBonus: round(explorationBonus),
      uncertaintyRisk: round(uncertaintyRisk),
    },
  };
}

export function passesHardFilters(
  candidate: RecommendationCandidate,
  request: NormalizedRecommendationRequest,
  now: Date,
  explicitlyRejectedContentIds: ReadonlySet<string>,
  watchedContentIds: ReadonlySet<string>,
) {
  if (!request.contentTypes.includes(candidate.mediaType)) return false;
  if (candidate.availability.status !== 'AVAILABLE') return false;
  if (candidate.availability.expiresAt.getTime() <= now.getTime()) return false;
  if (candidate.releaseDate && candidate.releaseDate > now.toISOString().slice(0, 10)) return false;
  const allowedServices = new Set(request.services.map(normalized));
  if (
    !candidate.availability.offers.some((offer) => allowedServices.has(normalized(offer.provider)))
  )
    return false;
  if (request.runtimeMin !== null) {
    if (candidate.runtime === null || candidate.runtime < request.runtimeMin) return false;
  }
  if (request.runtimeMax !== null) {
    if (candidate.runtime === null || candidate.runtime > request.runtimeMax) return false;
  }
  if (request.avoidTags.some((tag) => tagMatchesGenres(tag, candidate.genres))) return false;
  if (explicitlyRejectedContentIds.has(candidate.id)) return false;
  if (request.rewatchPolicy === 'EXCLUDE' && watchedContentIds.has(candidate.id)) return false;
  return true;
}

function stableFraction(value: string) {
  let hash = 2166136261;
  for (const character of value) {
    hash ^= character.charCodeAt(0);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0) / 0xffffffff;
}

export function assignCandidateChannels(
  candidates: RecommendationCandidate[],
  positiveGenres: ReadonlySet<string>,
  seed: string,
) {
  const channels = new Map<string, Set<string>>();
  const add = (candidate: RecommendationCandidate, channel: string) => {
    const values = channels.get(candidate.id) ?? new Set<string>();
    values.add(channel);
    channels.set(candidate.id, values);
  };

  [...candidates]
    .sort(
      (left, right) =>
        qualityPrior(right) - qualityPrior(left) ||
        right.voteCount - left.voteCount ||
        left.id.localeCompare(right.id),
    )
    .slice(0, 60)
    .forEach((candidate) => add(candidate, 'QUALITY_POPULAR'));

  candidates
    .filter((candidate) => candidate.genres.some((genre) => positiveGenres.has(normalized(genre))))
    .slice(0, 60)
    .forEach((candidate) => add(candidate, 'CONTENT_AFFINITY'));

  [...candidates]
    .filter((candidate) => candidate.releaseDate)
    .sort(
      (left, right) =>
        String(right.releaseDate).localeCompare(String(left.releaseDate)) ||
        left.id.localeCompare(right.id),
    )
    .slice(0, 40)
    .forEach((candidate) => add(candidate, 'FRESH_RELEASE'));

  [...candidates]
    .sort(
      (left, right) =>
        stableFraction(`${seed}:${right.id}`) - stableFraction(`${seed}:${left.id}`) ||
        left.id.localeCompare(right.id),
    )
    .slice(0, 30)
    .forEach((candidate) => add(candidate, 'SAFE_EXPLORATION'));

  return candidates
    .filter((candidate) => channels.has(candidate.id))
    .map((candidate) => ({
      candidate,
      channels: [...channels.get(candidate.id)!].sort(),
    }));
}

function similarity(left: RecommendationCandidate, right: RecommendationCandidate) {
  const leftGenres = new Set(left.genres.map(normalized));
  const rightGenres = new Set(right.genres.map(normalized));
  const intersection = [...leftGenres].filter((genre) => rightGenres.has(genre)).length;
  const union = new Set([...leftGenres, ...rightGenres]).size || 1;
  const genreSimilarity = intersection / union;
  const sameDirector = left.director && right.director && left.director === right.director ? 1 : 0;
  return Math.min(1, genreSimilarity * 0.8 + sameDirector * 0.2);
}

export function diversityRerank(candidates: RankedCandidate[], limit = 10): RankedCandidate[] {
  const remaining = [...candidates];
  const selected: RankedCandidate[] = [];
  while (remaining.length && selected.length < limit) {
    const scored = remaining.map((candidate) => {
      const penalty = selected.length
        ? Math.max(...selected.map((chosen) => similarity(candidate.candidate, chosen.candidate))) *
          0.12
        : 0;
      return { candidate, penalty, adjusted: candidate.finalScore - penalty };
    });
    scored.sort(
      (left, right) =>
        right.adjusted - left.adjusted ||
        right.candidate.finalScore - left.candidate.finalScore ||
        left.candidate.candidate.id.localeCompare(right.candidate.candidate.id),
    );
    const picked = scored[0];
    selected.push({
      ...picked.candidate,
      diversityPenalty: round(picked.penalty),
    });
    remaining.splice(remaining.indexOf(picked.candidate), 1);
  }
  return selected;
}
