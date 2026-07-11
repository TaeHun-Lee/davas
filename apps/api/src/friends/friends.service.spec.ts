import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { BadRequestException, ConflictException, ForbiddenException } from '@nestjs/common';
import type { FriendshipEntity, UserEntity } from '../database/entities';
import { FriendsService } from './friends.service';

function friendship(overrides: Partial<FriendshipEntity> = {}) {
  return {
    id: 'friendship-1', requesterId: 'alice', receiverId: 'bob', pairKey: 'alice:bob', status: 'PENDING',
    requester: { id: 'alice', nickname: '앨리스', profileImageUrl: null } as UserEntity,
    receiver: { id: 'bob', nickname: '밥', profileImageUrl: null } as UserEntity,
    updatedAt: new Date('2026-05-09T00:00:00.000Z'),
    ...overrides,
  } as FriendshipEntity;
}

function setup(existing: FriendshipEntity | null = null, rows: FriendshipEntity[] = []) {
  const calls: Array<{ method: string; input: unknown }> = [];
  const repo = {
    findOne: async (input: unknown) => { calls.push({ method: 'findOne', input }); return existing; },
    create: (input: unknown) => input,
    save: async (input: unknown) => { calls.push({ method: 'save', input }); return { id: 'friendship-1', ...(input as object) }; },
    delete: async (input: unknown) => { calls.push({ method: 'delete', input }); return { affected: 1 }; },
    find: async (input: unknown) => { calls.push({ method: 'find', input }); return rows; },
  };
  const users = { findOne: async () => ({ id: 'bob' }), find: async () => [] };
  const notices = {
    notifyFriendRequested: async (input: unknown) => calls.push({ method: 'requested', input }),
    notifyFriendAccepted: async (input: unknown) => calls.push({ method: 'accepted', input }),
  };
  return { service: new FriendsService(repo as never, users as never, notices as never), calls };
}

describe('FriendsService integrity', () => {
  it('blocks self, duplicate, accepted, and crossed pending requests', async () => {
    await assert.rejects(() => setup().service.request('alice', 'alice'), BadRequestException);
    await assert.rejects(() => setup(friendship()).service.request('alice', 'bob'), ConflictException);
    await assert.rejects(() => setup(friendship()).service.request('bob', 'alice'), ConflictException);
    await assert.rejects(() => setup(friendship({ status: 'ACCEPTED' })).service.request('alice', 'bob'), ConflictException);
  });

  it('persists a canonical pair key and notifies the receiver', async () => {
    const { service, calls } = setup();
    await service.request('bob', 'alice');
    const saved = calls.find((call) => call.method === 'save')?.input as FriendshipEntity;
    assert.equal(saved.pairKey, 'alice:bob');
    assert.deepEqual(calls.at(-1), { method: 'requested', input: { recipientId: 'alice', actorId: 'bob' } });
  });

  it('allows only the receiver to accept or reject a pending request', async () => {
    const row = friendship();
    await assert.rejects(() => setup(row).service.respond(row.id, 'alice', 'ACCEPTED'), ForbiddenException);

    const accepted = setup(friendship());
    await accepted.service.respond(row.id, 'bob', 'ACCEPTED');
    assert.deepEqual(accepted.calls.at(-1), { method: 'accepted', input: { recipientId: 'alice', actorId: 'bob' } });

    const rejected = setup(friendship());
    await rejected.service.respond(row.id, 'bob', 'REJECTED');
    assert.equal(rejected.calls.some((call) => call.method === 'accepted'), false);
  });

  it('notifies the receiver when a rejected pair is requested again', async () => {
    const { service, calls } = setup(friendship({ status: 'REJECTED' }));
    await service.request('alice', 'bob');
    assert.deepEqual(calls.at(-1), { method: 'requested', input: { recipientId: 'bob', actorId: 'alice' } });
  });

  it('limits cancel to the sender and accepted-friend removal to either participant', async () => {
    const pending = friendship();
    await assert.rejects(() => setup(pending).service.cancel(pending.id, 'bob'), ForbiddenException);
    const cancelled = setup(pending);
    await cancelled.service.cancel(pending.id, 'alice');
    assert.deepEqual(cancelled.calls.at(-1), { method: 'delete', input: { id: pending.id } });

    const accepted = friendship({ status: 'ACCEPTED' });
    const removed = setup(accepted);
    await removed.service.remove(accepted.id, 'bob');
    assert.deepEqual(removed.calls.at(-1), { method: 'delete', input: { id: accepted.id } });
    await assert.rejects(() => setup(friendship()).service.remove(pending.id, 'alice'), ForbiddenException);
  });

  it('returns bilateral friend and request state from the viewer perspective', async () => {
    const rows = [
      friendship({ id: 'accepted', status: 'ACCEPTED' }),
      friendship({ id: 'received', requesterId: 'carol', receiverId: 'bob', requester: { id: 'carol', nickname: '캐럴', profileImageUrl: null } as UserEntity }),
      friendship({ id: 'sent', requesterId: 'bob', receiverId: 'dave', receiver: { id: 'dave', nickname: '데이브', profileImageUrl: null } as UserEntity }),
    ];
    const result = await setup(null, rows).service.list('bob');
    assert.deepEqual(result.friends.map((row) => row.id), ['accepted']);
    assert.deepEqual(result.received.map((row) => row.id), ['received']);
    assert.deepEqual(result.sent.map((row) => row.id), ['sent']);
  });
});
