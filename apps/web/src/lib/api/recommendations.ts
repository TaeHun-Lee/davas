import type { MediaSearchResult } from './media';

export type MediaRecommendationItem = MediaSearchResult & {
  voteAverage: number | null;
  voteCount: number | null;
  popularity: number | null;
  reason: string;
};

export type RecommendationListResponse = {
  page: number;
  totalPages: number;
  items: MediaRecommendationItem[];
};

export type GenreRecommendationPreset = {
  id: string;
  label: string;
  description: string;
};

export type GenreRecommendationPresetsResponse = {
  items: GenreRecommendationPreset[];
};

export type GenreRecommendationsResponse = RecommendationListResponse & {
  preset: GenreRecommendationPreset;
};

export type TodayRecommendationResponse = {
  items: MediaRecommendationItem[];
};

function getApiBaseUrl() {
  if (typeof window === 'undefined') {
    return process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:4000/api';
  }
  return `${window.location.protocol}//${window.location.hostname}:4000/api`;
}

async function fetchRecommendation<T>(path: string) {
  const response = await fetch(`${getApiBaseUrl()}${path}`, {
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('recommendations request failed');
  }

  return (await response.json()) as T;
}

export async function getTrendingRecommendations({ limit = 10, page = 1, language = 'ko-KR' }: { limit?: number; page?: number; language?: string } = {}) {
  const params = new URLSearchParams();
  params.set('limit', String(limit));
  params.set('page', String(page));
  params.set('language', language);

  return fetchRecommendation<RecommendationListResponse>(`/recommendations/trending?${params.toString()}`);
}

export async function getGenreRecommendationPresets() {
  return fetchRecommendation<GenreRecommendationPresetsResponse>('/recommendations/genres');
}

export async function getGenreRecommendations(presetId: string, { limit = 4, page = 1, language = 'ko-KR' }: { limit?: number; page?: number; language?: string } = {}) {
  const params = new URLSearchParams();
  params.set('limit', String(limit));
  params.set('page', String(page));
  params.set('language', language);

  return fetchRecommendation<GenreRecommendationsResponse>(`/recommendations/genres/${presetId}?${params.toString()}`);
}

export async function getRandomGenreRecommendations({ seed, limit = 4, page = 1, language = 'ko-KR' }: { seed?: string; limit?: number; page?: number; language?: string } = {}) {
  const params = new URLSearchParams();
  if (seed) {
    params.set('seed', seed);
  }
  params.set('limit', String(limit));
  params.set('page', String(page));
  params.set('language', language);

  return fetchRecommendation<GenreRecommendationsResponse>(`/recommendations/genres/random?${params.toString()}`);
}

export async function getTodayRecommendation({ limit = 3, language = 'ko-KR' }: { limit?: number; language?: string } = {}) {
  const params = new URLSearchParams();
  params.set('limit', String(limit));
  params.set('language', language);

  return fetchRecommendation<TodayRecommendationResponse>(`/recommendations/today/carousel?${params.toString()}`);
}
