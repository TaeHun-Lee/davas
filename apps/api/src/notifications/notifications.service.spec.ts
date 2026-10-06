import { strict as assert } from 'node:assert';
import { describe, it } from 'node:test';
import { BadRequestException } from '@nestjs/common';
import { In, IsNull, Not } from 'typeorm';
import type { DiaryEntity } from '../database/entities/diary.entity';
import type { NotificationEntity } from '../database/entities/notification.entity';
import type { UserEntity } from '../database/entities/user.entity';
import type { NotificationPreferenceEntity } from '../database/entities';
import { NotificationsService } from './notifications.service';

function makeNotification(overrides: Partial<NotificationEntity> = {}): NotificationEntity {
  return {
    id: 'notice-1',
    userId: 'recipient-1',
    actorId: 'actor-1',
    diaryId: 'diary-1',
    type: 'DIARY_LIKED',
    idempotencyKey: 'notice-key-1',
    readAt: null,
    createdAt: new Date('2026-05-09T12:00:00.000Z'),
    user: { id: 'recipient-1', nickname: '받는사람', profileImageUrl: null } as UserEntity,
    actor: {
      id: 'actor-1',
      nickname: '알림발생자',
      profileImageUrl: '/uploads/profile-images/actor.png',
    } as UserEntity,
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
    async findOne(input: { where?: { idempotencyKey?: string } }) {
      calls.push({ method: 'findOne', input });
      if (input.where?.idempotencyKey) {
        return rows.find((row) => row.idempotencyKey === input.where?.idempotencyKey) ?? null;
      }
      return rows[0] ?? null;
    },
    async count(input: unknown) {
      calls.push({ method: 'count', input });
      return rows.filter((row) => !row.readAt).length;
    },
    async update(where: unknown, values: Partial<NotificationEntity>) {
      calls.push({ method: 'update', input: { where, values } });
      for (const row of rows) if (!row.readAt) Object.assign(row, values);
    },
  };
}

const VISIBLE_TYPES = [
  'DIARY_LIKED',
  'DIARY_COMMENTED',
  'FRIEND_REQUESTED',
  'FRIEND_ACCEPTED',
  'SPACE_INVITE',
  'WATCH_PARTICIPATION_REQUESTED',
  'WATCH_SHARED',
  'REVIEW_REVEALED',
  'REVIEW_LIKED',
  'WISH_MATCHED',
];

describe('NotificationsService', () => {
  it('lists real community notifications for the authenticated recipient in newest-first order', async () => {
    const repository = fakeNotificationsRepository([makeNotification()]);

    const result = await new NotificationsService(repository as never).listForUser('recipient-1');

    assert.deepEqual(repository.calls[0], {
      method: 'find',
      input: {
        where: { userId: 'recipient-1', type: In(VISIBLE_TYPES) },
        relations: { actor: true, diary: true, media: true },
        order: { createdAt: 'DESC' },
        take: 50,
      },
    });
    assert.equal(result.unreadCount, 1);
    assert.deepEqual(result.items[0], {
      id: 'notice-1',
      type: 'DIARY_LIKED',
      actor: {
        id: 'actor-1',
        nickname: '알림발생자',
        profileImageUrl: '/uploads/profile-images/actor.png',
      },
      diary: { id: 'diary-1', title: '공개 감상 기록' },
      media: null,
      readAt: null,
      createdAt: '2026-05-09T12:00:00.000Z',
    });
  });

  it('counts unread notifications for the bell and marks them all read at once', async () => {
    const rows = [makeNotification(), makeNotification({ id: 'notice-2', idempotencyKey: 'k2' })];
    const repository = fakeNotificationsRepository(rows);
    const service = new NotificationsService(repository as never);

    assert.equal(await service.unreadCount('recipient-1'), 2);
    assert.deepEqual(repository.calls[0].input, {
      where: { userId: 'recipient-1', readAt: IsNull(), type: In(VISIBLE_TYPES) },
    });
    assert.deepEqual(await service.markAllRead('recipient-1'), { unreadCount: 0 });
    assert.ok(rows.every((row) => row.readAt instanceof Date));
  });

  it('points a wish match at the title instead of a record', async () => {
    const repository = fakeNotificationsRepository();
    const service = new NotificationsService(repository as never);
    await service.notifyWishMatched({
      recipientId: 'minho',
      actorId: 'jiwoo',
      mediaId: 'media-1',
      idempotencyKey: 'WISH_MATCHED:minho:space-1:media-1',
    });
    assert.deepEqual(repository.calls.find((call) => call.method === 'create')?.input, {
      userId: 'minho',
      actorId: 'jiwoo',
      diaryId: null,
      mediaId: 'media-1',
      type: 'WISH_MATCHED',
      idempotencyKey: 'WISH_MATCHED:minho:space-1:media-1',
    });
  });

  it('creates reaction and comment notifications without notifying self-actions', async () => {
    const repository = fakeNotificationsRepository();
    const service = new NotificationsService(repository as never);

    await service.notifyDiaryLiked({
      diaryId: 'diary-1',
      recipientId: 'author-1',
      actorId: 'viewer-1',
    });
    await service.notifyDiaryCommented({
      diaryId: 'diary-1',
      recipientId: 'author-1',
      actorId: 'viewer-1',
    });
    await service.notifyDiaryLiked({
      diaryId: 'mine',
      recipientId: 'viewer-1',
      actorId: 'viewer-1',
    });

    assert.deepEqual(
      repository.calls.filter((call) => call.method === 'create').map((call) => call.input),
      [
        {
          userId: 'author-1',
          actorId: 'viewer-1',
          diaryId: 'diary-1',
          mediaId: null,
          type: 'DIARY_LIKED',
          idempotencyKey: 'DIARY_LIKED:author-1:viewer-1:diary-1',
        },
        {
          userId: 'author-1',
          actorId: 'viewer-1',
          diaryId: 'diary-1',
          mediaId: null,
          type: 'DIARY_COMMENTED',
          idempotencyKey: 'DIARY_COMMENTED:author-1:viewer-1:diary-1',
        },
      ],
    );
  });

  it('deduplicates repeated delivery and honors only optional opt-outs', async () => {
    const repository = fakeNotificationsRepository();
    const preferenceRows: NotificationPreferenceEntity[] = [];
    const preferences = {
      async find({ where }: { where: { userId: string } }) {
        return preferenceRows.filter((row) => row.userId === where.userId);
      },
      async findOne({ where }: { where: { userId: string; category: string } }) {
        return (
          preferenceRows.find(
            (row) => row.userId === where.userId && row.category === where.category,
          ) ?? null
        );
      },
      create(input: Partial<NotificationPreferenceEntity>) {
        return {
          id: `preference-${preferenceRows.length + 1}`,
          ...input,
        } as NotificationPreferenceEntity;
      },
      async save(row: NotificationPreferenceEntity) {
        const index = preferenceRows.findIndex((saved) => saved.id === row.id);
        if (index >= 0) preferenceRows[index] = row;
        else preferenceRows.push(row);
        return row;
      },
    };
    const service = new NotificationsService(repository as never, preferences as never);

    await service.notifySpaceInvite({
      recipientId: 'recipient-1',
      actorId: 'actor-1',
      idempotencyKey: 'invite-1',
    });
    await service.notifySpaceInvite({
      recipientId: 'recipient-1',
      actorId: 'actor-1',
      idempotencyKey: 'invite-1',
    });
    assert.equal(repository.calls.filter((call) => call.method === 'save').length, 1);
    await assert.rejects(
      () => service.setPreference('recipient-1', 'SPACE_INVITE', false),
      BadRequestException,
    );

    await service.setPreference('recipient-1', 'SOCIAL', false);
    const skipped = await service.notifyDiaryLiked({
      recipientId: 'recipient-1',
      actorId: 'actor-2',
      diaryId: 'diary-2',
      idempotencyKey: 'like-2',
    });
    assert.equal(skipped, null);
    const listed = await service.listPreferences('recipient-1');
    assert.equal(listed.find((item) => item.category === 'SPACE_INVITE')?.enabled, true);
    assert.equal(listed.find((item) => item.category === 'SOCIAL')?.enabled, false);
  });

  it('marks only the authenticated recipient notification as read', async () => {
    const notification = makeNotification();
    const repository = fakeNotificationsRepository([notification]);

    const result = await new NotificationsService(repository as never).markRead(
      'notice-1',
      'recipient-1',
    );

    assert.deepEqual(repository.calls[0], {
      method: 'findOne',
      input: {
        where: { id: 'notice-1', userId: 'recipient-1', type: Not('AUTHOR_FOLLOWED') },
        relations: { actor: true, diary: true },
      },
    });
    assert.ok(notification.readAt instanceof Date);
    assert.equal(result.id, 'notice-1');
    assert.notEqual(result.readAt, null);
  });
});
