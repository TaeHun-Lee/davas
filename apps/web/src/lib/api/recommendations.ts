import { DEFAULT_LANGUAGE } from '@davas/shared';
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
import { coreFetch } from './core';

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

export async function getTrendingRecommendations({
  limit = 10,
  page = 1,
  language = DEFAULT_LANGUAGE,
}: { limit?: number; page?: number; language?: string } = {}) {
  const params = new URLSearchParams();
  params.set('limit', String(limit));
  params.set('page', String(page));
  params.set('language', language);

  return coreFetch<RecommendationListResponse>(`/recommendations/trending?${params.toString()}`);
}

export async function getGenreRecommendations(
  presetId: string,
  {
    limit = 4,
    page = 1,
    language = DEFAULT_LANGUAGE,
  }: { limit?: number; page?: number; language?: string } = {},
) {
  const params = new URLSearchParams();
  params.set('limit', String(limit));
  params.set('page', String(page));
  params.set('language', language);

  return coreFetch<GenreRecommendationsResponse>(
    `/recommendations/genres/${presetId}?${params.toString()}`,
  );
}

export function createGroupRecommendationSession(request: GroupRecommendationSessionRequest) {
  return coreFetch<GroupRecommendationSessionResponse>('/v1/recommendation-sessions', {
    method: 'POST',
    body: JSON.stringify(request),
  });
}

/** Recent picks in the space that I started or was asked into. */
export function listGroupRecommendationSessions(spaceId: string) {
  return coreFetch<GroupRecommendationSessionListResponse>(
    `/v1/spaces/${encodeURIComponent(spaceId)}/recommendation-sessions`,
  );
}

export function getGroupRecommendationSession(sessionId: string) {
  return coreFetch<GroupRecommendationSessionResponse>(
    `/v1/recommendation-sessions/${encodeURIComponent(sessionId)}`,
  );
}

/** "이걸로 볼게요": settle a pick on a title everyone needed agreed on. */
export function decideGroupRecommendation(
  sessionId: string,
  request: GroupRecommendationDecisionRequest,
) {
  return coreFetch<GroupRecommendationSessionResponse>(
    `/v1/recommendation-sessions/${encodeURIComponent(sessionId)}/decision`,
    { method: 'POST', body: JSON.stringify(request) },
  );
}

/** "그만 고르기": the person who started a pick ends it without a title. */
export function closeGroupRecommendationSession(sessionId: string) {
  return coreFetch<GroupRecommendationSessionResponse>(
    `/v1/recommendation-sessions/${encodeURIComponent(sessionId)}/close`,
    { method: 'POST' },
  );
}

/** The title my latest pick in the space settled on, for home's "오늘 밤 후보". */
export function getDecidedGroupRecommendation(spaceId: string) {
  return coreFetch<GroupRecommendationDecidedPickResponse>(
    `/v1/spaces/${encodeURIComponent(spaceId)}/recommendation-sessions/decided`,
  );
}

export function submitGroupRecommendationFeedback(
  exposureId: string,
  request: GroupRecommendationFeedbackRequest,
) {
  return coreFetch<GroupRecommendationFeedbackResponse>(
    `/v1/recommendation-exposures/${encodeURIComponent(exposureId)}/feedback`,
    { method: 'POST', body: JSON.stringify(request) },
  );
}
