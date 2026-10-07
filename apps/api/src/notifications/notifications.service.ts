import { BadRequestException, Injectable, NotFoundException, Optional } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, IsNull, Not, Repository } from 'typeorm';
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
  mediaId?: string | null;
  idempotencyKey?: string;
};

// Kinds shown in the in-app notification center.
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
  'SPACE_INVITE_DECLINED',
  'RECOMMENDATION_REQUESTED',
  'RECOMMENDATION_MATCHED',
] as const satisfies readonly NotificationType[];

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
  media: {
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
    const saved = this.preferences ? await this.preferences.find({ where: { userId } }) : [];
    const byCategory = new Map(saved.map((row) => [row.category, row.enabled]));
    return NOTIFICATION_PREFERENCE_CATEGORIES.map((category) => ({
      category,
      required: REQUIRED_NOTIFICATION_CATEGORIES.has(category),
      enabled: REQUIRED_NOTIFICATION_CATEGORIES.has(category)
        ? true
        : (byCategory.get(category) ?? true),
    }));
  }

  async setPreference(userId: string, category: NotificationPreferenceCategory, enabled: boolean) {
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
      where: { userId, type: In([...VISIBLE_TYPES]) },
      relations: { actor: true, diary: true, media: true },
      order: { createdAt: 'DESC' },
      take: 50,
    });
    return {
      unreadCount: await this.unreadCount(userId),
      items: rows.map((notification) => this.toView(notification)),
    };
  }

  /** For the header bell; counts every unread notification, not just the latest 50. */
  async unreadCount(userId: string) {
    return this.notifications.count({
      where: { userId, readAt: IsNull(), type: In([...VISIBLE_TYPES]) },
    });
  }

  async markAllRead(userId: string) {
    await this.notifications.update(
      { userId, readAt: IsNull(), type: In([...VISIBLE_TYPES]) },
      { readAt: new Date() },
    );
    return { unreadCount: 0 };
  }

  async notifyWatchShared(input: CreateNotificationInput) {
    return this.createForOtherUser({ ...input, type: 'WATCH_SHARED' });
  }

  async notifyReviewRevealed(input: CreateNotificationInput) {
    return this.createForOtherUser({ ...input, type: 'REVIEW_REVEALED' });
  }

  async notifyReviewLiked(input: CreateNotificationInput) {
    return this.createForOtherUser({ ...input, type: 'REVIEW_LIKED' });
  }

  async notifyWishMatched(input: CreateNotificationInput) {
    return this.createForOtherUser({ ...input, diaryId: null, type: 'WISH_MATCHED' });
  }

  async notifyDiaryLiked(input: CreateNotificationInput) {
    return this.createForOtherUser({
      ...input,
      diaryId: input.diaryId ?? null,
      type: 'DIARY_LIKED',
    });
  }

  async notifyDiaryCommented(input: CreateNotificationInput) {
    return this.createForOtherUser({
      ...input,
      diaryId: input.diaryId ?? null,
      type: 'DIARY_COMMENTED',
    });
  }

  async notifyFriendRequested(input: Omit<CreateNotificationInput, 'diaryId'>) {
    return this.createForOtherUser({ ...input, diaryId: null, type: 'FRIEND_REQUESTED' });
  }
  async notifyFriendAccepted(input: Omit<CreateNotificationInput, 'diaryId'>) {
    return this.createForOtherUser({ ...input, diaryId: null, type: 'FRIEND_ACCEPTED' });
  }
  async notifySpaceInvite(input: Omit<CreateNotificationInput, 'diaryId'>) {
    return this.createForOtherUser({ ...input, diaryId: null, type: 'SPACE_INVITE' });
  }
  async notifySpaceInviteDeclined(input: Omit<CreateNotificationInput, 'diaryId'>) {
    return this.createForOtherUser({ ...input, diaryId: null, type: 'SPACE_INVITE_DECLINED' });
  }
  async notifyRecommendationRequested(input: Omit<CreateNotificationInput, 'diaryId'>) {
    return this.createForOtherUser({ ...input, diaryId: null, type: 'RECOMMENDATION_REQUESTED' });
  }
  async notifyRecommendationMatched(input: Omit<CreateNotificationInput, 'diaryId'>) {
    return this.createForOtherUser({ ...input, diaryId: null, type: 'RECOMMENDATION_MATCHED' });
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
          mediaId: input.mediaId ?? null,
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
    if (type === 'SPACE_INVITE' || type === 'SPACE_INVITE_DECLINED') return 'SPACE_INVITE';
    if (type === 'WATCH_PARTICIPATION_REQUESTED') return 'WATCH_PARTICIPATION';
    if (
      type === 'WISH_MATCHED' ||
      type === 'RECOMMENDATION_REQUESTED' ||
      type === 'RECOMMENDATION_MATCHED'
    )
      return 'RECOMMENDATION';
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
      media: notification.media
        ? {
            id: notification.media.id,
            title: notification.media.title,
          }
        : null,
      readAt: notification.readAt?.toISOString() ?? null,
      createdAt: notification.createdAt.toISOString(),
    };
  }
}
