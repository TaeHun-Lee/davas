import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { hasWrittenReaction, hiddenReviewAccountIds } from './blind-review';

const review = (accountId: string, isBlind = false, ratingScale: number | null = 8) => ({
  accountId,
  isBlind,
  ratingScale,
  reviewText: ratingScale === null ? null : '좋았어요',
});

describe('blind review reveal rule', () => {
  it('counts a rating, headline, or review as written', () => {
    assert.equal(hasWrittenReaction(undefined), false);
    assert.equal(
      hasWrittenReaction({ accountId: 'a', ratingScale: null, reviewText: '  ' }),
      false,
    );
    assert.equal(hasWrittenReaction({ accountId: 'a', ratingScale: 7, reviewText: null }), true);
    assert.equal(
      hasWrittenReaction({ accountId: 'a', ratingScale: null, reviewText: null, headline: '최고' }),
      true,
    );
  });

  it('hides a blind review from a watcher until they write their own', () => {
    const participants = [
      { accountId: 'jiwoo', status: 'CONFIRMED' as const },
      { accountId: 'minho', status: 'PENDING' as const },
    ];
    const before = hiddenReviewAccountIds({
      viewerId: 'minho',
      participants,
      reactions: [review('jiwoo', true)],
    });
    assert.deepEqual([...before], ['jiwoo']);

    const after = hiddenReviewAccountIds({
      viewerId: 'minho',
      participants,
      reactions: [review('jiwoo', true), review('minho')],
    });
    assert.deepEqual([...after], []);
  });

  it('never hides the viewer their own review or a review that is not blind', () => {
    const participants = [
      { accountId: 'jiwoo', status: 'CONFIRMED' as const },
      { accountId: 'minho', status: 'CONFIRMED' as const },
    ];
    assert.deepEqual(
      [
        ...hiddenReviewAccountIds({
          viewerId: 'jiwoo',
          participants,
          reactions: [review('jiwoo', true), review('minho', false)],
        }),
      ],
      [],
    );
  });

  it('keeps blind reviews from other space members until every confirmed watcher wrote one', () => {
    const participants = [
      { accountId: 'jiwoo', status: 'CONFIRMED' as const },
      { accountId: 'minho', status: 'CONFIRMED' as const },
      { accountId: 'seojun', status: 'DECLINED' as const },
    ];
    const half = hiddenReviewAccountIds({
      viewerId: 'seojun',
      participants,
      reactions: [review('jiwoo', true)],
    });
    assert.deepEqual([...half], ['jiwoo']);
    const done = hiddenReviewAccountIds({
      viewerId: 'seojun',
      participants,
      reactions: [review('jiwoo', true), review('minho')],
    });
    assert.deepEqual([...done], []);
  });
});
