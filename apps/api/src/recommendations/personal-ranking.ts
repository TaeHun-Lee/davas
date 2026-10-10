import { isAfterSeoulToday } from '@davas/shared';
import { resolveTmdbGenreLabels } from '../media/tmdb-genres';
import type { MediaRecommendationItem } from '../media/tmdb.mapper';
import {
  rankCandidate,
  scoreParticipant,
  tasteFeatures,
  type RecommendationCandidate,
} from './group-recommendation.algorithm';
import { featureShare, type TasteProfile } from './taste-profile';

export type Viewer = {
  accountId: string;
  profile: TasteProfile;
  /** The features of each title the viewer's taste was read from. */
  historyFeatures: ReadonlyArray<readonly string[]>;
  /** Titles the viewer watched or turned down, by `titleKey`. */
  seen: ReadonlySet<string>;
};

/** A title by its TMDB identity: `MOVIE:157336`. */
export const titleKey = (title: { mediaType: string; externalId: string }) =>
  `${title.mediaType}:${title.externalId}`;

function toCandidate(item: MediaRecommendationItem): RecommendationCandidate {
  return {
    id: titleKey(item),
    mediaType: item.mediaType,
    title: item.title,
    runtime: null,
    // TMDB lists carry genre ids; stored titles carry these names, which taste is read from.
    genres: resolveTmdbGenreLabels(item.genreIds),
    releaseDate: item.releaseDate,
    rating: item.voteAverage,
    voteCount: item.voteCount ?? 0,
    popularity: item.popularity,
    // The ranking does not read where a title streams, and these lists do not know.
    availability: {
      status: 'UNKNOWN',
      observedAt: new Date(0),
      expiresAt: new Date(0),
      offers: [],
    },
  };
}

/**
 * Home's and 탐색's lists for one person: TMDB's popular titles without the ones they watched,
 * turned down or cannot watch yet, ordered the way a pick orders titles for one person (their
 * taste, quality, freshness and popularity among the list). In the production history, this
 * order put the title people watched next among the first ten of a popular list for 57% of
 * watches; TMDB's own popularity order did for 29%.
 */
export function rankForViewer(
  items: readonly MediaRecommendationItem[],
  viewer: Viewer,
  now: Date,
  limit: number,
) {
  const unique = new Map<string, MediaRecommendationItem>();
  for (const item of items) {
    const key = titleKey(item);
    const unreleased = item.releaseDate !== null && isAfterSeoulToday(item.releaseDate, now);
    if (!unique.has(key) && !viewer.seen.has(key) && !unreleased) unique.set(key, item);
  }
  const pool = [...unique.values()].map((item) => ({ item, candidate: toCandidate(item) }));
  // Taste is read against the viewer's titles and this list together, as it was measured.
  const universe = featureShare([
    ...viewer.historyFeatures.map((features) => ({ features })),
    ...pool.map(({ candidate }) => ({ features: tasteFeatures(candidate.genres) })),
  ]);
  const mostPopular = Math.max(0, ...pool.map(({ candidate }) => candidate.popularity ?? 0));
  const ranked = pool
    .map(({ item, candidate }, index) => {
      const prediction = scoreParticipant(
        viewer.accountId,
        candidate,
        viewer.profile,
        universe,
        [],
      );
      const { finalScore } = rankCandidate(candidate, [prediction], {
        moodTags: [],
        channels: [],
        now,
        mostPopular,
      });
      return { item, index, finalScore };
    })
    .sort((a, b) => b.finalScore - a.finalScore || a.index - b.index)
    .map(({ item }) => item);
  return alternateKinds(ranked, limit);
}

/** Up to `limit` titles, movies and series in turn, so each tab gets its share of the list. */
function alternateKinds(items: MediaRecommendationItem[], limit: number) {
  const queues = [
    items.filter((item) => item.mediaType === 'MOVIE'),
    items.filter((item) => item.mediaType === 'TV'),
  ];
  const result: MediaRecommendationItem[] = [];
  while (result.length < limit && queues.some((queue) => queue.length > 0)) {
    for (const queue of queues) {
      const next = queue.shift();
      if (next && result.length < limit) result.push(next);
    }
  }
  return result;
}
