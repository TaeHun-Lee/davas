import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CommentEntity } from '../database/entities/comment.entity';
import { DiaryEntity } from '../database/entities/diary.entity';

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
  return normalized;
}

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(CommentEntity)
    private readonly comments: Repository<CommentEntity>,
    @InjectRepository(DiaryEntity)
    private readonly diaries: Repository<DiaryEntity>,
  ) {}

  async listForDiary(diaryId: string, userId?: string) {
    await this.ensurePublicDiary(diaryId);
    const comments = await this.comments.find({
      where: { diaryId },
      relations: { user: true },
      order: { createdAt: 'ASC' },
    });
    return { diaryId, items: comments.map((comment) => this.toCommentView(comment, userId)) };
  }

  async create(diaryId: string, userId: string, content: string) {
    await this.ensurePublicDiary(diaryId);
    const comment = this.comments.create({ diaryId, userId, content: normalizeContent(content) });
    const saved = await this.comments.save(comment);
    return this.toCommentView({ ...saved, user: saved.user ?? ({ id: userId, nickname: '나', profileImageUrl: null } as CommentEntity['user']) }, userId);
  }

  async update(commentId: string, userId: string, content: string) {
    const comment = await this.findOwnedPublicComment(commentId, userId);
    comment.content = normalizeContent(content);
    return this.toCommentView(await this.comments.save(comment), userId);
  }

  async remove(commentId: string, userId: string) {
    await this.findOwnedPublicComment(commentId, userId);
    await this.comments.softDelete({ id: commentId, userId });
    return { id: commentId, deleted: true };
  }

  private async ensurePublicDiary(diaryId: string) {
    const diary = await this.diaries.findOne({ where: { id: diaryId, visibility: 'PUBLIC' } });
    if (!diary) {
      throw new NotFoundException('공개 다이어리를 찾을 수 없습니다.');
    }
    return diary;
  }

  private async findOwnedPublicComment(commentId: string, userId: string) {
    const comment = await this.comments.findOne({
      where: { id: commentId, userId },
      relations: { user: true, diary: true },
    });
    if (!comment || comment.diary?.visibility !== 'PUBLIC') {
      throw new NotFoundException('댓글을 찾을 수 없습니다.');
    }
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
