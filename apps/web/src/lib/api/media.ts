import { DEFAULT_LANGUAGE } from '@davas/shared';
import type {
  MediaDetail,
  MediaSearchResponse,
  MediaSearchResult,
  MediaSelectionInput,
  MediaSelectionResponse,
  MediaShowtimesResponse,
  MyMediaDiary,
} from '@davas/shared';
import { getApiBaseUrl } from './base-url';
import { coreFetch } from './core';

export type { MediaDetail, MediaSearchResponse, MediaSearchResult, MyMediaDiary };

/** A search result once the API has stored it: the result plus its own id and genres. */
export type SelectedMedia = MediaSearchResult & {
  id: string;
  genres?: string[];
};

export async function searchMedia({
  query,
  type = 'multi',
  page = 1,
  language = DEFAULT_LANGUAGE,
}: {
  query: string;
  type?: 'movie' | 'tv' | 'multi';
  page?: number;
  language?: string;
}) {
  const params = new URLSearchParams();
  params.set('q', query);
  params.set('type', type);
  params.set('page', String(page));
  params.set('language', language);

  const response = await fetch(`${getApiBaseUrl()}/media/search?${params.toString()}`, {
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('media search failed');
  }

  return (await response.json()) as MediaSearchResponse;
}
// Only the provider identity is sent: the API stores titles and images from TMDB itself and
// rejects any other field (forbidNonWhitelisted), so a title or poster here fails the request.
function toMediaSelectionPayload(selection: MediaSearchResult): MediaSelectionInput {
  return {
    externalProvider: selection.externalProvider,
    externalId: selection.externalId,
    mediaType: selection.mediaType,
  };
}

export async function selectMedia(selection: MediaSearchResult) {
  const response = await fetch(`${getApiBaseUrl()}/media/selections`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(toMediaSelectionPayload(selection)),
  });

  if (!response.ok) {
    throw new Error('media selection failed');
  }

  const selected = (await response.json()) as MediaSelectionResponse;
  return {
    ...selection,
    ...selected,
    genreIds: selection.genreIds,
  } as SelectedMedia;
}

export async function getMediaDetail(id: string) {
  const response = await fetch(`${getApiBaseUrl()}/media/${id}`, {
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('media detail failed');
  }

  return (await response.json()) as MediaDetail;
}

export type MediaOfferType = 'STREAM' | 'RENT' | 'BUY' | 'FREE' | 'ADS';

/** Where a title can be watched in a region now (TMDB, from JustWatch). */
export type MediaAvailability = {
  contentId: string;
  region: string;
  availability: 'AVAILABLE' | 'UNAVAILABLE' | 'UNKNOWN';
  state: 'AVAILABLE' | 'NO_OFFERS' | 'PROVIDER_FAILURE' | 'EXPIRED' | 'UNMAPPED' | 'UNKNOWN';
  observedAt: string | null;
  expiresAt: string | null;
  sourceProvider: string | null;
  confidence: number;
  offers: Array<{ provider: string; offerType: MediaOfferType | string; confidence: number }>;
};

/** The stored answer; it may be missing or expired (kept six hours). */
export function getMediaAvailability(id: string) {
  return coreFetch<MediaAvailability>(`/media/${encodeURIComponent(id)}/availability`);
}

/** Asks TMDB again and stores the answer. */
export function refreshMediaAvailability(id: string) {
  return coreFetch<MediaAvailability>(`/media/${encodeURIComponent(id)}/availability/refresh`, {
    method: 'POST',
  });
}

/** Where a stored film plays in Seoul and Gyeonggi this week (KOBIS, read daily at 12:00). */
export function getMediaShowtimes(id: string) {
  return coreFetch<MediaShowtimesResponse>(`/media/${encodeURIComponent(id)}/showtimes`);
}
