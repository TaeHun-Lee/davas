import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { ForbiddenException } from '@nestjs/common';
import type { DiaryEntity, MediaEntity, UserEntity } from '../database/entities';
import { CommunityService } from './community.service';

function diary(id: string, userId: string, visibility: 'FRIENDS' | 'SELECTED'): DiaryEntity {
  return {
    id, userId, mediaId: `media-${id}`, title: `기록 ${id}`, content: '친구와 나누는 기록', watchedDate: '2026-07-11',
    rating: '4.5', visibility, hasSpoiler: false,
    user: { id: userId, nickname: userId, profileImageUrl: null } as UserEntity,
    media: { id: `media-${id}`, title: `작품 ${id}`, posterUrl: null, releaseDate: '2026-01-01', genres: ['18'] } as MediaEntity,
    comments: [], likes: [], createdAt: new Date('2026-07-11'), updatedAt: new Date('2026-07-11'), deletedAt: null,
  } as unknown as DiaryEntity;
}

describe('friend feed privacy', () => {
  it('queries only FRIENDS and SELECTED candidates then filters every row through the shared access policy', async () => {
    let options: unknown;
    const rows = [diary('friend', 'friend-1', 'FRIENDS'), diary('selected', 'stranger', 'SELECTED'), diary('denied', 'stranger', 'FRIENDS')];
    const repo = { find: async (input: unknown) => { options = input; return rows; } };
    const access = { canView: async (row: DiaryEntity) => row.id !== 'denied' };
    const result = await new CommunityService(repo as never, undefined, access as never).getDashboard({ userId: 'viewer' });
    assert.deepEqual((options as { where: unknown }).where, [{ visibility: 'FRIENDS' }, { visibility: 'SELECTED' }]);
    assert.deepEqual(result.feed.map((row) => row.id), ['friend', 'selected']);
    assert.deepEqual(result.popularDiaries, []);
  });

  it('uses the same policy for direct detail URLs', async () => {
    const row = diary('locked', 'friend-1', 'FRIENDS');
    const repo = { findOne: async () => row };
    const access = { assertCanView: async () => { throw new ForbiddenException(); } };
    await assert.rejects(
      () => new CommunityService(repo as never, undefined, access as never).getPublicDiary('locked', 'intruder'),
      ForbiddenException,
    );
  });

  it('revokes cached feed eligibility when friendship or selection policy changes', async () => {
    const row = diary('friend', 'friend-1', 'FRIENDS');
    let allowed = true;
    const repo = { find: async () => [row] };
    const access = { canView: async () => allowed };
    const service = new CommunityService(repo as never, undefined, access as never);
    assert.equal((await service.getDashboard({ userId: 'viewer' })).feed.length, 1);
    allowed = false;
    assert.equal((await service.getDashboard({ userId: 'viewer' })).feed.length, 0);
  });

  it('does not expose legacy public-SNS like, follow, popularity, or topic signals', async () => {
    const row = diary('friend', 'friend-1', 'FRIENDS');
    row.likes = [{ userId: 'viewer' }] as never;
    const repo = { find: async () => [row] };
    const access = { canView: async () => true };
    const result = await new CommunityService(repo as never, undefined, access as never).getDashboard({ userId: 'viewer' });
    const card = result.feed[0] as unknown as Record<string, unknown>;
    const author = card.author as Record<string, unknown>;
    assert.equal('likeCount' in card, false);
    assert.equal('isLiked' in card, false);
    assert.equal('isFollowed' in author, false);
    assert.deepEqual(result.topics, []);
    assert.deepEqual(result.popularDiaries, []);
  });
});
