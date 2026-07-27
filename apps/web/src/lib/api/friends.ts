import type {
  DeleteResult,
  FriendInviteState,
  FriendshipMutationResponse,
  FriendsResponse,
  FriendUser,
} from '@davas/shared';
import { coreFetch } from './core';

export type { FriendInviteState, FriendRow, FriendsResponse, FriendUser } from '@davas/shared';

export function getFriends() {
  return coreFetch<FriendsResponse>('/friends');
}

export function searchFriends(q: string) {
  return coreFetch<{ items: FriendUser[] }>(`/friends/search?q=${encodeURIComponent(q)}`);
}

export function requestFriend(userId: string) {
  return coreFetch<FriendshipMutationResponse>('/friends/requests', {
    method: 'POST',
    body: JSON.stringify({ userId }),
  });
}

export function acceptFriend(id: string) {
  return coreFetch<FriendshipMutationResponse>(`/friends/requests/${id}/accept`, {
    method: 'PATCH',
  });
}

export function rejectFriend(id: string) {
  return coreFetch<FriendshipMutationResponse>(`/friends/requests/${id}/reject`, {
    method: 'PATCH',
  });
}

export function cancelFriend(id: string) {
  return coreFetch<DeleteResult>(`/friends/requests/${id}`, {
    method: 'DELETE',
  });
}

export function removeFriend(id: string) {
  return coreFetch<DeleteResult>(`/friends/${id}`, { method: 'DELETE' });
}

export function createFriendInvite() {
  return coreFetch<{ token: string; expiresAt: string }>('/friends/invites', {
    method: 'POST',
  });
}

export function inspectFriendInvite(token: string) {
  return coreFetch<FriendInviteState>(
    `/friends/invites/${encodeURIComponent(token)}`,
    {},
    { auth: 'optional' },
  );
}

export function acceptFriendInvite(token: string) {
  return coreFetch<{ connected: true; inviter: FriendUser }>(
    `/friends/invites/${encodeURIComponent(token)}/accept`,
    { method: 'POST' },
  );
}
