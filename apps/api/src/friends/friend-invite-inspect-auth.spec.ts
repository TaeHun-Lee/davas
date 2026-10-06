import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { GUARDS_METADATA } from '@nestjs/common/constants';
import { FriendInvitesController } from './friend-invites.controller';
import type { FriendInvitesService } from './friend-invites.service';
import { OptionalJwtCookieAuthGuard } from '../auth/optional-jwt-cookie-auth.guard';
import type { OptionallyAuthenticatedRequest } from '../auth/optional-jwt-cookie-auth.guard';

const viewer = {
  id: '10000000-0000-0000-0000-000000000001',
  email: 'viewer@example.test',
  nickname: 'viewer',
  profileImageUrl: null,
  bio: null,
  preferredGenres: [],
};

describe('friend invite inspection authentication', () => {
  it('passes an optional authenticated viewer to the invite service', async () => {
    const calls: Array<[string, string | undefined]> = [];
    const service = {
      inspect: async (token: string, viewerId?: string) => {
        calls.push([token, viewerId]);
        return { status: 'VALID' as const };
      },
    } as unknown as FriendInvitesService;
    const controller = new FriendInvitesController(service);

    await controller.inspect('invite-token', {
      headers: {},
      user: viewer,
    } as unknown as OptionallyAuthenticatedRequest);
    await controller.inspect('anonymous-token', {
      headers: {},
    } as unknown as OptionallyAuthenticatedRequest);

    assert.deepEqual(calls, [
      ['invite-token', viewer.id],
      ['anonymous-token', undefined],
    ]);
  });

  it('applies the optional authentication guard only to inspection', () => {
    const guards = Reflect.getMetadata(
      GUARDS_METADATA,
      FriendInvitesController.prototype.inspect,
    ) as unknown[];
    assert.deepEqual(guards, [OptionalJwtCookieAuthGuard]);
  });
});
