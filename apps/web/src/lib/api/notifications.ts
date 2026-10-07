import { getApiBaseUrl } from './base-url';
import { coreFetch } from './core';

export type CommunityNotificationType =
  'DIARY_LIKED' | 'DIARY_COMMENTED' | 'FRIEND_REQUESTED' | 'FRIEND_ACCEPTED';

export type CommunityNotificationItem = {
  id: string;
  type: CommunityNotificationType;
  actor: {
    id: string;
    nickname: string;
    profileImageUrl: string | null;
  };
  diary: {
    id: string;
    title: string;
  } | null;
  readAt: string | null;
  createdAt: string;
};

export type CommunityNotificationsResponse = {
  unreadCount: number;
  items: CommunityNotificationItem[];
};

async function parseJsonResponse<T>(response: Response, message: string) {
  if (!response.ok) {
    throw new Error(message);
  }
  return (await response.json()) as T;
}

export async function getCommunityNotifications() {
  const response = await fetch(`${getApiBaseUrl()}/notifications`, {
    credentials: 'include',
  });
  return parseJsonResponse<CommunityNotificationsResponse>(
    response,
    'community notifications failed',
  );
}

export async function markCommunityNotificationRead(id: string) {
  const response = await fetch(`${getApiBaseUrl()}/notifications/${id}/read`, {
    method: 'PATCH',
    credentials: 'include',
  });
  return parseJsonResponse<CommunityNotificationItem>(response, 'mark notification read failed');
}

export type NotificationKind =
  | 'DIARY_LIKED'
  | 'DIARY_COMMENTED'
  | 'FRIEND_REQUESTED'
  | 'FRIEND_ACCEPTED'
  | 'SPACE_INVITE'
  | 'WATCH_PARTICIPATION_REQUESTED'
  | 'WATCH_SHARED'
  | 'REVIEW_REVEALED'
  | 'REVIEW_LIKED'
  | 'WISH_MATCHED'
  | 'SPACE_INVITE_DECLINED'
  | 'RECOMMENDATION_REQUESTED'
  | 'RECOMMENDATION_MATCHED';

export type NotificationItem = {
  id: string;
  type: NotificationKind;
  actor: { id: string; nickname: string; profileImageUrl: string | null };
  diary: { id: string; title: string } | null;
  media: { id: string; title: string } | null;
  readAt: string | null;
  createdAt: string;
};

export function listNotifications() {
  return coreFetch<{ unreadCount: number; items: NotificationItem[] }>('/notifications');
}

export function getUnreadNotificationCount() {
  return coreFetch<{ unreadCount: number }>('/notifications/unread-count').then(
    (value) => value.unreadCount,
  );
}

export function markNotificationRead(id: string) {
  return coreFetch<NotificationItem>(`/notifications/${encodeURIComponent(id)}/read`, {
    method: 'PATCH',
  });
}

export function markAllNotificationsRead() {
  return coreFetch<{ unreadCount: number }>('/notifications/read-all', { method: 'PATCH' });
}

export type NotificationPreferenceCategory =
  'SPACE_INVITE' | 'WATCH_PARTICIPATION' | 'SOCIAL' | 'RECOMMENDATION';

export type NotificationPreference = {
  category: NotificationPreferenceCategory;
  /** Invites and "함께 봤나요?" requests always arrive. */
  required: boolean;
  enabled: boolean;
};

export function listNotificationPreferences() {
  return coreFetch<{ items: NotificationPreference[] }>('/notifications/preferences').then(
    (response) => response.items,
  );
}

export function setNotificationPreference(
  category: NotificationPreferenceCategory,
  enabled: boolean,
) {
  return coreFetch<NotificationPreference>('/notifications/preferences', {
    method: 'PUT',
    body: JSON.stringify({ category, enabled }),
  });
}
