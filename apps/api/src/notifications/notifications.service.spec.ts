import { strict as assert } from 'node:assert';
import { describe, it } from 'node:test';
import type { DiaryEntity } from '../database/entities/diary.entity';
import type { NotificationEntity } from '../database/entities/notification.entity';
import type { UserEntity } from '../database/entities/user.entity';
import { NotificationsService } from './notifications.service';

function makeNotification(overrides: Partial<NotificationEntity> = {}): NotificationEntity {
  return {
    id: 'notice-1',
    userId: 'recipient-1',
    actorId: 'actor-1',
    diaryId: 'diary-1',
    type: 'DIARY_LIKED',
    readAt: null,
    createdAt: new Date('2026-05-09T12:00:00.000Z'),
    user: { id: 'recipient-1', nickname: '받는사람', profileImageUrl: null } as UserEntity,
    actor: { id: 'actor-1', nickname: '알림발생자', profileImageUrl: '/uploads/profile-images/actor.png' } as UserEntity,
    diary: { id: 'diary-1', title: '공개 감상 기록' } as DiaryEntity,
    ...overrides,
  } as NotificationEntity;
}

function fakeNotificationsRepository(rows: NotificationEntity[] = []) {
  const calls: Array<{ method: string; input: unknown }> = [];
  return {
    calls,
    create(input: Partial<NotificationEntity>) {
      calls.push({ method: 'create', input });
      return makeNotification({ id: `notice-${rows.length + 1}`, ...input });
    },
    async save(input: NotificationEntity) {
      calls.push({ method: 'save', input });
      rows.push(input);
      return input;
    },
    async find(input: unknown) {
      calls.push({ method: 'find', input });
      return rows;
    },
    async findOne(input: unknown) {
      calls.push({ method: 'findOne', input });
      return rows[0] ?? null;
    },
  };
}

describe('NotificationsService', () => {
  it('lists real community notifications for the authenticated recipient in newest-first order', async () => {
    const repository = fakeNotificationsRepository([makeNotification()]);

    const result = await new NotificationsService(repository as never).listForUser('recipient-1');

    assert.deepEqual(repository.calls[0], {
      method: 'find',
      input: {
        where: { userId: 'recipient-1' },
        relations: { actor: true, diary: true },
        order: { createdAt: 'DESC' },
        take: 50,
      },
    });
    assert.equal(result.unreadCount, 1);
    assert.deepEqual(result.items[0], {
      id: 'notice-1',
      type: 'DIARY_LIKED',
      actor: { id: 'actor-1', nickname: '알림발생자', profileImageUrl: '/uploads/profile-images/actor.png' },
      diary: { id: 'diary-1', title: '공개 감상 기록' },
      readAt: null,
      createdAt: '2026-05-09T12:00:00.000Z',
    });
  });

  it('creates diary like, comment, and follow notifications without notifying self-actions', async () => {
    const repository = fakeNotificationsRepository();
    const service = new NotificationsService(repository as never);

    await service.notifyDiaryLiked({ diaryId: 'diary-1', recipientId: 'author-1', actorId: 'viewer-1' });
    await service.notifyDiaryCommented({ diaryId: 'diary-1', recipientId: 'author-1', actorId: 'viewer-1' });
    await service.notifyAuthorFollowed({ recipientId: 'author-1', actorId: 'viewer-1' });
    await service.notifyDiaryLiked({ diaryId: 'mine', recipientId: 'viewer-1', actorId: 'viewer-1' });

    assert.deepEqual(
      repository.calls.filter((call) => call.method === 'create').map((call) => call.input),
      [
        { userId: 'author-1', actorId: 'viewer-1', diaryId: 'diary-1', type: 'DIARY_LIKED' },
        { userId: 'author-1', actorId: 'viewer-1', diaryId: 'diary-1', type: 'DIARY_COMMENTED' },
        { userId: 'author-1', actorId: 'viewer-1', diaryId: null, type: 'AUTHOR_FOLLOWED' },
      ],
    );
  });

  it('marks only the authenticated recipient notification as read', async () => {
    const notification = makeNotification();
    const repository = fakeNotificationsRepository([notification]);

    const result = await new NotificationsService(repository as never).markRead('notice-1', 'recipient-1');

    assert.deepEqual(repository.calls[0], { method: 'findOne', input: { where: { id: 'notice-1', userId: 'recipient-1' }, relations: { actor: true, diary: true } } });
    assert.ok(notification.readAt instanceof Date);
    assert.equal(result.id, 'notice-1');
    assert.notEqual(result.readAt, null);
  });
});
