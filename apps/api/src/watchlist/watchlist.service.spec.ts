import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { ConflictException, NotFoundException } from '@nestjs/common';
import type { MediaEntity, WatchlistItemEntity } from '../database/entities';
import { WatchlistService } from './watchlist.service';

function item(overrides: Partial<WatchlistItemEntity> = {}) {
  const now = new Date('2026-05-09T00:00:00.000Z');
  return {
    id: 'watch-1', userId: 'owner-1', mediaId: 'media-1', priority: 'MEDIUM', memo: '', plannedWith: '', status: 'ACTIVE',
    media: { id: 'media-1', title: '테스트 작품', posterUrl: null, releaseDate: null, mediaType: 'MOVIE' } as MediaEntity,
    createdAt: now, updatedAt: now, ...overrides,
  } as WatchlistItemEntity;
}

describe('WatchlistService', () => {
  it('prevents duplicate user/media items including a concurrent unique-key race', async () => {
    const media = { findOne: async () => ({ id: 'media-1' }) };
    await assert.rejects(
      () => new WatchlistService({ findOne: async () => item() } as never, media as never).create('owner-1', 'media-1'),
      ConflictException,
    );
    const racing = { findOne: async () => null, create: (value: unknown) => value, save: async () => { throw { code: '23505' }; } };
    await assert.rejects(() => new WatchlistService(racing as never, media as never).create('owner-1', 'media-1'), ConflictException);
  });

  it('creates an ACTIVE item with safe defaults', async () => {
    let saved: unknown;
    const items = { findOne: async () => null, create: (value: unknown) => value, save: async (value: unknown) => { saved = value; return value; } };
    const media = { findOne: async () => ({ id: 'media-1' }) };
    await new WatchlistService(items as never, media as never).create('owner-1', 'media-1');
    assert.deepEqual(saved, { userId: 'owner-1', mediaId: 'media-1', priority: 'MEDIUM', memo: '', plannedWith: '', status: 'ACTIVE' });
  });

  it('scopes list, edit, complete, and delete operations to the authenticated owner', async () => {
    const row = item();
    const calls: Array<{ method: string; input: unknown }> = [];
    const items = {
      find: async (input: unknown) => { calls.push({ method: 'find', input }); return [row]; },
      findOne: async (input: unknown) => { calls.push({ method: 'findOne', input }); return row; },
      save: async (input: WatchlistItemEntity) => { calls.push({ method: 'save', input }); return input; },
      delete: async (input: unknown) => { calls.push({ method: 'delete', input }); return { affected: 1 }; },
    };
    const service = new WatchlistService(items as never, {} as never);

    const listed = await service.list('owner-1', 'ACTIVE');
    const updated = await service.update('owner-1', row.id, { priority: 'HIGH', memo: '  메모  ', plannedWith: '  친구  ' });
    const completed = await service.complete('owner-1', row.id);
    await service.remove('owner-1', row.id);

    assert.equal(listed.items.length, 1);
    assert.deepEqual(calls[0].input, { where: { userId: 'owner-1', status: 'ACTIVE' }, relations: { media: true }, order: { createdAt: 'DESC' } });
    assert.equal(updated.memo, '메모');
    assert.equal(updated.plannedWith, '친구');
    assert.equal(completed.status, 'WATCHED');
    assert.deepEqual(calls.filter((call) => call.method === 'findOne').map((call) => call.input), [
      { where: { id: 'watch-1', userId: 'owner-1' }, relations: { media: true } },
      { where: { id: 'watch-1', userId: 'owner-1' }, relations: { media: true } },
      { where: { id: 'watch-1', userId: 'owner-1' }, relations: { media: true } },
    ]);
    assert.deepEqual(calls.at(-1), { method: 'delete', input: { id: 'watch-1', userId: 'owner-1' } });
  });

  it('does not reveal or mutate another user watchlist item', async () => {
    const calls: string[] = [];
    const items = {
      findOne: async () => null,
      save: async () => { calls.push('save'); },
      delete: async () => { calls.push('delete'); },
    };
    const service = new WatchlistService(items as never, {} as never);
    await assert.rejects(() => service.update('intruder-1', 'watch-1', { memo: '변조' }), NotFoundException);
    await assert.rejects(() => service.remove('intruder-1', 'watch-1'), NotFoundException);
    assert.deepEqual(calls, []);
  });
});
