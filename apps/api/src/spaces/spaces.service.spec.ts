import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { HttpException } from '@nestjs/common';
import type { EntityManager, ObjectLiteral, Repository } from 'typeorm';
import {
  SpaceEntity,
  SpaceInviteEntity,
  SpaceMembershipEntity,
} from '../database/entities';
import { SpaceAccessService } from './space-access.service';
import { SpacesService } from './spaces.service';

type Row = Record<string, unknown> & { id?: string };

class FakeDatabase {
  spaces: SpaceEntity[] = [];
  memberships: SpaceMembershipEntity[] = [];
  invites: SpaceInviteEntity[] = [];
  private sequence = 0;
  private transactionTail: Promise<void> = Promise.resolve();

  readonly dataSource = {
    transaction: async <T>(work: (manager: EntityManager) => Promise<T>) => {
      let release!: () => void;
      const previous = this.transactionTail;
      this.transactionTail = new Promise<void>((resolve) => {
        release = resolve;
      });
      await previous;
      try {
        return await work(this.manager as EntityManager);
      } finally {
        release();
      }
    },
  };

  readonly manager = {
    getRepository: <T extends ObjectLiteral>(target: new () => T) =>
      this.repository(target),
  };

  repository<T extends ObjectLiteral>(target: new () => T): Repository<T> {
    const rows = this.rows(target);
    const targetKey: unknown = target;
    const hydrateRelations = (row: T) => {
      if (targetKey === SpaceEntity) {
        const space = row as unknown as SpaceEntity;
        space.memberships = this.memberships.filter(
          (membership) => membership.spaceId === space.id,
        );
      }
      return row;
    };
    const findOne = async (options: { where: Row; relations?: unknown }) => {
      const row = rows.find((candidate) =>
        this.matches(candidate, options.where),
      ) as T | undefined;
      if (!row) return null;
      if (targetKey === SpaceInviteEntity && options.relations) {
        const invite = row as unknown as SpaceInviteEntity;
        invite.space = this.spaces.find(
          (space) => space.id === invite.spaceId,
        )!;
        invite.inviter = {
          id: invite.inviterAccountId,
          nickname: invite.inviterAccountId,
        } as never;
      }
      if (targetKey === SpaceEntity && options.relations) {
        hydrateRelations(row);
      }
      return row;
    };
    const saveOne = (value: T) => {
      const row = value as Row;
      if (!row.id) row.id = `${target.name}-${++this.sequence}`;
      if (targetKey === SpaceEntity) {
        const space = value as unknown as SpaceEntity;
        space.createdAt ??= new Date();
        space.updatedAt = new Date();
      }
      if (targetKey === SpaceInviteEntity)
        (value as unknown as SpaceInviteEntity).createdAt ??= new Date();
      const index = rows.findIndex((candidate) => candidate.id === row.id);
      if (index >= 0) rows[index] = value;
      else rows.push(value);
      return value;
    };
    return {
      create: (input: Partial<T>) => Object.assign(new target(), input),
      save: async (input: T | T[]) =>
        Array.isArray(input)
          ? input.map((value) => saveOne(value))
          : saveOne(input),
      findOne,
      find: async (options: { where: Row; relations?: unknown }) => {
        const matches = rows.filter((candidate) =>
          this.matches(candidate, options.where),
        ) as T[];
        return options.relations ? matches.map(hydrateRelations) : matches;
      },
      count: async (options: { where: Row }) =>
        rows.filter((candidate) => this.matches(candidate, options.where))
          .length,
    } as never;
  }

  addMember(
    spaceId: string,
    accountId: string,
    role: 'OWNER' | 'MEMBER' = 'MEMBER',
  ): SpaceMembershipEntity {
    const membership = Object.assign(new SpaceMembershipEntity(), {
      id: `member-${++this.sequence}`,
      spaceId,
      accountId,
      role,
      status: 'ACTIVE' as const,
      joinedAt: new Date(),
      leftAt: null,
    });
    this.memberships.push(membership);
    return membership;
  }

  private rows<T extends ObjectLiteral>(target: new () => T): T[] {
    const targetKey: unknown = target;
    if (targetKey === SpaceEntity) return this.spaces as unknown as T[];
    if (targetKey === SpaceMembershipEntity)
      return this.memberships as unknown as T[];
    if (targetKey === SpaceInviteEntity) return this.invites as unknown as T[];
    throw new Error(`Unexpected repository ${target.name}`);
  }

  private matches(candidate: Row, where: Row) {
    return Object.entries(where).every(
      ([key, value]) => candidate[key] === value,
    );
  }
}

function setup() {
  const database = new FakeDatabase();
  const outboxEvents: Array<Record<string, unknown>> = [];
  const outbox = {
    enqueue: async (_manager: unknown, input: Record<string, unknown>) => {
      outboxEvents.push(input);
      return input;
    },
  };
  const service = new SpacesService(
    database.repository(SpaceEntity),
    database.repository(SpaceMembershipEntity),
    database.repository(SpaceInviteEntity),
    new SpaceAccessService(database.repository(SpaceMembershipEntity)),
    outbox as never,
    database.dataSource as never,
  );
  return { database, outboxEvents, service };
}

function exceptionCode(error: unknown) {
  assert.ok(error instanceof HttpException);
  const body = error.getResponse();
  assert.equal(typeof body, 'object');
  return (body as { code?: string }).code;
}

describe('SpacesService lifecycle', () => {
  it('lists only active spaces for the current active member and supports an empty list', async () => {
    const { database, service } = setup();
    assert.deepEqual(await service.list('member'), { items: [] });

    const first = await service.create('owner-a', { name: '첫 공간' });
    const second = await service.create('owner-b', { name: '둘째 공간' });
    database.addMember(first.id, 'member');
    database.addMember(second.id, 'member');
    const closed = await service.create('owner-c', { name: '닫힌 공간' });
    database.addMember(closed.id, 'member');
    database.spaces.find((space) => space.id === closed.id)!.status = 'CLOSED';
    database.addMember(first.id, 'left-member').status = 'LEFT';

    const result = await service.list('member');
    assert.deepEqual(
      result.items.map((space) => space.name),
      ['첫 공간', '둘째 공간'],
    );
    assert.equal(
      result.items.every((space) =>
        space.members.every((membership) => membership.status === 'ACTIVE'),
      ),
      true,
    );
    assert.deepEqual(await service.list('left-member'), { items: [] });
  });

  it('creates a space with exactly one active owner membership', async () => {
    const { database, service } = setup();
    const result = await service.create('owner', { name: '우리 공간' });

    assert.equal(result.maxMembers, 5);
    assert.equal(database.spaces.length, 1);
    assert.deepEqual(
      database.memberships.map(({ accountId, role, status }) => ({
        accountId,
        role,
        status,
      })),
      [{ accountId: 'owner', role: 'OWNER', status: 'ACTIVE' }],
    );
  });

  it('issues only a hashed token and distinguishes valid, expired, and cancelled invites', async () => {
    const { database, outboxEvents, service } = setup();
    const space = await service.create('owner', {
      name: '친구들',
      maxMembers: 5,
    });
    const issued = await service.createInvite(space.id, 'owner', {
      expiresInHours: 24,
    });

    assert.equal(database.invites[0].tokenHash.length, 64);
    assert.notEqual(database.invites[0].tokenHash, issued.token);
    assert.doesNotMatch(JSON.stringify(outboxEvents), /token|tokenHash/i);
    assert.equal(outboxEvents[0]?.eventType, 'SpaceInviteIssued');
    assert.equal((await service.inspectInvite(issued.token)).status, 'VALID');
    database.invites[0].expiresAt = new Date(Date.now() - 1);
    assert.equal((await service.inspectInvite(issued.token)).status, 'EXPIRED');

    database.invites[0].expiresAt = new Date(Date.now() + 60_000);
    await service.cancelInvite(space.id, issued.id, 'owner');
    assert.equal(
      (await service.inspectInvite(issued.token)).status,
      'CANCELLED',
    );
    await assert.rejects(
      () => service.acceptInvite(issued.token, 'new-user'),
      (error) => {
        assert.equal(exceptionCode(error), 'SPACE_INVITE_CANCELLED');
        return true;
      },
    );
  });

  it('prevents duplicate membership and duplicate token acceptance', async () => {
    const { service } = setup();
    const space = await service.create('owner', { name: '중복 방지' });
    const first = await service.createInvite(space.id, 'owner', {});
    await service.acceptInvite(first.token, 'member');
    await assert.rejects(
      () => service.acceptInvite(first.token, 'another'),
      (error) => {
        assert.equal(exceptionCode(error), 'SPACE_INVITE_USED');
        return true;
      },
    );

    const second = await service.createInvite(space.id, 'owner', {});
    await assert.rejects(
      () => service.acceptInvite(second.token, 'member'),
      (error) => {
        assert.equal(exceptionCode(error), 'ALREADY_SPACE_MEMBER');
        return true;
      },
    );
  });

  it('serializes the last seat so exactly one concurrent invite acceptance succeeds', async () => {
    const { database, service } = setup();
    const space = await service.create('owner', {
      name: '다섯 자리',
      maxMembers: 5,
    });
    database.addMember(space.id, 'member-2');
    database.addMember(space.id, 'member-3');
    database.addMember(space.id, 'member-4');
    const inviteA = await service.createInvite(space.id, 'owner', {});
    const inviteB = await service.createInvite(space.id, 'owner', {});

    const results = await Promise.allSettled([
      service.acceptInvite(inviteA.token, 'member-5a'),
      service.acceptInvite(inviteB.token, 'member-5b'),
    ]);

    assert.equal(
      results.filter((result) => result.status === 'fulfilled').length,
      1,
    );
    const rejected = results.find((result) => result.status === 'rejected');
    assert.ok(rejected && rejected.status === 'rejected');
    assert.equal(exceptionCode(rejected.reason), 'SPACE_FULL');
    assert.equal(
      database.memberships.filter(
        (membership) =>
          membership.spaceId === space.id && membership.status === 'ACTIVE',
      ).length,
      5,
    );
  });

  it('protects the owner, then supports transfer, leave, and owner-driven closure', async () => {
    const { database, service } = setup();
    const space = await service.create('owner', { name: '생명주기' });
    database.addMember(space.id, 'next-owner');
    const invite = await service.createInvite(space.id, 'owner', {});

    await assert.rejects(
      () => service.leave(space.id, 'owner'),
      (error) => {
        assert.equal(exceptionCode(error), 'LAST_SPACE_OWNER');
        return true;
      },
    );
    await service.transferOwnership(space.id, 'owner', 'next-owner');
    await service.leave(space.id, 'owner');
    assert.equal(
      database.memberships.find((row) => row.accountId === 'owner')?.status,
      'LEFT',
    );

    await service.close(space.id, 'next-owner');
    assert.equal(database.spaces[0].status, 'CLOSED');
    assert.equal(
      database.memberships.every((membership) => membership.status === 'LEFT'),
      true,
    );
    assert.ok(database.invites.find((row) => row.id === invite.id)?.revokedAt);
  });

  it('returns the same 404 shape to non-members without revealing the space', async () => {
    const { service } = setup();
    const space = await service.create('owner', { name: '비공개' });

    for (const operation of [
      () => service.get(space.id, 'stranger'),
      () => service.createInvite(space.id, 'stranger', {}),
      () => service.leave(space.id, 'stranger'),
    ]) {
      await assert.rejects(operation, (error) => {
        assert.equal(exceptionCode(error), 'SPACE_NOT_FOUND');
        return true;
      });
    }
  });
});
