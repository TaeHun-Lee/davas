import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import type { SpaceReactionComparison, WatchReactionView } from '@davas/shared';
import type { MediaAvailability } from '../../lib/api/media';
import { ourReactions, providerLabel, watchableGroups } from './media-together-model';

const reaction = (
  accountId: string,
  fields: Partial<WatchReactionView> = {},
): WatchReactionView => ({
  id: `r-${accountId}`,
  accountId,
  nickname: accountId === 'u2' ? '민지' : '태훈',
  rating: null,
  headline: null,
  review: null,
  hasSpoiler: false,
  isBlind: false,
  locked: false,
  likeCount: 0,
  likedByMe: false,
  ...fields,
});

describe('title sheet: our reactions and where to watch', () => {
  it('keeps each member’s latest reaction, counts rewatches and leaves locked ratings out', () => {
    const comparison: SpaceReactionComparison = {
      spaceId: 's',
      mediaId: 'm',
      events: [
        {
          watchEventId: 'newest',
          watchedDate: '2026-10-04',
          reactions: [
            reaction('u2', { rating: 5, locked: false, headline: '다시 봐도 좋다' }),
            reaction('u1', { rating: 4 }),
          ],
        },
        {
          watchEventId: 'older',
          watchedDate: '2025-02-01',
          reactions: [reaction('u2', { rating: 3 }), reaction('u3', { locked: true })],
        },
      ],
    };
    const summary = ourReactions(comparison, 'u1');
    assert.deepEqual(
      summary.people.map((person) => [person.name, person.rating, person.watchCount]),
      [
        ['나', 4, 1],
        ['민지', 5, 2],
        ['태훈', null, 1],
      ],
    );
    assert.equal(summary.people[1].latestRecordId, 'newest');
    // 4 and 5; the locked one never counts.
    assert.equal(summary.average, 4.5);
    assert.equal(summary.recordCount, 2);
  });

  it('groups offers by how they can be watched and marks my subscriptions', () => {
    const availability = {
      state: 'AVAILABLE',
      offers: [
        { provider: 'Netflix', offerType: 'STREAM', confidence: 0.8 },
        { provider: 'Netflix basic with Ads', offerType: 'STREAM', confidence: 0.8 },
        { provider: 'wavve', offerType: 'STREAM', confidence: 0.8 },
        { provider: 'Google Play Movies', offerType: 'RENT', confidence: 0.8 },
      ],
    } as MediaAvailability;
    const { groups, onMine } = watchableGroups(availability, ['netflix']);
    assert.equal(providerLabel('Netflix'), '넷플릭스');
    assert.deepEqual(
      groups.map((group) => [group.label, group.providers.map((provider) => provider.name)]),
      [
        ['정액제', ['넷플릭스', '웨이브']],
        ['대여', ['Google Play Movies']],
      ],
    );
    assert.deepEqual(onMine, ['넷플릭스']);
  });
});
