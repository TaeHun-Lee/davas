import { coreFetch } from './core';

export type WatchlistItem = {
  id: string;
  mediaId: string;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  memo: string;
  plannedWith: string;
  status: 'ACTIVE' | 'WATCHED';
  createdAt: string;
  updatedAt: string;
  media: {
    id: string;
    title: string;
    posterUrl: string | null;
    releaseDate: string | null;
    mediaType: string;
  } | null;
};

export function addWatchlist(mediaId: string) {
  return coreFetch<WatchlistItem>('/watchlist', {
    method: 'POST',
    body: JSON.stringify({ mediaId }),
  });
}

export function removeWatchlist(id: string) {
  return coreFetch<{ id: string; deleted: true }>(`/watchlist/${encodeURIComponent(id)}`, {
    method: 'DELETE',
  });
}
