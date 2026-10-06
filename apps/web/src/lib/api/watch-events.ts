import type {
  SpaceReactionComparison,
  TheaterFormat,
  WatchCommentView,
  WatchEventView,
  WatchEventWriteRequest,
  WatchParticipantStatus,
  WatchParticipantView,
  WatchPhotoView,
  WatchReactionView,
  WatchReactionWriteFields,
  WatchReviewLikeResponse,
  WatchSourceKind,
  WatchSourceView,
  WatchTimelinePage,
} from '@davas/shared';
import { getApiBaseUrl } from './base-url';
import { CoreApiError, coreFetch, type ApiErrorBody } from './core';

export type {
  SpaceReactionComparison,
  TheaterFormat,
  WatchCommentView,
  WatchParticipantStatus,
  WatchPhotoView,
  WatchSourceKind,
};
export type WatchSource = WatchSourceView;
export type WatchParticipant = WatchParticipantView;
export type WatchReaction = WatchReactionView;
export type WatchEvent = WatchEventView;
export type WatchEventWritePayload = WatchEventWriteRequest;

const encode = (value: string) => encodeURIComponent(value);

export function createWatchEvent(payload: WatchEventWritePayload) {
  return coreFetch<{ watchEvent: WatchEvent }>('/v1/watch-events', {
    method: 'POST',
    body: JSON.stringify(payload),
  }).then((value) => value.watchEvent);
}

export function getWatchEvent(watchEventId: string) {
  return coreFetch<{ watchEvent: WatchEvent }>(`/v1/watch-events/${encode(watchEventId)}`).then(
    (value) => value.watchEvent,
  );
}

export function updateWatchEvent(
  watchEventId: string,
  payload: Partial<Omit<WatchEventWritePayload, 'participantAccountIds'>>,
) {
  return coreFetch<{ watchEvent: WatchEvent }>(`/v1/watch-events/${encode(watchEventId)}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  }).then((value) => value.watchEvent);
}

export function deleteWatchEvent(watchEventId: string) {
  return coreFetch<{ deleted: true; id: string }>(`/v1/watch-events/${encode(watchEventId)}`, {
    method: 'DELETE',
  });
}

export function respondToWatchParticipation(
  watchEventId: string,
  status: Extract<WatchParticipantStatus, 'CONFIRMED' | 'DECLINED'>,
) {
  return coreFetch<{ participant: WatchParticipant }>(
    `/v1/watch-events/${encode(watchEventId)}/participants/me`,
    { method: 'PATCH', body: JSON.stringify({ status }) },
  ).then((value) => value.participant);
}

export function saveWatchReaction(watchEventId: string, payload: WatchReactionWriteFields) {
  return coreFetch<{ reaction: WatchReaction }>(
    `/v1/watch-events/${encode(watchEventId)}/reaction`,
    { method: 'PUT', body: JSON.stringify(payload) },
  ).then((value) => value.reaction);
}

export function getSpaceTimeline(
  spaceId: string,
  options: { cursor?: string; limit?: number } = {},
) {
  const params = new URLSearchParams();
  if (options.cursor) params.set('cursor', options.cursor);
  if (options.limit) params.set('limit', String(options.limit));
  const suffix = params.size ? `?${params.toString()}` : '';
  return coreFetch<WatchTimelinePage>(`/v1/spaces/${encode(spaceId)}/timeline${suffix}`);
}

export function compareSpaceReactions(spaceId: string, mediaId: string) {
  return coreFetch<SpaceReactionComparison>(
    `/v1/spaces/${encode(spaceId)}/titles/${encode(mediaId)}/reactions`,
  );
}

export function setReviewLike(watchEventId: string, reactionId: string, liked: boolean) {
  return coreFetch<WatchReviewLikeResponse>(
    `/v1/watch-events/${encode(watchEventId)}/reactions/${encode(reactionId)}/like`,
    { method: liked ? 'PUT' : 'DELETE' },
  );
}

// Comments live on the record (the `diaries` row a watch event is stored in).
export function listWatchComments(watchEventId: string) {
  return coreFetch<{ diaryId: string; items: WatchCommentView[] }>(
    `/diaries/${encode(watchEventId)}/comments`,
  ).then((value) => value.items);
}

export function createWatchComment(watchEventId: string, content: string) {
  return coreFetch<WatchCommentView>(`/diaries/${encode(watchEventId)}/comments`, {
    method: 'POST',
    body: JSON.stringify({ content }),
  });
}

export function deleteWatchComment(commentId: string) {
  return coreFetch<{ id: string; deleted: true }>(`/comments/${encode(commentId)}`, {
    method: 'DELETE',
  });
}

/** Photo paths from the API are relative to the API base URL. */
export function photoSrc(path: string) {
  return `${getApiBaseUrl()}${path}`;
}

/**
 * Uploads one photo before the record is saved. Uses XMLHttpRequest because fetch cannot
 * report upload progress. A 401 here only fails the upload; the next regular request signs
 * the user out as usual.
 */
export function uploadWatchPhoto(
  file: File,
  onProgress: (percent: number) => void,
  signal?: AbortSignal,
): Promise<WatchPhotoView> {
  return new Promise((resolve, reject) => {
    const request = new XMLHttpRequest();
    request.open('POST', `${getApiBaseUrl()}/v1/watch-photos`);
    request.withCredentials = true;
    request.responseType = 'json';
    request.upload.onprogress = (event) => {
      if (event.lengthComputable) onProgress(Math.round((event.loaded / event.total) * 100));
    };
    request.onload = () => {
      const body = request.response as { photo?: WatchPhotoView } | ApiErrorBody | null;
      if (request.status >= 200 && request.status < 300 && body && 'photo' in body && body.photo) {
        resolve(body.photo);
        return;
      }
      reject(
        new CoreApiError(
          request.status,
          body && 'code' in body
            ? body
            : {
                statusCode: request.status,
                code: 'UPLOAD_FAILED',
                message: '사진을 올리지 못했어요.',
              },
        ),
      );
    };
    request.onerror = () =>
      reject(
        new CoreApiError(0, {
          statusCode: 0,
          code: 'NETWORK_ERROR',
          message: '연결이 끊겨 사진을 올리지 못했어요.',
        }),
      );
    request.onabort = () =>
      reject(
        new CoreApiError(0, { statusCode: 0, code: 'ABORTED', message: '올리기를 취소했어요.' }),
      );
    signal?.addEventListener('abort', () => request.abort(), { once: true });
    const form = new FormData();
    form.append('file', file);
    request.send(form);
  });
}
