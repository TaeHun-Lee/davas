import type { DiaryVisibility, MediaType, ViewingMethod } from '@davas/shared';
import { getApiBaseUrl } from './base-url';

export type ApiErrorBody = { statusCode: number; code: string; message: string; details?: Record<string, unknown> };
export class CoreApiError extends Error { constructor(public status: number, public body: ApiErrorBody) { super(body.message); } }

export function purgeSessionDrafts() {
  if (typeof window === 'undefined') return;
  for (let index = sessionStorage.length - 1; index >= 0; index -= 1) {
    const key = sessionStorage.key(index);
    if (key?.startsWith('davas:draft:')) sessionStorage.removeItem(key);
  }
}

export async function coreFetch<T>(path: string, init: RequestInit = {}): Promise<T> {
  const response = await fetch(`${getApiBaseUrl()}${path}`, { ...init, credentials: 'include', headers: { ...(init.body ? { 'Content-Type': 'application/json' } : {}), ...init.headers } });
  if (response.status === 401 && typeof window !== 'undefined') {
    await fetch(`${getApiBaseUrl()}/auth/logout`, { method: 'POST', credentials: 'include' }).catch(() => undefined);
    purgeSessionDrafts();
    const returnTo = `${location.pathname}${location.search}`;
    location.assign(`/login?returnTo=${encodeURIComponent(returnTo.startsWith('/') ? returnTo : '/')}`);
    throw new CoreApiError(401, { statusCode: 401, code: 'UNAUTHORIZED', message: '다시 로그인해 주세요.' });
  }
  if (!response.ok) {
    const body = await response.json().catch(() => ({ statusCode: response.status, code: 'REQUEST_FAILED', message: '요청을 처리하지 못했어요.' })) as ApiErrorBody;
    throw new CoreApiError(response.status, body);
  }
  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}

export type RecordCardData = {
  id: string; recordTitle?: string; author: { id: string; nickname: string; profileImageUrl: string | null };
  media: { id: string; title: string; originalTitle: string | null; posterUrl: string | null; releaseYear: string | null; mediaType: MediaType };
  viewingMethod: ViewingMethod | null; watchedDate: string; rating: number | null; reviewPreview: string | null;
  hasSpoiler: boolean; visibility: DiaryVisibility; sharedAt: string | null; createdAt: string; isMine: boolean;
};
export type RecordDetailData = RecordCardData & { content: string; updatedAt: string; selectedUserIds?: string[] };
export type CursorPage<T> = { items: T[]; nextCursor: string | null; hasMore: boolean };
export type RecordFilters = { q?: string; mediaId?: string; mediaType?: MediaType; viewingMethod?: ViewingMethod; cursor?: string; limit?: number };

const query = (filters: RecordFilters) => { const p = new URLSearchParams(); Object.entries(filters).forEach(([key, value]) => { if (value !== undefined && value !== '') p.set(key, String(value)); }); return p.toString(); };
export function listRecords(scope: 'friends' | 'mine', filters: RecordFilters) { return coreFetch<CursorPage<RecordCardData>>(`/diaries/${scope === 'friends' ? 'feed' : 'me'}?${query(filters)}`); }
export function getRecord(id: string) { return coreFetch<{ diary: RecordDetailData }>(`/diaries/${encodeURIComponent(id)}`).then((value) => value.diary); }
export type RecordWritePayload = { mediaId: string; viewingMethod: ViewingMethod; watchedDate: string; rating: number | null; content: string; hasSpoiler: boolean; visibility: 'FRIENDS' | 'PRIVATE'; clientRequestId: string; allowDuplicate?: boolean };
export function createRecord(payload: RecordWritePayload) { return coreFetch<{ diary: RecordDetailData; deduplicated: boolean }>('/diaries', { method: 'POST', body: JSON.stringify(payload) }); }
export function updateRecord(id: string, payload: Partial<Omit<RecordWritePayload, 'clientRequestId' | 'allowDuplicate'>>) { return coreFetch<{ diary: RecordDetailData }>(`/diaries/${encodeURIComponent(id)}`, { method: 'PATCH', body: JSON.stringify(payload) }); }
export function deleteRecord(id: string) { return coreFetch<{ id: string; deleted: true }>(`/diaries/${encodeURIComponent(id)}`, { method: 'DELETE' }); }

export const mediaTypeLabel = (value: MediaType) => value === 'MOVIE' ? '영화' : '드라마';
export const viewingMethodLabel = (value: ViewingMethod | null) => value === 'THEATER' ? '영화관' : value === 'OTT' ? 'OTT' : '본 곳 미입력';
export const visibilityLabel = (value: DiaryVisibility) => value === 'FRIENDS' ? '친구 공개' : value === 'PRIVATE' ? '나만 보기' : '일부 친구 공개(이전 방식)';
