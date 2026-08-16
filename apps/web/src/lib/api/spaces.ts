import type {
  SpaceInvite,
  SpaceInviteInspection,
  SpaceView,
} from '@davas/shared';
import { coreFetch } from './core';

export type {
  SpaceInvite,
  SpaceInviteInspection,
  SpaceMember,
  SpaceMembershipStatus,
  SpaceRole,
  SpaceStatus,
  SpaceView,
} from '@davas/shared';

const encode = encodeURIComponent;

export function listSpaces() {
  return coreFetch<{ items: SpaceView[] }>('/v1/spaces');
}

export function getSpace(spaceId: string) {
  return coreFetch<SpaceView>(`/v1/spaces/${encode(spaceId)}`);
}

export function createSpace(name: string, maxMembers: number) {
  return coreFetch<SpaceView>('/v1/spaces', {
    method: 'POST',
    body: JSON.stringify({ name, maxMembers }),
  });
}

export function createSpaceInvite(
  spaceId: string,
  expiresInHours: number,
) {
  return coreFetch<SpaceInvite>(`/v1/spaces/${encode(spaceId)}/invites`, {
    method: 'POST',
    body: JSON.stringify({ expiresInHours }),
  });
}

export function cancelSpaceInvite(spaceId: string, inviteId: string) {
  return coreFetch<{ id: string; status: 'CANCELLED' }>(
    `/v1/spaces/${encode(spaceId)}/invites/${encode(inviteId)}`,
    { method: 'DELETE' },
  );
}

export function inspectSpaceInvite(token: string) {
  return coreFetch<SpaceInviteInspection>(`/v1/invites/${encode(token)}`);
}

export function acceptSpaceInvite(token: string) {
  return coreFetch<{ joined: true; spaceId: string; membershipId: string }>(
    `/v1/invites/${encode(token)}/accept`,
    { method: 'POST' },
  );
}

export function transferSpaceOwnership(
  spaceId: string,
  newOwnerAccountId: string,
) {
  return coreFetch<SpaceView>(`/v1/spaces/${encode(spaceId)}/owner`, {
    method: 'PATCH',
    body: JSON.stringify({ newOwnerAccountId }),
  });
}

export function leaveSpace(spaceId: string) {
  return coreFetch<{ left: true; spaceId: string }>(
    `/v1/spaces/${encode(spaceId)}/members/me`,
    { method: 'DELETE' },
  );
}

export function closeSpace(spaceId: string) {
  return coreFetch<{ closed: true; spaceId: string; closedAt: string }>(
    `/v1/spaces/${encode(spaceId)}`,
    { method: 'DELETE' },
  );
}
