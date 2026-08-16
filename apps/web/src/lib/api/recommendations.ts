import type {
  GroupRecommendationFeedbackRequest,
  GroupRecommendationFeedbackResponse,
  GroupRecommendationSessionRequest,
  GroupRecommendationSessionResponse,
} from '@davas/shared';
import type { MediaSearchResult } from './media';
import { getApiBaseUrl } from './base-url';

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

export class RecommendationRequestError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly code?: string,
  ) {
    super(message);
    this.name = 'RecommendationRequestError';
  }
}

async function fetchRecommendation<T>(path: string, init?: RequestInit) {
  const response = await fetch(`${getApiBaseUrl()}${path}`, {
    credentials: 'include',
    ...init,
    headers: {
      ...(init?.body ? { 'Content-Type': 'application/json' } : {}),
      ...init?.headers,
    },
  });

  if (!response.ok) {
    const payload = (await response.json().catch(() => null)) as
      | { message?: string; code?: string }
      | null;
    throw new RecommendationRequestError(
      payload?.message ?? '추천 요청을 처리하지 못했어요.',
      response.status,
      payload?.code,
    );
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

export function createGroupRecommendationSession(
  request: GroupRecommendationSessionRequest,
) {
  return fetchRecommendation<GroupRecommendationSessionResponse>(
    '/v1/recommendation-sessions',
    { method: 'POST', body: JSON.stringify(request) },
  );
}

export function getGroupRecommendationSession(sessionId: string) {
  return fetchRecommendation<GroupRecommendationSessionResponse>(
    `/v1/recommendation-sessions/${encodeURIComponent(sessionId)}`,
  );
}

export function submitGroupRecommendationFeedback(
  exposureId: string,
  request: GroupRecommendationFeedbackRequest,
) {
  return fetchRecommendation<GroupRecommendationFeedbackResponse>(
    `/v1/recommendation-exposures/${encodeURIComponent(exposureId)}/feedback`,
    { method: 'POST', body: JSON.stringify(request) },
  );
}
