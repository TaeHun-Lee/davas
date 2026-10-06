import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { friendInviteStateAfterAcceptError, loadFriendInvite } from './friend-invite-model';

const validInvite = {
  status: 'VALID' as const,
  inviter: { id: 'user-1', nickname: '친구', profileImageUrl: null },
  expiresAt: '2026-08-03T00:00:00.000Z',
};

describe('friend invite loading model', () => {
  it('keeps network failures separate from an expired invite', async () => {
    const result = await loadFriendInvite(
      'token',
      async () => {
        throw new Error('network');
      },
      async () => ({ id: 'viewer' }),
    );

    assert.equal(result.state, null);
    assert.equal(result.authenticated, true);
    assert.equal(result.failed, true);
  });

  it('uses EXPIRED only when the API returns EXPIRED', async () => {
    const result = await loadFriendInvite(
      'token',
      async () => ({ status: 'EXPIRED' as const }),
      async () => {
        throw new Error('anonymous');
      },
    );

    assert.deepEqual(result.state, { status: 'EXPIRED' });
    assert.equal(result.authenticated, false);
    assert.equal(result.failed, false);
  });

  it('does not discard a valid invite when optional authentication fails', async () => {
    const result = await loadFriendInvite(
      'token',
      async () => validInvite,
      async () => {
        throw new Error('anonymous');
      },
    );

    assert.deepEqual(result.state, validInvite);
    assert.equal(result.authenticated, false);
    assert.equal(result.failed, false);
  });

  it('maps accept-time semantic errors to explicit invite states', () => {
    assert.deepEqual(
      friendInviteStateAfterAcceptError(validInvite, {
        body: { code: 'FRIEND_INVITE_EXPIRED' },
      }),
      { status: 'EXPIRED' },
    );
    assert.deepEqual(
      friendInviteStateAfterAcceptError(validInvite, { body: { code: 'FRIEND_INVITE_SELF' } }),
      { status: 'SELF', inviter: validInvite.inviter },
    );
    assert.deepEqual(
      friendInviteStateAfterAcceptError(validInvite, { body: { code: 'ALREADY_FRIENDS' } }),
      { status: 'ALREADY_FRIENDS', inviter: validInvite.inviter },
    );
  });

  it('leaves unknown accept failures for the retryable error UI', () => {
    assert.equal(friendInviteStateAfterAcceptError(validInvite, new Error('network')), null);
    assert.equal(
      friendInviteStateAfterAcceptError(validInvite, { body: { code: 'UNEXPECTED' } }),
      null,
    );
  });
});
