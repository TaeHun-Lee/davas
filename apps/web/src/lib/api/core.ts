import type {
  ApiErrorBody,
  CursorPage,
  DiaryVisibility,
  MediaType,
  RecordCardData,
  RecordCreateInput,
  RecordDetailData,
  RecordFilters,
  RecordUpdateInput,
  ViewingMethod,
} from '@davas/shared';
import { safeCoreReturnTo } from '../core-routes';
import { getApiBaseUrl } from './base-url';

export type {
  ApiErrorBody,
  CursorPage,
  RecordCardData,
  RecordDetailData,
  RecordFilters,
} from '@davas/shared';
export type {
  RecordCreateInput as RecordCreatePayload,
  RecordUpdateInput as RecordUpdatePayload,
} from '@davas/shared';

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

export type CoreFetchOptions = {
  auth?: 'required' | 'optional';
};

export function coreFetch(
  path: string,
  init?: RequestInit,
  options?: CoreFetchOptions,
): Promise<void>;
export function coreFetch<T>(
  path: string,
  init?: RequestInit,
  options?: CoreFetchOptions,
): Promise<T>;
export async function coreFetch<T>(
  path: string,
  init: RequestInit = {},
  options: CoreFetchOptions = {},
): Promise<T | void> {
  const hasJsonBody = Boolean(init.body) && !isFormDataBody(init.body);
  const response = await fetch(`${getApiBaseUrl()}${path}`, {
    ...init,
    credentials: 'include',
    headers: {
      ...(hasJsonBody ? { 'Content-Type': 'application/json' } : {}),
      ...init.headers,
    },
  });

  if (response.status === 401 && options.auth !== 'optional' && typeof window !== 'undefined') {
    try {
      await fetch(`${getApiBaseUrl()}/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      });
    } catch {
      // If the API is unreachable it cannot clear the HttpOnly cookie. Continue
      // with local recovery so the browser does not preserve authenticated UI.
    }
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

  if (response.status === 204) return;
  return response.json() as Promise<T>;
}

const query = (filters: RecordFilters) => {
  const parameters = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== '') {
      parameters.set(key, String(value));
    }
  });
  return parameters.toString();
};

export function listRecords(scope: 'friends' | 'mine', filters: RecordFilters) {
  return coreFetch<CursorPage<RecordCardData>>(
    `/diaries/${scope === 'friends' ? 'feed' : 'me'}?${query(filters)}`,
  );
}

export function getRecord(id: string) {
  return coreFetch<{ diary: RecordDetailData }>(`/diaries/${encodeURIComponent(id)}`).then(
    (value) => value.diary,
  );
}

export type RecordWritePayload = RecordCreateInput;

export function toRecordUpdatePayload(payload: RecordUpdateInput): RecordUpdateInput {
  const projected: RecordUpdateInput = {};

  if (payload.mediaId !== undefined) projected.mediaId = payload.mediaId;
  if (payload.viewingMethod !== undefined) {
    projected.viewingMethod = payload.viewingMethod;
  }
  if (payload.watchedDate !== undefined) {
    projected.watchedDate = payload.watchedDate;
  }
  if (payload.rating !== undefined) projected.rating = payload.rating;
  if (payload.content !== undefined) projected.content = payload.content;
  if (payload.hasSpoiler !== undefined) {
    projected.hasSpoiler = payload.hasSpoiler;
  }
  if (payload.visibility !== undefined) {
    projected.visibility = payload.visibility;
  }

  return projected;
}

export function createRecord(payload: RecordCreateInput) {
  return coreFetch<{ diary: RecordDetailData; deduplicated: boolean }>('/diaries', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function updateRecord(id: string, payload: RecordUpdateInput) {
  return coreFetch<{ diary: RecordDetailData }>(`/diaries/${encodeURIComponent(id)}`, {
    method: 'PATCH',
    body: JSON.stringify(toRecordUpdatePayload(payload)),
  });
}

export function deleteRecord(id: string) {
  return coreFetch<{ id: string; deleted: true }>(`/diaries/${encodeURIComponent(id)}`, {
    method: 'DELETE',
  });
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
