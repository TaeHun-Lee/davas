import { coreFetch } from './core';

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
  | 'RECOMMENDATION_MATCHED'
  | 'PHOTOS_ADDED';

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
