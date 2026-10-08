import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { CoreApiError } from '../../lib/api/core';
import type { SpaceView } from '../../lib/api/spaces';
import {
  chooseActiveSpace,
  defaultWatchPartners,
  inviteDeadlineLabel,
  inviteStatusMessage,
  spaceErrorMessage,
  wantedByLabel,
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

  it('preselects the partner only in a two-person space', () => {
    const member = (accountId: string, status: 'ACTIVE' | 'LEFT' = 'ACTIVE') => ({
      accountId,
      role: 'MEMBER' as const,
      status,
      profileImageUrl: null,
    });
    const couple = { ...space('couple'), members: [member('me'), member('partner')] };
    const group = {
      ...space('group'),
      members: [member('me'), member('a'), member('b')],
    };
    const leftPartner = {
      ...space('left'),
      members: [member('me'), member('partner'), member('gone', 'LEFT')],
    };
    assert.deepEqual(defaultWatchPartners(couple, 'me'), ['partner']);
    assert.deepEqual(defaultWatchPartners(group, 'me'), []);
    assert.deepEqual(defaultWatchPartners(leftPartner, 'me'), ['partner']);
    assert.deepEqual(defaultWatchPartners({ ...space('solo'), members: [member('me')] }, 'me'), []);
    assert.deepEqual(defaultWatchPartners(null, 'me'), []);
  });

  it('distinguishes capacity, expiry, already accepted, permission, and hidden 404 errors', () => {
    assert.match(spaceErrorMessage(apiError(409, 'SPACE_FULL')), /정원이 모두 찼어요/);
    assert.match(spaceErrorMessage(apiError(410, 'SPACE_INVITE_DECLINED')), /거절한/);
    assert.match(spaceErrorMessage(apiError(410, 'SPACE_INVITE_EXPIRED')), /만료/);
    assert.match(spaceErrorMessage(apiError(409, 'SPACE_INVITE_USED')), /이미 수락/);
    assert.match(spaceErrorMessage(apiError(403, 'SPACE_OWNER_REQUIRED')), /소유자만/);
    assert.match(spaceErrorMessage(apiError(404, 'SPACE_NOT_FOUND')), /접근 권한/);
  });

  it('renders distinct invite inspection states', () => {
    assert.match(inviteStatusMessage('CANCELLED'), /취소/);
    assert.match(inviteStatusMessage('USED'), /이미 수락/);
    assert.match(inviteStatusMessage('ALREADY_MEMBER'), /이미 참여/);
    assert.match(inviteStatusMessage('CLOSED'), /종료/);
    assert.match(inviteStatusMessage('INVALID'), /유효하지/);
    assert.match(inviteStatusMessage('DECLINED'), /거절한 초대/);
    assert.match(inviteStatusMessage('FULL'), /정원이 모두 차서/);
  });

  it('writes the invite deadline the way people say it, in Korean time', () => {
    assert.equal(inviteDeadlineLabel('2026-10-13T00:00:00.000Z'), '10월 13일 오전 9시');
    assert.equal(inviteDeadlineLabel('2026-10-13T06:30:00.000Z'), '10월 13일 오후 3시 30분');
  });

  it('says who put a title on the shared list in a natural sentence, me first', () => {
    const me = { isMe: true, nickname: '지우' };
    const minho = { isMe: false, nickname: '민호' };
    const seoyeon = { isMe: false, nickname: '서연' };
    assert.equal(wantedByLabel([me]), '내가 담음');
    assert.equal(wantedByLabel([minho]), '민호님이 담음');
    assert.equal(wantedByLabel([minho, me]), '나와 민호님 둘 다 담음');
    assert.equal(wantedByLabel([minho, seoyeon]), '민호님과 서연님 둘 다 담음');
    assert.equal(wantedByLabel([minho, me, seoyeon]), '나, 민호님, 서연님 모두 담음');
    assert.equal(wantedByLabel([{ isMe: false, nickname: ' ' }]), '공간 멤버님이 담음');
    assert.equal(wantedByLabel([]), '');
  });
});
