import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { DiaryAccessService } from './diary-access.service';

function setup() {
  const acceptedPairs = new Set(['friend:owner']);
  const selectedTargets = new Set(['d:selected']);
  const friendships = {
    find: async ({ where }: { where: Array<{ requesterId: string; receiverId: string; status: string }> }) =>
      where.some((row) => row.status === 'ACCEPTED' && acceptedPairs.has([row.requesterId, row.receiverId].sort().join(':'))) ? [{}] : [],
  };
  const shares = {
    findOne: async ({ where }: { where: { diaryId: string; userId: string } }) =>
      selectedTargets.has(`${where.diaryId}:${where.userId}`) ? {} : null,
  };
  return { service: new DiaryAccessService(friendships as never, shares as never), acceptedPairs, selectedTargets };
}

describe('DiaryAccessService permission matrix', () => {
  it('allows only the owner for PRIVATE', async () => {
    const { service } = setup();
    assert.equal(await service.canView({ id: 'd', userId: 'owner', visibility: 'PRIVATE' }, 'owner'), true);
    assert.equal(await service.canView({ id: 'd', userId: 'owner', visibility: 'PRIVATE' }, 'friend'), false);
    assert.equal(await service.canView({ id: 'd', userId: 'owner', visibility: 'PRIVATE' }, 'selected'), false);
  });

  it('allows accepted friends and denies non-friends for FRIENDS', async () => {
    const { service } = setup();
    assert.equal(await service.canView({ id: 'd', userId: 'owner', visibility: 'FRIENDS' }, 'friend'), true);
    assert.equal(await service.canView({ id: 'd', userId: 'owner', visibility: 'FRIENDS' }, 'stranger'), false);
  });

  it('allows only persisted targets for SELECTED', async () => {
    const { service } = setup();
    assert.equal(await service.canView({ id: 'd', userId: 'owner', visibility: 'SELECTED' }, 'selected'), true);
    assert.equal(await service.canView({ id: 'd', userId: 'owner', visibility: 'SELECTED' }, 'friend'), false);
    assert.equal(await service.canView({ id: 'd', userId: 'owner', visibility: 'SELECTED' }, 'stranger'), false);
  });

  it('revokes access immediately after friendship or selection removal', async () => {
    const { service, acceptedPairs, selectedTargets } = setup();
    assert.equal(await service.canView({ id: 'd', userId: 'owner', visibility: 'FRIENDS' }, 'friend'), true);
    assert.equal(await service.canView({ id: 'd', userId: 'owner', visibility: 'SELECTED' }, 'selected'), true);
    acceptedPairs.clear();
    selectedTargets.clear();
    assert.equal(await service.canView({ id: 'd', userId: 'owner', visibility: 'FRIENDS' }, 'friend'), false);
    assert.equal(await service.canView({ id: 'd', userId: 'owner', visibility: 'SELECTED' }, 'selected'), false);
  });

  it('distinguishes missing records from forbidden direct URLs', async () => {
    const { service } = setup();
    await assert.rejects(() => service.assertCanView(null, 'intruder'), NotFoundException);
    await assert.rejects(() => service.assertCanView({ id: 'd', userId: 'owner', visibility: 'PRIVATE' }, 'intruder'), ForbiddenException);
  });
});
