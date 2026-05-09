import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotificationEntity, type NotificationType } from '../database/entities/notification.entity';

export type CreateNotificationInput = {
  recipientId: string;
  actorId: string;
  diaryId?: string | null;
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
  ) {}

  async listForUser(userId: string) {
    const rows = await this.notifications.find({
      where: { userId },
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

  async notifyAuthorFollowed(input: Omit<CreateNotificationInput, 'diaryId'>) {
    return this.createForOtherUser({ ...input, diaryId: null, type: 'AUTHOR_FOLLOWED' });
  }

  async markRead(notificationId: string, userId: string) {
    const notification = await this.notifications.findOne({
      where: { id: notificationId, userId },
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
    return this.notifications.save(
      this.notifications.create({
        userId: input.recipientId,
        actorId: input.actorId,
        diaryId: input.diaryId ?? null,
        type: input.type,
      }),
    );
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
