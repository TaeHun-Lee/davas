import type { SpaceWishList, SpaceWishPick, WishMood } from '@davas/shared';
import { coreFetch } from './core';

export type { SpaceWishItem, SpaceWishList, SpaceWishPick, WishMood } from '@davas/shared';

export type WishStatus = { mediaId: string; wantedByMe: boolean; wantedCount: number };

const encode = encodeURIComponent;
const base = (spaceId: string) => `/v1/spaces/${encode(spaceId)}/wishes`;

export function listWishes(spaceId: string) {
  return coreFetch<SpaceWishList>(base(spaceId));
}

export function pickWish(spaceId: string, options: { mood?: WishMood; exclude?: string[] } = {}) {
  const params = new URLSearchParams();
  if (options.mood) params.set('mood', options.mood);
  if (options.exclude?.length) params.set('exclude', options.exclude.join(','));
  const suffix = params.size ? `?${params.toString()}` : '';
  return coreFetch<SpaceWishPick>(`${base(spaceId)}/pick${suffix}`);
}

export function getWishStatus(spaceId: string, mediaId: string) {
  return coreFetch<WishStatus>(`${base(spaceId)}/${encode(mediaId)}`);
}

export function setWish(spaceId: string, mediaId: string, wanted: boolean) {
  return coreFetch<WishStatus>(`${base(spaceId)}/${encode(mediaId)}`, {
    method: wanted ? 'PUT' : 'DELETE',
  });
}
