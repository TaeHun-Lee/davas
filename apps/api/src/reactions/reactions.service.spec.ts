import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { ForbiddenException } from '@nestjs/common';
import { ReactionsService } from './reactions.service';

describe('ReactionsService privacy', () => {
  it('checks the shared diary policy before listing or mutating reactions', async () => {
    const diary = { id: 'diary-1', userId: 'owner', visibility: 'FRIENDS' };
    let accessChecks = 0;
    const reactions = { find: async () => [], findOne: async () => null, create: (value: object) => value, save: async (value: object) => ({ id: 'reaction-1', ...value }), delete: async () => ({}) };
    const diaries = { findOne: async () => diary };
    const access = { assertCanView: async (_row: unknown, viewerId: string) => { accessChecks += 1; if (viewerId !== 'friend') throw new ForbiddenException(); } };
    const notifications = { notifyDiaryLiked: async () => undefined };
    const service = new ReactionsService(reactions as never, diaries as never, access as never, notifications as never);
    await service.list('diary-1', 'friend');
    await service.add('diary-1', 'friend', 'CLAP');
    await assert.rejects(() => service.remove('diary-1', 'stranger', 'CLAP'), ForbiddenException);
    assert.equal(accessChecks, 3);
  });
});
