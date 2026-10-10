import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
  Optional,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { WATCH_COMMENT_MAX_LENGTH } from '@davas/shared';
import { Repository } from 'typeorm';
import { CommentEntity } from '../database/entities/comment.entity';
import { DiaryEntity } from '../database/entities/diary.entity';
import { WatchParticipantEntity } from '../database/entities/watch-participant.entity';
import { NotificationsService } from '../notifications/notifications.service';
import { DiaryAccessService } from '../diaries/diary-access.service';

export type CommunityCommentView = {
  id: string;
  diaryId: string;
  content: string;
  author: {
    id: string;
    nickname: string;
    profileImageUrl: string | null;
  };
  createdAt: string;
  updatedAt: string;
  isMine: boolean;
};

function normalizeContent(content: string) {
  const normalized = content.trim();
  if (!normalized) {
    throw new BadRequestException('댓글 내용을 입력해주세요.');
  }
  if (normalized.length > WATCH_COMMENT_MAX_LENGTH) {
    throw new BadRequestException(`댓글은 ${WATCH_COMMENT_MAX_LENGTH}자까지 쓸 수 있어요.`);
  }
  return normalized;
}

@Injectable()
export class CommentsService {
  private readonly logger = new Logger(CommentsService.name);

  constructor(
    @InjectRepository(CommentEntity)
    private readonly comments: Repository<CommentEntity>,
    @InjectRepository(DiaryEntity)
    private readonly diaries: Repository<DiaryEntity>,
    private readonly access: DiaryAccessService,
    @Optional()
    private readonly notifications?: NotificationsService,
    @Optional()
    @InjectRepository(WatchParticipantEntity)
    private readonly participants?: Repository<WatchParticipantEntity>,
  ) {}

  async listForDiary(diaryId: string, userId = '') {
    await this.ensureAccessibleDiary(diaryId, userId);
    const comments = await this.comments.find({
      where: { diaryId },
      relations: { user: true },
      order: { createdAt: 'ASC' },
    });
    return { diaryId, items: comments.map((comment) => this.toCommentView(comment, userId)) };
  }

  async create(diaryId: string, userId: string, content: string) {
    const diary = await this.ensureAccessibleDiary(diaryId, userId);
    const comment = this.comments.create({ diaryId, userId, content: normalizeContent(content) });
    const saved = await this.comments.save(comment);
    await this.notifyCommented(diary, saved.id, userId);
    const savedWithUser = await this.comments.findOne({
      where: { id: saved.id, userId },
      relations: { user: true },
    });
    return this.toCommentView(savedWithUser ?? saved, userId);
  }

  async remove(commentId: string, userId: string) {
    await this.findOwnedAccessibleComment(commentId, userId);
    await this.comments.softDelete({ id: commentId, userId });
    return { id: commentId, deleted: true };
  }

  /**
   * The author and everyone who confirmed watching hear about it, once per comment, as long as
   * they can still see the record (someone who left the space does not). The comment is
   * already saved, so a failed notification is logged, never turned into a failed request
   * that the person would retry into a duplicate comment.
   */
  private async notifyCommented(diary: DiaryEntity, commentId: string, actorId: string) {
    if (!this.notifications) return;
    try {
      const watchers =
        (await this.participants?.find({ where: { diaryId: diary.id, status: 'CONFIRMED' } })) ??
        [];
      const recipients = new Set([diary.userId, ...watchers.map((row) => row.accountId)]);
      recipients.delete(actorId);
      for (const recipientId of recipients) {
        if (!(await this.access.canView(diary, recipientId))) continue;
        await this.notifications.notifyDiaryCommented({
          diaryId: diary.id,
          recipientId,
          actorId,
          idempotencyKey: `DIARY_COMMENTED:${recipientId}:${commentId}`,
        });
      }
    } catch (error) {
      this.logger.warn(`comment notification skipped: ${String(error)}`);
    }
  }

  private async ensureAccessibleDiary(diaryId: string, userId: string) {
    const diary = await this.diaries.findOne({ where: { id: diaryId } });
    await this.access.assertCanView(diary, userId);
    return diary!;
  }

  private async findOwnedAccessibleComment(commentId: string, userId: string) {
    const comment = await this.comments.findOne({
      where: { id: commentId, userId },
      relations: { user: true, diary: true },
    });
    if (!comment) {
      throw new NotFoundException('댓글을 찾을 수 없습니다.');
    }
    await this.access.assertCanView(comment.diary, userId);
    return comment;
  }

  private toCommentView(comment: CommentEntity, userId?: string): CommunityCommentView {
    return {
      id: comment.id,
      diaryId: comment.diaryId,
      content: comment.content,
      author: {
        id: comment.user?.id ?? comment.userId,
        nickname: comment.user?.nickname ?? '알 수 없는 사용자',
        profileImageUrl: comment.user?.profileImageUrl ?? null,
      },
      createdAt: comment.createdAt.toISOString(),
      updatedAt: comment.updatedAt.toISOString(),
      isMine: Boolean(userId && comment.userId === userId),
    };
  }
}
