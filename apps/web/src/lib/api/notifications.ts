function getApiBaseUrl() {
  if (typeof window === 'undefined') {
    return process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:4000/api';
  }
  return `${window.location.protocol}//${window.location.hostname}:4000/api`;
}

export type CommunityNotificationType = 'DIARY_LIKED' | 'DIARY_COMMENTED' | 'AUTHOR_FOLLOWED';

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
  return parseJsonResponse<CommunityNotificationsResponse>(response, 'community notifications failed');
}

export async function markCommunityNotificationRead(id: string) {
  const response = await fetch(`${getApiBaseUrl()}/notifications/${id}/read`, {
    method: 'PATCH',
    credentials: 'include',
  });
  return parseJsonResponse<CommunityNotificationItem>(response, 'mark notification read failed');
}
