import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { ConflictException } from '@nestjs/common';
import type { DataSource, EntityManager, FindOneOptions, Repository } from 'typeorm';
import { FriendInviteEntity, FriendshipEntity, UserEntity } from '../database/entities';
import { FriendInvitesService } from './friend-invites.service';

function validInvite(): FriendInviteEntity {
  return {
    id: 'invite-1',
    tokenHash: 'hash',
    inviterId: 'user-a',
    inviter: {
      id: 'user-a',
      nickname: '초대한 친구',
      profileImageUrl: null,
    } as UserEntity,
    expiresAt: new Date(Date.now() + 60_000),
    usedAt: null,
    usedByUserId: null,
    revokedAt: null,
  } as FriendInviteEntity;
}

function serviceForInspect(status: FriendshipEntity['status'] | null) {
  const invite = validInvite();
  return new FriendInvitesService(
    {
      findOne: async () => invite,
    } as unknown as Repository<FriendInviteEntity>,
    {
      findOne: async () =>
        status ? ({ pairKey: 'user-a:user-b', status } as FriendshipEntity) : null,
    } as unknown as Repository<FriendshipEntity>,
    {} as DataSource,
  );
}

function acceptHarness(pairMutationRows: unknown[]) {
  const invite = validInvite();
  let lockOptions: FindOneOptions<FriendInviteEntity> | undefined;
  let inviteSaveCount = 0;
  let pairSql = '';
  let pairParameters: unknown[] = [];
  const inviteRepository = {
    findOne: async (options: FindOneOptions<FriendInviteEntity>) => {
      lockOptions = options;
      return invite;
    },
    save: async (value: FriendInviteEntity) => {
      inviteSaveCount += 1;
      return value;
    },
  } as unknown as Repository<FriendInviteEntity>;
  const userRepository = {
    findOne: async () => ({
      id: 'user-a',
      nickname: '초대한 친구',
      profileImageUrl: null,
    }),
  } as unknown as Repository<UserEntity>;
  const manager = {
    getRepository(entity: unknown) {
      if (entity === FriendInviteEntity) return inviteRepository;
      if (entity === UserEntity) return userRepository;
      throw new Error('unexpected repository');
    },
    query: async (sql: string, parameters: unknown[]) => {
      pairSql = sql;
      pairParameters = parameters;
      return pairMutationRows;
    },
  } as unknown as EntityManager;
  const dataSource = {
    transaction: async (work: (value: EntityManager) => Promise<unknown>) => work(manager),
  } as unknown as DataSource;
  const service = new FriendInvitesService(
    {} as Repository<FriendInviteEntity>,
    {} as Repository<FriendshipEntity>,
    dataSource,
  );
  return {
    invite,
    service,
    lockOptions: () => lockOptions,
    inviteSaveCount: () => inviteSaveCount,
    pairSql: () => pairSql,
    pairParameters: () => pairParameters,
  };
}

describe('friend invite status and acceptance locking', () => {
  it('reports ALREADY_FRIENDS only for accepted relationships', async () => {
    assert.equal(
      (await serviceForInspect('ACCEPTED').inspect('token', 'user-b')).status,
      'ALREADY_FRIENDS',
    );
    assert.equal((await serviceForInspect('PENDING').inspect('token', 'user-b')).status, 'VALID');
    assert.equal((await serviceForInspect('REJECTED').inspect('token', 'user-b')).status, 'VALID');
  });

  it('locks the invite and atomically accepts the pair without a unique-key race', async () => {
    const harness = acceptHarness([{ id: 'friendship-1' }]);

    const result = await harness.service.accept('raw-token', 'user-b');

    assert.deepEqual(harness.lockOptions()?.lock, { mode: 'pessimistic_write' });
    assert.equal(harness.lockOptions()?.relations, undefined);
    assert.match(harness.pairSql(), /INSERT INTO "friendships"/);
    assert.match(harness.pairSql(), /ON CONFLICT \("pair_key"\) DO UPDATE/);
    assert.match(harness.pairSql(), /WHERE "friendships"\."status" <> 'ACCEPTED'/);
    assert.deepEqual(harness.pairParameters(), ['user-a:user-b', 'user-a', 'user-b']);
    assert.equal(harness.inviteSaveCount(), 1);
    assert.deepEqual(result, {
      connected: true,
      inviter: { id: 'user-a', nickname: '초대한 친구', profileImageUrl: null },
    });
  });

  it('returns ALREADY_FRIENDS without consuming a losing invite', async () => {
    const harness = acceptHarness([]);

    await assert.rejects(
      harness.service.accept('raw-token', 'user-b'),
      (cause: unknown) => cause instanceof ConflictException,
    );
    assert.equal(harness.inviteSaveCount(), 0);
    assert.equal(harness.invite.usedAt, null);
    assert.equal(harness.invite.usedByUserId, null);
  });
});
