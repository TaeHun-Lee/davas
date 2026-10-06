import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import type { NotificationItem } from '../../lib/api/notifications';
import { describeNotification } from './notification-model';

const item = (overrides: Partial<NotificationItem>): NotificationItem => ({
  id: 'n-1',
  type: 'WATCH_SHARED',
  actor: { id: 'minho', nickname: '민호', profileImageUrl: null },
  diary: { id: 'record-1', title: '서울의 봄' },
  media: null,
  readAt: null,
  createdAt: '2026-10-06T00:00:00.000Z',
  ...overrides,
});

describe('notification copy', () => {
  it('names the actor and the record, and opens the record', () => {
    assert.deepEqual(describeNotification(item({})), {
      title: '민호님이 ‘서울의 봄’ 기록을 남겼어요',
      about: null,
      href: '/records/record-1',
      icon: 'record',
    });
    assert.equal(
      describeNotification(item({ type: 'REVIEW_REVEALED' })).title,
      '‘서울의 봄’ 블라인드 리뷰가 열렸어요',
    );
    assert.equal(
      describeNotification(item({ type: 'WATCH_PARTICIPATION_REQUESTED' })).about,
      '민호님이 확인을 요청했어요',
    );
    assert.equal(describeNotification(item({ type: 'REVIEW_LIKED' })).icon, 'like');
  });

  it('sends a wish match to the shared list and people notices to their screens', () => {
    const match = describeNotification(
      item({ type: 'WISH_MATCHED', diary: null, media: { id: 'm-1', title: '파묘' } }),
    );
    assert.equal(match.title, '‘파묘’ 같이 보고 싶은 작품이 겹쳤어요');
    assert.equal(match.href, '/spaces/wishes');
    assert.equal(describeNotification(item({ type: 'SPACE_INVITE', diary: null })).href, '/spaces');
    assert.equal(
      describeNotification(item({ type: 'FRIEND_REQUESTED', diary: null })).href,
      '/friends',
    );
  });
});
