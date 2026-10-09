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
      href: '/records/record-1?returnTo=%2Fnotifications',
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
    assert.equal(match.title, '‘파묘’, 모두 같이 보고 싶어 해요');
    assert.equal(match.href, '/spaces/wishes');
    assert.equal(describeNotification(item({ type: 'SPACE_INVITE', diary: null })).href, '/spaces');
    assert.equal(
      describeNotification(item({ type: 'FRIEND_REQUESTED', diary: null })).href,
      '/friends',
    );
  });

  it('sends invite answers to spaces and group picks to the picking screen', () => {
    const declined = describeNotification(item({ type: 'SPACE_INVITE_DECLINED', diary: null }));
    assert.match(declined.title, /공간 초대를 거절했어요/);
    assert.equal(declined.href, '/spaces');
    const asked = describeNotification(item({ type: 'RECOMMENDATION_REQUESTED', diary: null }));
    assert.match(asked.title, /함께 볼 작품을 고르고 있어요/);
    assert.equal(asked.href, '/spaces?view=recommend');
    const agreed = describeNotification(
      item({ type: 'RECOMMENDATION_MATCHED', diary: null, media: { id: 'm-1', title: '파묘' } }),
    );
    assert.equal(agreed.title, '모두 동의한 작품이 생겼어요');
    assert.equal(agreed.about, '파묘 · 이걸로 볼지 정해 보세요');
    const untitled = describeNotification(item({ type: 'RECOMMENDATION_MATCHED', diary: null }));
    assert.equal(untitled.about, '이걸로 볼지 정해 보세요');
  });
});
