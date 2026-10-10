import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { ConflictException, NotFoundException } from '@nestjs/common';
import type { MediaEntity, WatchlistItemEntity } from '../database/entities';
import { WatchlistService } from './watchlist.service';

function item(overrides: Partial<WatchlistItemEntity> = {}) {
  const now = new Date('2026-05-09T00:00:00.000Z');
  return {
    id: 'watch-1',
    userId: 'owner-1',
    mediaId: 'media-1',
    priority: 'MEDIUM',
    memo: '',
    plannedWith: '',
    status: 'ACTIVE',
    media: {
      id: 'media-1',
      title: '테스트 작품',
      posterUrl: null,
      releaseDate: null,
      mediaType: 'MOVIE',
    } as MediaEntity,
    createdAt: now,
    updatedAt: now,
    ...overrides,
  } as WatchlistItemEntity;
}

describe('WatchlistService', () => {
  it('prevents duplicate user/media items including a concurrent unique-key race', async () => {
    const media = { findOne: async () => ({ id: 'media-1' }) };
    await assert.rejects(
      () =>
        new WatchlistService({ findOne: async () => item() } as never, media as never).create(
          'owner-1',
          'media-1',
        ),
      ConflictException,
    );
    const racing = {
      findOne: async () => null,
      create: (value: unknown) => value,
      save: async () => {
        throw { code: '23505' };
      },
    };
    await assert.rejects(
      () => new WatchlistService(racing as never, media as never).create('owner-1', 'media-1'),
      ConflictException,
    );
  });

  it('creates an ACTIVE item with safe defaults', async () => {
    let saved: unknown;
    const items = {
      findOne: async () => null,
      create: (value: unknown) => value,
      save: async (value: unknown) => {
        saved = value;
        return value;
      },
    };
    const media = { findOne: async () => ({ id: 'media-1' }) };
    await new WatchlistService(items as never, media as never).create('owner-1', 'media-1');
    assert.deepEqual(saved, {
      userId: 'owner-1',
      mediaId: 'media-1',
      priority: 'MEDIUM',
      memo: '',
      plannedWith: '',
      status: 'ACTIVE',
    });
  });

  it('deletes only an item the signed-in user owns', async () => {
    const calls: Array<{ method: string; input: unknown }> = [];
    const items = {
      findOne: async (input: unknown) => {
        calls.push({ method: 'findOne', input });
        return item();
      },
      delete: async (input: unknown) => {
        calls.push({ method: 'delete', input });
        return { affected: 1 };
      },
    };
    const result = await new WatchlistService(items as never, {} as never).remove(
      'owner-1',
      'watch-1',
    );

    assert.deepEqual(result, { id: 'watch-1', deleted: true });
    assert.deepEqual(calls, [
      { method: 'findOne', input: { where: { id: 'watch-1', userId: 'owner-1' } } },
      { method: 'delete', input: { id: 'watch-1', userId: 'owner-1' } },
    ]);
  });

  it('does not reveal or delete another user watchlist item', async () => {
    const calls: string[] = [];
    const items = {
      findOne: async () => null,
      delete: async () => {
        calls.push('delete');
      },
    };
    const service = new WatchlistService(items as never, {} as never);
    await assert.rejects(() => service.remove('intruder-1', 'watch-1'), NotFoundException);
    assert.deepEqual(calls, []);
  });
});
