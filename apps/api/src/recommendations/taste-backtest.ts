import {
  calculateGroupBase,
  clamp01,
  qualityPrior,
  rankCandidate,
  round,
  scoreParticipant,
  tasteFeatures,
  type RecommendationCandidate,
} from './group-recommendation.algorithm';
import {
  buildTasteProfile,
  featureShare,
  type TasteProfile,
  type TasteSignal,
} from './taste-profile';

/**
 * Replays a history to see how well a model would have predicted what was watched next. For
 * each of a person's latest records, every title that was out by that day and that they had
 * not watched yet is ranked, and the place of the title they did watch is noted. Group mode
 * does the same for titles everyone watched on the same day. Nothing here touches the
 * database, so a snapshot can be replayed on any machine.
 */
export type BacktestDataset = {
  titles: Array<{
    id: string;
    mediaType: 'MOVIE' | 'TV';
    genres: string[];
    rating: number | null;
    voteCount: number;
    releaseDate: string | null;
    runtime: number | null;
    /** TMDB popularity, when the snapshot has it. */
    popularity?: number | null;
  }>;
  watches: Array<{ accountId: string; contentId: string; watchedDate: string; createdAt?: string }>;
  ratings: Array<{ accountId: string; contentId: string; ratingScale: number }>;
  wishes?: Array<{ accountId: string; contentId: string; at: string }>;
};

export const BACKTEST_MODELS = ['random', 'quality', 'genre-rating-v1', 'taste-v2'] as const;
export type BacktestModel = (typeof BACKTEST_MODELS)[number];

export type BacktestResult = {
  model: BacktestModel;
  events: number;
  /** Mean number of titles ranked per event. */
  meanCandidates: number;
  /** Share of events whose title made the top 5. */
  hitRateAt5: number;
  /** Mean of 1 / rank. */
  mrr: number;
  /** Mean place as a share of the list: 0 is first, 0.5 is what chance gives. */
  meanPercentile: number;
  /** Mean uncertainty reported for the watched titles (the two taste models). */
  meanUncertainty?: number;
};

type Candidate = RecommendationCandidate;
type Event = { accountIds: string[]; contentId: string; date: string };
type Person = { profile: TasteProfile; rated: Array<{ genres: string[]; rating: number }> };

/**
 * The v1 ranking, kept only as the baseline: a participant score from ratings of same-genre
 * titles, then the v1 bonuses (quality, a flat bonus for the last three years, uncertainty).
 */
function rankV1(candidate: Candidate, people: Person[], now: Date) {
  const genres = new Set(tasteFeatures(candidate.genres));
  const quality = qualityPrior(candidate);
  const predictions = people.map((person) => {
    const matching = person.rated.filter((item) =>
      tasteFeatures(item.genres).some((genre) => genres.has(genre)),
    );
    if (!matching.length) return { score: clamp01(0.45 + 0.35 * quality), uncertainty: 0.9 };
    const affinity = matching.reduce((sum, item) => sum + item.rating / 10, 0) / matching.length;
    return {
      score: clamp01(0.25 + 0.5 * affinity + 0.2 * quality),
      uncertainty: Math.max(0.2, 0.7 - matching.length * 0.08),
    };
  });
  const scores = predictions.map((prediction) => prediction.score);
  const base = scores.length > 1 ? calculateGroupBase(scores).groupBase : scores[0];
  const year = Number(candidate.releaseDate?.slice(0, 4));
  const uncertainty =
    predictions.reduce((sum, prediction) => sum + prediction.uncertainty, 0) / predictions.length;
  return {
    score:
      base +
      quality * 0.06 +
      (Number.isFinite(year) && year >= now.getUTCFullYear() - 3 ? 0.03 : 0) -
      uncertainty * 0.06,
    uncertainty,
  };
}

function stableFraction(value: string) {
  let hash = 2166136261;
  for (const character of value) {
    hash ^= character.charCodeAt(0);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0) / 0xffffffff;
}

export function runBacktest(
  dataset: BacktestDataset,
  options: { eventsPerPerson?: number; group?: boolean } = {},
): BacktestResult[] {
  const eventsPerPerson = options.eventsPerPerson ?? 40;
  const candidates: Candidate[] = dataset.titles.map((title) => ({
    id: title.id,
    mediaType: title.mediaType,
    title: title.id,
    runtime: title.runtime,
    genres: title.genres,
    releaseDate: title.releaseDate,
    rating: title.rating,
    voteCount: title.voteCount,
    popularity: title.popularity ?? null,
    availability: {
      status: 'AVAILABLE',
      expiresAt: new Date(0),
      observedAt: new Date(0),
      offers: [],
    },
  }));
  const byId = new Map(candidates.map((candidate) => [candidate.id, candidate]));
  // As in production, taste is read against every known title.
  const universe = featureShare(
    candidates.map((candidate) => ({ features: tasteFeatures(candidate.genres) })),
  );
  const people = [...new Set(dataset.watches.map((watch) => watch.accountId))].sort();
  const ordered = [...dataset.watches]
    .filter((watch) => byId.has(watch.contentId))
    .sort(
      (a, b) =>
        a.watchedDate.localeCompare(b.watchedDate) ||
        (a.createdAt ?? '').localeCompare(b.createdAt ?? ''),
    );

  const events: Event[] = [];
  if (options.group) {
    const together = new Map<string, Set<string>>();
    for (const watch of ordered) {
      const key = `${watch.contentId}|${watch.watchedDate}`;
      together.set(key, (together.get(key) ?? new Set()).add(watch.accountId));
    }
    const shared = [...together]
      .filter(([, accounts]) => accounts.size === people.length && people.length > 1)
      .map(([key]) => key.split('|'))
      .sort((a, b) => a[1].localeCompare(b[1]));
    for (const [contentId, date] of shared.slice(-eventsPerPerson)) {
      events.push({ accountIds: people, contentId, date });
    }
  } else {
    for (const accountId of people) {
      const own = ordered.filter((watch) => watch.accountId === accountId);
      for (const watch of own.slice(-eventsPerPerson)) {
        events.push({
          accountIds: [accountId],
          contentId: watch.contentId,
          date: watch.watchedDate,
        });
      }
    }
  }

  const replays = events.flatMap((event) => {
    const histories = event.accountIds.map((accountId) =>
      ordered.filter((watch) => watch.accountId === accountId && watch.watchedDate < event.date),
    );
    const seen = new Set(histories.flat().map((watch) => watch.contentId));
    // A rewatch is not a prediction: the title was already known.
    if (seen.has(event.contentId)) return [];
    // Only titles out by that day could have been picked; the watched one always counts.
    const pool = candidates.filter(
      (candidate) =>
        !seen.has(candidate.id) &&
        (candidate.id === event.contentId ||
          !candidate.releaseDate ||
          candidate.releaseDate <= event.date),
    );
    const now = new Date(`${event.date}T12:00:00Z`);
    const persons: Person[] = event.accountIds.map((accountId, index) => {
      const historyIds = new Set(histories[index].map((watch) => watch.contentId));
      const genresOf = (id: string) => tasteFeatures(byId.get(id)?.genres ?? []);
      const signals: TasteSignal[] = histories[index].map((watch) => ({
        contentId: watch.contentId,
        features: genresOf(watch.contentId),
        at: new Date(`${watch.watchedDate}T12:00:00Z`),
        kind: 'WATCHED',
      }));
      const rated = dataset.ratings.filter(
        (rating) => rating.accountId === accountId && historyIds.has(rating.contentId),
      );
      for (const rating of rated) {
        signals.push({
          contentId: rating.contentId,
          features: genresOf(rating.contentId),
          at: now,
          kind: 'RATED',
          rating: rating.ratingScale,
        });
      }
      for (const wish of dataset.wishes ?? []) {
        if (wish.accountId !== accountId || wish.at.slice(0, 10) >= event.date) continue;
        signals.push({
          contentId: wish.contentId,
          features: genresOf(wish.contentId),
          at: new Date(wish.at),
          kind: 'WISHED',
        });
      }
      return {
        profile: buildTasteProfile(signals, now),
        rated: rated.map((rating) => ({
          genres: byId.get(rating.contentId)?.genres ?? [],
          rating: rating.ratingScale,
        })),
      };
    });
    return [{ event, pool, now, persons }];
  });

  const mostPopular = (pool: Candidate[]) =>
    Math.max(0, ...pool.map((candidate) => candidate.popularity ?? 0));

  return BACKTEST_MODELS.map((model) => {
    let hits = 0;
    let reciprocal = 0;
    let percentile = 0;
    let uncertainty = 0;
    let poolSize = 0;
    replays.forEach(({ event, pool, now, persons }, index) => {
      const top = mostPopular(pool);
      const scored = pool.map((candidate) => {
        if (model === 'random') {
          return { id: candidate.id, score: stableFraction(`${index}:${candidate.id}`), u: 0 };
        }
        if (model === 'quality') return { id: candidate.id, score: qualityPrior(candidate), u: 0 };
        if (model === 'genre-rating-v1') {
          const v1 = rankV1(candidate, persons, now);
          return { id: candidate.id, score: v1.score, u: v1.uncertainty };
        }
        const predictions = persons.map((person, i) =>
          scoreParticipant(event.accountIds[i], candidate, person.profile, universe, []),
        );
        const ranked = rankCandidate(candidate, predictions, {
          moodTags: [],
          channels: [],
          now,
          mostPopular: top,
        });
        return {
          id: candidate.id,
          score: ranked.finalScore,
          u: predictions.reduce((sum, p) => sum + p.uncertainty, 0) / predictions.length,
        };
      });
      const target = scored.find((item) => item.id === event.contentId)!;
      const above = scored.filter((item) => item.score > target.score).length;
      const tied = scored.filter((item) => item.score === target.score).length - 1;
      // Ties share the places they span, so a model that scores everything alike gets chance.
      const rank = 1 + above + tied / 2;
      hits += rank <= 5 ? 1 : 0;
      reciprocal += 1 / rank;
      percentile += pool.length > 1 ? (rank - 1) / (pool.length - 1) : 0;
      uncertainty += target.u;
      poolSize += pool.length;
    });
    const count = replays.length || 1;
    return {
      model,
      events: replays.length,
      meanCandidates: round(poolSize / count),
      hitRateAt5: round(hits / count),
      mrr: round(reciprocal / count),
      meanPercentile: round(percentile / count),
      ...(model === 'taste-v2' || model === 'genre-rating-v1'
        ? { meanUncertainty: round(uncertainty / count) }
        : {}),
    };
  });
}
