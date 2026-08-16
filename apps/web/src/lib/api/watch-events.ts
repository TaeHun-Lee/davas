import type {
  SpaceReactionComparison,
  WatchEventView,
  WatchEventWriteRequest,
  WatchParticipantStatus,
  WatchParticipantView,
  WatchReactionView,
  WatchSourceKind,
  WatchSourceView,
  WatchTimelinePage,
} from '@davas/shared';
import { coreFetch } from './core';

export type { SpaceReactionComparison, WatchParticipantStatus, WatchSourceKind };
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
  return coreFetch<{ watchEvent: WatchEvent }>(
    `/v1/watch-events/${encode(watchEventId)}`,
  ).then((value) => value.watchEvent);
}

export function updateWatchEvent(
  watchEventId: string,
  payload: Partial<Omit<WatchEventWritePayload, 'participantAccountIds'>>,
) {
  return coreFetch<{ watchEvent: WatchEvent }>(
    `/v1/watch-events/${encode(watchEventId)}`,
    { method: 'PATCH', body: JSON.stringify(payload) },
  ).then((value) => value.watchEvent);
}

export function deleteWatchEvent(watchEventId: string) {
  return coreFetch<{ deleted: true; id: string }>(
    `/v1/watch-events/${encode(watchEventId)}`,
    { method: 'DELETE' },
  );
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

export function saveWatchReaction(
  watchEventId: string,
  payload: { rating?: number | null; review?: string | null },
) {
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
  return coreFetch<WatchTimelinePage>(
    `/v1/spaces/${encode(spaceId)}/timeline${suffix}`,
  );
}

export function compareSpaceReactions(spaceId: string, mediaId: string) {
  return coreFetch<SpaceReactionComparison>(
    `/v1/spaces/${encode(spaceId)}/titles/${encode(mediaId)}/reactions`,
  );
}
