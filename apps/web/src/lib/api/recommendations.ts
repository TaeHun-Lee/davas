import type {
  GroupRecommendationDecidedPickResponse,
  GroupRecommendationDecisionRequest,
  GroupRecommendationFeedbackRequest,
  GroupRecommendationFeedbackResponse,
  GroupRecommendationSessionRequest,
  GroupRecommendationSessionListResponse,
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

export type GenreRecommendationsResponse = RecommendationListResponse & {
  preset: GenreRecommendationPreset;
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
    const payload = (await response.json().catch(() => null)) as {
      message?: string;
      code?: string;
    } | null;
    throw new RecommendationRequestError(
      payload?.message ?? '추천 요청을 처리하지 못했어요.',
      response.status,
      payload?.code,
    );
  }

  return (await response.json()) as T;
}

export async function getTrendingRecommendations({
  limit = 10,
  page = 1,
  language = 'ko-KR',
}: { limit?: number; page?: number; language?: string } = {}) {
  const params = new URLSearchParams();
  params.set('limit', String(limit));
  params.set('page', String(page));
  params.set('language', language);

  return fetchRecommendation<RecommendationListResponse>(
    `/recommendations/trending?${params.toString()}`,
  );
}

export async function getGenreRecommendations(
  presetId: string,
  {
    limit = 4,
    page = 1,
    language = 'ko-KR',
  }: { limit?: number; page?: number; language?: string } = {},
) {
  const params = new URLSearchParams();
  params.set('limit', String(limit));
  params.set('page', String(page));
  params.set('language', language);

  return fetchRecommendation<GenreRecommendationsResponse>(
    `/recommendations/genres/${presetId}?${params.toString()}`,
  );
}

export function createGroupRecommendationSession(request: GroupRecommendationSessionRequest) {
  return fetchRecommendation<GroupRecommendationSessionResponse>('/v1/recommendation-sessions', {
    method: 'POST',
    body: JSON.stringify(request),
  });
}

/** Recent picks in the space that I started or was asked into. */
export function listGroupRecommendationSessions(spaceId: string) {
  return fetchRecommendation<GroupRecommendationSessionListResponse>(
    `/v1/spaces/${encodeURIComponent(spaceId)}/recommendation-sessions`,
  );
}

export function getGroupRecommendationSession(sessionId: string) {
  return fetchRecommendation<GroupRecommendationSessionResponse>(
    `/v1/recommendation-sessions/${encodeURIComponent(sessionId)}`,
  );
}

/** "이걸로 볼게요": settle a pick on a title everyone needed agreed on. */
export function decideGroupRecommendation(
  sessionId: string,
  request: GroupRecommendationDecisionRequest,
) {
  return fetchRecommendation<GroupRecommendationSessionResponse>(
    `/v1/recommendation-sessions/${encodeURIComponent(sessionId)}/decision`,
    { method: 'POST', body: JSON.stringify(request) },
  );
}

/** "그만 고르기": the person who started a pick ends it without a title. */
export function closeGroupRecommendationSession(sessionId: string) {
  return fetchRecommendation<GroupRecommendationSessionResponse>(
    `/v1/recommendation-sessions/${encodeURIComponent(sessionId)}/close`,
    { method: 'POST' },
  );
}

/** The title my latest pick in the space settled on, for home's "오늘 밤 후보". */
export function getDecidedGroupRecommendation(spaceId: string) {
  return fetchRecommendation<GroupRecommendationDecidedPickResponse>(
    `/v1/spaces/${encodeURIComponent(spaceId)}/recommendation-sessions/decided`,
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
