import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { CoreApiError } from '../../lib/api/core';
import type { SpaceView } from '../../lib/api/spaces';
import {
  chooseActiveSpace,
  inviteStatusMessage,
  spaceErrorMessage,
} from './space-ui';

const space = (id: string): SpaceView => ({
  id,
  name: id,
  status: 'ACTIVE',
  maxMembers: 5,
  ownerAccountId: 'owner',
  members: [],
});

const apiError = (status: number, code: string) =>
  new CoreApiError(status, { statusCode: status, code, message: code });

describe('space UI state policy', () => {
  it('keeps a preferred active space while allowing multiple memberships', () => {
    const spaces = [space('first'), space('second')];
    assert.equal(chooseActiveSpace(spaces, 'second')?.id, 'second');
    assert.equal(chooseActiveSpace(spaces, 'removed')?.id, 'first');
    assert.equal(chooseActiveSpace([], 'removed'), null);
  });

  it('distinguishes capacity, expiry, already accepted, permission, and hidden 404 errors', () => {
    assert.match(spaceErrorMessage(apiError(409, 'SPACE_FULL')), /정원 5명/);
    assert.match(
      spaceErrorMessage(apiError(410, 'SPACE_INVITE_EXPIRED')),
      /만료/,
    );
    assert.match(
      spaceErrorMessage(apiError(409, 'SPACE_INVITE_USED')),
      /이미 수락/,
    );
    assert.match(
      spaceErrorMessage(apiError(403, 'SPACE_OWNER_REQUIRED')),
      /소유자만/,
    );
    assert.match(
      spaceErrorMessage(apiError(404, 'SPACE_NOT_FOUND')),
      /접근 권한/,
    );
  });

  it('renders distinct invite inspection states', () => {
    assert.match(inviteStatusMessage('CANCELLED'), /취소/);
    assert.match(inviteStatusMessage('USED'), /이미 수락/);
    assert.match(inviteStatusMessage('ALREADY_MEMBER'), /이미 참여/);
    assert.match(inviteStatusMessage('CLOSED'), /종료/);
    assert.match(inviteStatusMessage('INVALID'), /유효하지/);
  });
});
