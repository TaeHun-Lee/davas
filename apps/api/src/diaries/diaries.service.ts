import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MediaType, ViewingMethod } from '@davas/shared';
import { Brackets, Repository, SelectQueryBuilder } from 'typeorm';
import { DiaryEntity } from '../database/entities';

export type DiaryListQuery = {
  q?: string;
  mediaId?: string;
  mediaType?: MediaType;
  viewingMethod?: ViewingMethod;
  cursor?: string;
  limit?: number;
};

export const FEED_FRIENDS_ACCESS_PREDICATE =
  `diary.visibility = 'FRIENDS' AND (` +
  `diary.userId = :viewerId OR EXISTS (` +
  `SELECT 1 FROM friendships f WHERE f.status = 'ACCEPTED' AND (` +
  `(f.requester_id = diary.user_id AND f.receiver_id = :viewerId) OR ` +
  `(f.receiver_id = diary.user_id AND f.requester_id = :viewerId)` +
  `)))`;

function apiError(statusCode: number, code: string, message: string) {
  return new HttpException({ statusCode, code, message }, statusCode);
}

/**
 * The old record lists: friends' shared records (/diaries/feed) and my own (/diaries/me).
 * Records are written and read one by one through the watch-event API.
 */
@Injectable()
export class DiariesService {
  constructor(
    @InjectRepository(DiaryEntity)
    private readonly diaries: Repository<DiaryEntity>,
  ) {}

  async feed(userId: string, query: DiaryListQuery) {
    const qb = this.baseListQuery();
    qb.leftJoin('diary.selectedShares', 'selectedShare');
    qb.andWhere(
      new Brackets((where) => {
        where
          .where(FEED_FRIENDS_ACCESS_PREDICATE, { viewerId: userId })
          .orWhere(`diary.visibility = 'SELECTED' AND selectedShare.userId = :viewerId`, {
            viewerId: userId,
          });
      }),
    );
    qb.andWhere('diary.sharedAt IS NOT NULL');
    this.applyFilters(qb, query, true);
    this.applyCursor(qb, query.cursor, 'feed');
    qb.orderBy('diary.sharedAt', 'DESC')
      .addOrderBy('diary.createdAt', 'DESC')
      .addOrderBy('diary.id', 'DESC');
    return this.finishPage(qb, userId, query.limit, 'feed');
  }

  async mine(userId: string, query: DiaryListQuery) {
    const qb = this.baseListQuery().andWhere('diary.userId = :viewerId', {
      viewerId: userId,
    });
    this.applyFilters(qb, query, false);
    this.applyCursor(qb, query.cursor, 'mine');
    qb.orderBy('diary.watchedDate', 'DESC')
      .addOrderBy('diary.createdAt', 'DESC')
      .addOrderBy('diary.id', 'DESC');
    return this.finishPage(qb, userId, query.limit, 'mine');
  }

  private baseListQuery() {
    return this.diaries
      .createQueryBuilder('diary')
      .innerJoinAndSelect('diary.media', 'media')
      .innerJoinAndSelect('diary.user', 'author');
  }

  private applyFilters(
    qb: SelectQueryBuilder<DiaryEntity>,
    query: DiaryListQuery,
    includeAuthor: boolean,
  ) {
    const q = query.q?.trim();
    if (q) {
      const fields = includeAuthor
        ? '(media.title ILIKE :q OR media.originalTitle ILIKE :q OR author.nickname ILIKE :q)'
        : '(media.title ILIKE :q OR media.originalTitle ILIKE :q)';
      qb.andWhere(fields, { q: `%${q}%` });
    }
    if (query.mediaId) qb.andWhere('diary.mediaId = :mediaId', { mediaId: query.mediaId });
    if (query.mediaType)
      qb.andWhere('media.mediaType = :mediaType', {
        mediaType: query.mediaType,
      });
    if (query.viewingMethod)
      qb.andWhere('diary.viewingMethod = :viewingMethod', {
        viewingMethod: query.viewingMethod,
      });
  }

  private applyCursor(
    qb: SelectQueryBuilder<DiaryEntity>,
    raw: string | undefined,
    mode: 'feed' | 'mine',
  ) {
    if (!raw) return;
    try {
      const cursor = JSON.parse(Buffer.from(raw, 'base64url').toString('utf8')) as {
        first: string;
        createdAt: string;
        id: string;
      };
      const first = mode === 'feed' ? 'diary.sharedAt' : 'diary.watchedDate';
      qb.andWhere(
        `(${first} < :cursorFirst OR (${first} = :cursorFirst AND diary.createdAt < :cursorCreated) OR (${first} = :cursorFirst AND diary.createdAt = :cursorCreated AND diary.id < :cursorId))`,
        {
          cursorFirst: cursor.first,
          cursorCreated: cursor.createdAt,
          cursorId: cursor.id,
        },
      );
    } catch {
      throw apiError(400, 'INVALID_CURSOR', '목록 위치 정보가 올바르지 않아요.');
    }
  }

  private async finishPage(
    qb: SelectQueryBuilder<DiaryEntity>,
    userId: string,
    requestedLimit: number | undefined,
    mode: 'feed' | 'mine',
  ) {
    const limit = Math.min(50, Math.max(1, requestedLimit ?? 20));
    const rows = await qb.take(limit + 1).getMany();
    const hasMore = rows.length > limit;
    const items = rows.slice(0, limit);
    const last = items.at(-1);
    const nextCursor =
      hasMore && last
        ? Buffer.from(
            JSON.stringify({
              first: mode === 'feed' ? last.sharedAt?.toISOString() : last.watchedDate,
              createdAt: last.createdAt.toISOString(),
              id: last.id,
            }),
          ).toString('base64url')
        : null;
    return {
      items: items.map((item) => this.toCard(item, userId)),
      nextCursor,
      hasMore,
    };
  }

  private toCard(diary: DiaryEntity, viewerId: string) {
    const content = diary.content?.trim() ?? '';
    return {
      id: diary.id,
      recordTitle: diary.title,
      author: {
        id: diary.user?.id ?? diary.userId,
        nickname: diary.user?.nickname ?? '알 수 없음',
        profileImageUrl: diary.user?.profileImageUrl ?? null,
      },
      media: {
        id: diary.media?.id ?? diary.mediaId,
        title: diary.media?.title ?? diary.title,
        originalTitle: diary.media?.originalTitle ?? null,
        posterUrl: diary.media?.posterUrl ?? null,
        releaseYear: diary.media?.releaseDate?.slice(0, 4) ?? null,
        mediaType: diary.media?.mediaType ?? 'MOVIE',
      },
      viewingMethod: diary.viewingMethod ?? null,
      watchedDate: diary.watchedDate,
      rating: diary.rating === null ? null : Number(diary.rating),
      reviewPreview: !content || diary.hasSpoiler ? null : content.slice(0, 140),
      hasSpoiler: diary.hasSpoiler,
      visibility: diary.visibility,
      sharedAt: diary.sharedAt?.toISOString() ?? null,
      createdAt: diary.createdAt?.toISOString(),
      isMine: diary.userId === viewerId,
    };
  }
}
