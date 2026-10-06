import type { SpaceMemories, WatchProgress } from '@davas/shared';
import { coreFetch } from './core';

export type { SpaceMemories, WatchProgress } from '@davas/shared';

const encode = encodeURIComponent;

export function getSpaceMemories(spaceId: string, year?: number) {
  const suffix = year ? `?year=${year}` : '';
  return coreFetch<SpaceMemories>(`/v1/spaces/${encode(spaceId)}/memories${suffix}`);
}

/** Where I am up to in a series, from my latest record of it (null when there is none). */
export function getWatchProgress(mediaId: string) {
  return coreFetch<{ progress: WatchProgress | null }>(
    `/v1/watch-events/progress/${encode(mediaId)}`,
  ).then((value) => value.progress);
}
