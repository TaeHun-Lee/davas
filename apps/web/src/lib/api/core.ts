import type { DiaryVisibility, MediaType, ViewingMethod } from '@davas/shared';
import { safeCoreReturnTo } from '../core-routes';
import { getApiBaseUrl } from './base-url';

export type ApiErrorBody = {
  statusCode: number;
  code: string;
  message: string;
  details?: Record<string, unknown>;
};
export class CoreApiError extends Error {
  constructor(
    public status: number,
    public body: ApiErrorBody,
  ) {
    super(body.message);
  }
}

export function purgeSessionDrafts() {
  if (typeof window === 'undefined') return;
  for (let index = sessionStorage.length - 1; index >= 0; index -= 1) {
    const key = sessionStorage.key(index);
    if (key?.startsWith('davas:draft:')) sessionStorage.removeItem(key);
  }
}

function isFormDataBody(body: BodyInit | null | undefined) {
  return typeof FormData !== 'undefined' && body instanceof FormData;
}

export type CoreFetchOptions = { auth?: 'required' | 'optional' };

export async function coreFetch<T>(
  path: string,
  init: RequestInit = {},
  options: CoreFetchOptions = {},
): Promise<T> {
  const hasJsonBody = Boolean(init.body) && !isFormDataBody(init.body);
  const response = await fetch(`${getApiBaseUrl()}${path}`, {
    ...init,
    credentials: 'include',
    headers: { ...(hasJsonBody ? { 'Content-Type': 'application/json' } : {}), ...init.headers },
  });
  if (response.status === 401 && options.auth !== 'optional' && typeof window !== 'undefined') {
    // Best effort: an unreachable API cannot clear the HttpOnly cookie, but the UI must still sign out.
    await fetch(`${getApiBaseUrl()}/auth/logout`, { method: 'POST', credentials: 'include' }).catch(
      () => undefined,
    );
    purgeSessionDrafts();
    const returnTo = safeCoreReturnTo(`${location.pathname}${location.search}`, '/');
    location.assign(`/login?returnTo=${encodeURIComponent(returnTo)}`);
    throw new CoreApiError(401, {
      statusCode: 401,
      code: 'UNAUTHORIZED',
      message: '다시 로그인해 주세요.',
    });
  }
  if (!response.ok) {
    const body = (await response.json().catch(() => ({
      statusCode: response.status,
      code: 'REQUEST_FAILED',
      message: '요청을 처리하지 못했어요.',
    }))) as ApiErrorBody;
    throw new CoreApiError(response.status, body);
  }
  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}

export type RecordCardData = {
  id: string;
  recordTitle?: string;
  author: { id: string; nickname: string; profileImageUrl: string | null };
  media: {
    id: string;
    title: string;
    originalTitle: string | null;
    posterUrl: string | null;
    releaseYear: string | null;
    mediaType: MediaType;
  };
  viewingMethod: ViewingMethod | null;
  watchedDate: string;
  rating: number | null;
  reviewPreview: string | null;
  hasSpoiler: boolean;
  visibility: DiaryVisibility;
  sharedAt: string | null;
  createdAt: string;
  isMine: boolean;
};
export type CursorPage<T> = { items: T[]; nextCursor: string | null; hasMore: boolean };
export type RecordFilters = {
  q?: string;
  mediaId?: string;
  mediaType?: MediaType;
  viewingMethod?: ViewingMethod;
  cursor?: string;
  limit?: number;
};

const query = (filters: RecordFilters) => {
  const p = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== '') p.set(key, String(value));
  });
  return p.toString();
};
export function listRecords(scope: 'friends' | 'mine', filters: RecordFilters) {
  return coreFetch<CursorPage<RecordCardData>>(
    `/diaries/${scope === 'friends' ? 'feed' : 'me'}?${query(filters)}`,
  );
}

export const mediaTypeLabel = (value: MediaType) => (value === 'MOVIE' ? '영화' : '드라마');
export const viewingMethodLabel = (value: ViewingMethod | null) =>
  value === 'THEATER' ? '영화관' : value === 'OTT' ? 'OTT' : '본 곳 미입력';
export const visibilityLabel = (value: DiaryVisibility) =>
  value === 'FRIENDS'
    ? '친구 공개'
    : value === 'PRIVATE'
      ? '나만 보기'
      : '일부 친구 공개(이전 방식)';
