import { DAY_MS } from '../common/time';

/**
 * One thing a person did that says something about their taste. A record is the main signal:
 * most records carry no rating, but choosing to watch a title already says something.
 */
export type TasteSignal = {
  contentId: string;
  /** Lower-cased features of the title (genre names for now). */
  features: readonly string[];
  at: Date;
  kind: 'WATCHED' | 'WISHED' | 'RATED' | 'INTERESTED' | 'REJECTED';
  /** 1–10 (half stars), for RATED. */
  rating?: number;
};

export type TasteProfile = {
  /** Share of the weighted history carrying each feature, 0–1. */
  share: ReadonlyMap<string, number>;
  /** How much weighted history carries each feature. */
  evidence: ReadonlyMap<string, number>;
  /** Liked (+) or turned down (−) per feature from ratings and answers, shrunk toward 0. */
  explicit: ReadonlyMap<string, number>;
};

export type TastePrediction = {
  /** −1 (avoids titles like this) to 1 (seeks them out); 0 when nothing is known. */
  affinity: number;
  /** 1 when no history backs the title's features, falling toward 0 as history grows. */
  uncertainty: number;
};

// A watch from a year and a half ago counts half as much as one today, and never less than a
// quarter: taste drifts, but an old favourite still says something.
const HALF_LIFE_DAYS = 540;
const MIN_RECENCY = 0.25;
// Each extra watch of a title adds half its weight; wanting a title counts half a watch.
const REWATCH_BONUS = 0.5;
const WISH_WEIGHT = 0.5;
// Ratings are read against the person's own habit, shrunk toward 3.5 stars until they have
// rated a few titles: someone who gives everything 4 stars is not in love with everything.
const RATING_PRIOR = 7;
const RATING_PRIOR_COUNT = 3;
const RATING_SPREAD = 3;
const INTERESTED_VALUE = 0.3;
const REJECTED_VALUE = -0.6;
// Explicit feelings about a feature need a couple of signals before they count fully.
const EXPLICIT_PRIOR_WEIGHT = 2;
// History backing a title's features turns uncertainty down: 2 weighted watches halve it.
const EVIDENCE_PRIOR = 2;
const LIFT_SMOOTHING = 0.05;
const IMPLICIT_WEIGHT = 0.7;
// A favourite shows up 20% more than among all known titles, or was liked outright.
const FAVORITE_LIFT = 1.2;
const FAVORITE_EXPLICIT = 0.1;

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

export function recencyWeight(at: Date, now: Date) {
  const ageDays = Math.max(0, (now.getTime() - at.getTime()) / DAY_MS);
  return Math.max(MIN_RECENCY, 0.5 ** (ageDays / HALF_LIFE_DAYS));
}

/** A person's taste from their own signals only; nobody else's history leaks in. */
export function buildTasteProfile(signals: readonly TasteSignal[], now: Date): TasteProfile {
  const watched = new Map<string, { features: readonly string[]; count: number; latest: Date }>();
  for (const signal of signals.filter((item) => item.kind === 'WATCHED')) {
    const entry = watched.get(signal.contentId);
    if (!entry) {
      watched.set(signal.contentId, { features: signal.features, count: 1, latest: signal.at });
    } else {
      entry.count += 1;
      if (signal.at > entry.latest) entry.latest = signal.at;
    }
  }
  const history = [...watched.values()].map((entry) => ({
    features: entry.features,
    weight: recencyWeight(entry.latest, now) * (1 + REWATCH_BONUS * (entry.count - 1)),
  }));
  for (const signal of signals.filter((item) => item.kind === 'WISHED')) {
    if (watched.has(signal.contentId)) continue;
    history.push({
      features: signal.features,
      weight: recencyWeight(signal.at, now) * WISH_WEIGHT,
    });
  }

  const total = history.reduce((sum, item) => sum + item.weight, 0);
  const evidence = new Map<string, number>();
  for (const item of history) {
    for (const feature of new Set(item.features)) {
      evidence.set(feature, (evidence.get(feature) ?? 0) + item.weight);
    }
  }
  const share = new Map(
    [...evidence].map(([feature, weight]) => [feature, total ? weight / total : 0] as const),
  );

  const ratings = signals.filter((item) => item.kind === 'RATED' && item.rating !== undefined);
  const center =
    (ratings.reduce((sum, item) => sum + item.rating!, 0) + RATING_PRIOR * RATING_PRIOR_COUNT) /
    (ratings.length + RATING_PRIOR_COUNT);
  const sums = new Map<string, { value: number; weight: number }>();
  for (const signal of signals) {
    const value =
      signal.kind === 'RATED' && signal.rating !== undefined
        ? clamp((signal.rating - center) / RATING_SPREAD, -1, 1)
        : signal.kind === 'INTERESTED'
          ? INTERESTED_VALUE
          : signal.kind === 'REJECTED'
            ? REJECTED_VALUE
            : null;
    if (value === null) continue;
    const weight = recencyWeight(signal.at, now);
    for (const feature of new Set(signal.features)) {
      const entry = sums.get(feature) ?? { value: 0, weight: 0 };
      entry.value += value * weight;
      entry.weight += weight;
      sums.set(feature, entry);
    }
  }
  const explicit = new Map(
    [...sums].map(
      ([feature, entry]) =>
        [feature, entry.value / (entry.weight + EXPLICIT_PRIOR_WEIGHT)] as const,
    ),
  );
  return { share, evidence, explicit };
}

/**
 * How often each feature appears among all known titles: the baseline taste is read against.
 * Reading it against only what is still on offer would favour whatever a person has already
 * watched most of, since that is exactly what is left least of.
 */
export function featureShare(titles: ReadonlyArray<{ features: readonly string[] }>) {
  const counts = new Map<string, number>();
  for (const title of titles) {
    for (const feature of new Set(title.features))
      counts.set(feature, (counts.get(feature) ?? 0) + 1);
  }
  return new Map(
    [...counts].map(
      ([feature, count]) => [feature, titles.length ? count / titles.length : 0] as const,
    ),
  );
}

/**
 * How much a person should like a title. The implicit part asks whether its features show up
 * in their history more than among all known titles (log lift), so a genre they watch only
 * because everything is that genre counts for little. It is trusted as far as history backs
 * those features. Ratings and answers about the features add on top.
 */
export function predictTaste(
  profile: TasteProfile,
  features: readonly string[],
  universe: ReadonlyMap<string, number>,
): TastePrediction {
  const unique = [...new Set(features)];
  if (!unique.length) return { affinity: 0, uncertainty: 1 };
  let lift = 0;
  let explicit = 0;
  let evidence = 0;
  for (const feature of unique) {
    lift += Math.log(
      ((profile.share.get(feature) ?? 0) + LIFT_SMOOTHING) /
        ((universe.get(feature) ?? 0) + LIFT_SMOOTHING),
    );
    explicit += profile.explicit.get(feature) ?? 0;
    evidence += profile.evidence.get(feature) ?? 0;
  }
  lift /= unique.length;
  explicit /= unique.length;
  evidence /= unique.length;
  const confidence = evidence / (evidence + EVIDENCE_PRIOR);
  return {
    affinity: clamp(IMPLICIT_WEIGHT * confidence * Math.tanh(lift) + explicit, -1, 1),
    uncertainty: 1 - confidence,
  };
}

/**
 * Features a shared history leans toward compared with all known titles, or that people said
 * they like; a feature someone turned down is never a favourite.
 */
export function favoriteFeatures(profile: TasteProfile, universe: ReadonlyMap<string, number>) {
  const favorites = new Set<string>();
  for (const [feature, share] of profile.share) {
    const lift = (share + LIFT_SMOOTHING) / ((universe.get(feature) ?? 0) + LIFT_SMOOTHING);
    if ((profile.evidence.get(feature) ?? 0) >= EVIDENCE_PRIOR && lift >= FAVORITE_LIFT) {
      favorites.add(feature);
    }
  }
  for (const [feature, value] of profile.explicit) {
    if (value >= FAVORITE_EXPLICIT) favorites.add(feature);
    if (value <= -FAVORITE_EXPLICIT) favorites.delete(feature);
  }
  return favorites;
}
