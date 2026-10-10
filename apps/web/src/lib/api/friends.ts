import type {
  FriendInviteState,
  FriendRow,
  FriendsResponse,
  FriendshipMutationResponse,
  FriendUser,
} from '@davas/shared';
import { coreFetch } from './core';

export type { FriendInviteState, FriendRow, FriendsResponse, FriendUser };

const id = (value: string) => encodeURIComponent(value);

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

export function acceptFriend(requestId: string) {
  return coreFetch<FriendshipMutationResponse>(`/friends/requests/${id(requestId)}/accept`, {
    method: 'PATCH',
  });
}

export function rejectFriend(requestId: string) {
  return coreFetch<FriendshipMutationResponse>(`/friends/requests/${id(requestId)}/reject`, {
    method: 'PATCH',
  });
}

export function cancelFriend(requestId: string) {
  return coreFetch<{ deleted: true }>(`/friends/requests/${id(requestId)}`, { method: 'DELETE' });
}

export function removeFriend(friendshipId: string) {
  return coreFetch<{ deleted: true }>(`/friends/${id(friendshipId)}`, { method: 'DELETE' });
}

export function createFriendInvite() {
  return coreFetch<{ token: string; expiresAt: string }>('/friends/invites', { method: 'POST' });
}

/** Anyone holding the link may look at it, signed in or not. */
export function inspectFriendInvite(token: string) {
  return coreFetch<FriendInviteState>(`/friends/invites/${id(token)}`, {}, { auth: 'optional' });
}

export function acceptFriendInvite(token: string) {
  return coreFetch<{ connected: true; inviter: FriendUser }>(
    `/friends/invites/${id(token)}/accept`,
    { method: 'POST' },
  );
}
