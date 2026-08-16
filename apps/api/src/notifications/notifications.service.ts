import {
  BadRequestException,
  Injectable,
  NotFoundException,
  Optional,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import {
  NOTIFICATION_PREFERENCE_CATEGORIES,
  NotificationEntity,
  NotificationPreferenceCategory,
  NotificationPreferenceEntity,
  NotificationType,
  REQUIRED_NOTIFICATION_CATEGORIES,
} from '../database/entities';

export type CreateNotificationInput = {
  recipientId: string;
  actorId: string;
  diaryId?: string | null;
  idempotencyKey?: string;
};

export type CommunityNotificationView = {
  id: string;
  type: NotificationType;
  actor: {
    id: string;
    nickname: string;
    profileImageUrl: string | null;
  };
  diary: {
    id: string;
    title: string;
  } | null;
  readAt: string | null;
  createdAt: string;
};

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(NotificationEntity)
    private readonly notifications: Repository<NotificationEntity>,
    @Optional()
    @InjectRepository(NotificationPreferenceEntity)
    private readonly preferences?: Repository<NotificationPreferenceEntity>,
  ) {}

  async listPreferences(userId: string) {
    const saved = this.preferences
      ? await this.preferences.find({ where: { userId } })
      : [];
    const byCategory = new Map(saved.map((row) => [row.category, row.enabled]));
    return NOTIFICATION_PREFERENCE_CATEGORIES.map((category) => ({
      category,
      required: REQUIRED_NOTIFICATION_CATEGORIES.has(category),
      enabled: REQUIRED_NOTIFICATION_CATEGORIES.has(category)
        ? true
        : (byCategory.get(category) ?? true),
    }));
  }

  async setPreference(
    userId: string,
    category: NotificationPreferenceCategory,
    enabled: boolean,
  ) {
    if (REQUIRED_NOTIFICATION_CATEGORIES.has(category) && !enabled) {
      throw new BadRequestException('필수 알림은 끌 수 없습니다.');
    }
    if (!this.preferences) {
      throw new BadRequestException('알림 선호를 저장할 수 없습니다.');
    }
    let row = await this.preferences.findOne({ where: { userId, category } });
    row ??= this.preferences.create({ userId, category, enabled });
    row.enabled = enabled;
    await this.preferences.save(row);
    return {
      category,
      required: REQUIRED_NOTIFICATION_CATEGORIES.has(category),
      enabled,
    };
  }

  async listForUser(userId: string) {
    const rows = await this.notifications.find({
      where: { userId, type: Not('AUTHOR_FOLLOWED') },
      relations: { actor: true, diary: true },
      order: { createdAt: 'DESC' },
      take: 50,
    });
    return {
      unreadCount: rows.filter((notification) => !notification.readAt).length,
      items: rows.map((notification) => this.toView(notification)),
    };
  }

  async notifyDiaryLiked(input: CreateNotificationInput) {
    return this.createForOtherUser({ ...input, diaryId: input.diaryId ?? null, type: 'DIARY_LIKED' });
  }

  async notifyDiaryCommented(input: CreateNotificationInput) {
    return this.createForOtherUser({ ...input, diaryId: input.diaryId ?? null, type: 'DIARY_COMMENTED' });
  }

  async notifyFriendRequested(input: Omit<CreateNotificationInput, 'diaryId'>) { return this.createForOtherUser({ ...input, diaryId: null, type: 'FRIEND_REQUESTED' }); }
  async notifyFriendAccepted(input: Omit<CreateNotificationInput, 'diaryId'>) { return this.createForOtherUser({ ...input, diaryId: null, type: 'FRIEND_ACCEPTED' }); }
  async notifySpaceInvite(input: Omit<CreateNotificationInput, 'diaryId'>) {
    return this.createForOtherUser({ ...input, diaryId: null, type: 'SPACE_INVITE' });
  }
  async notifyWatchParticipationRequested(input: CreateNotificationInput) {
    return this.createForOtherUser({
      ...input,
      diaryId: input.diaryId ?? null,
      type: 'WATCH_PARTICIPATION_REQUESTED',
    });
  }

  async markRead(notificationId: string, userId: string) {
    const notification = await this.notifications.findOne({
      where: { id: notificationId, userId, type: Not('AUTHOR_FOLLOWED') },
      relations: { actor: true, diary: true },
    });
    if (!notification) {
      throw new NotFoundException('알림을 찾을 수 없습니다.');
    }
    notification.readAt = notification.readAt ?? new Date();
    return this.toView(await this.notifications.save(notification));
  }

  private async createForOtherUser(input: CreateNotificationInput & { type: NotificationType }) {
    if (input.recipientId === input.actorId) {
      return null;
    }
    if (!(await this.isEnabled(input.recipientId, input.type))) return null;
    const idempotencyKey =
      input.idempotencyKey ??
      [input.type, input.recipientId, input.actorId, input.diaryId ?? 'none'].join(':');
    const existing = await this.notifications.findOne({ where: { idempotencyKey } });
    if (existing) return existing;
    try {
      return await this.notifications.save(
        this.notifications.create({
        userId: input.recipientId,
        actorId: input.actorId,
        diaryId: input.diaryId ?? null,
        type: input.type,
          idempotencyKey,
        }),
      );
    } catch (error) {
      if ((error as { code?: string }).code !== '23505') throw error;
      return this.notifications.findOne({ where: { idempotencyKey } });
    }
  }

  private async isEnabled(userId: string, type: NotificationType) {
    const category = this.categoryFor(type);
    if (REQUIRED_NOTIFICATION_CATEGORIES.has(category) || !this.preferences) {
      return true;
    }
    const preference = await this.preferences.findOne({ where: { userId, category } });
    return preference?.enabled ?? true;
  }

  private categoryFor(type: NotificationType): NotificationPreferenceCategory {
    if (type === 'SPACE_INVITE') return 'SPACE_INVITE';
    if (type === 'WATCH_PARTICIPATION_REQUESTED') return 'WATCH_PARTICIPATION';
    return 'SOCIAL';
  }

  private toView(notification: NotificationEntity): CommunityNotificationView {
    return {
      id: notification.id,
      type: notification.type,
      actor: {
        id: notification.actor?.id ?? notification.actorId,
        nickname: notification.actor?.nickname ?? '알 수 없는 사용자',
        profileImageUrl: notification.actor?.profileImageUrl ?? null,
      },
      diary: notification.diary
        ? {
            id: notification.diary.id,
            title: notification.diary.title,
          }
        : null,
      readAt: notification.readAt?.toISOString() ?? null,
      createdAt: notification.createdAt.toISOString(),
    };
  }
}
