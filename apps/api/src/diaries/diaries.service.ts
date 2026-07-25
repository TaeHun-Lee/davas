import { createHash } from 'node:crypto';
import { ConflictException, HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DiaryVisibility, MediaType, ViewingMethod } from '@davas/shared';
import { Brackets, Repository, SelectQueryBuilder } from 'typeorm';
import { DiaryEntity, DiaryShareEntity, MediaEntity } from '../database/entities';
import { DiaryAccessService } from './diary-access.service';
import { CreateDiaryDto } from './dto/create-diary.dto';
import { UpdateDiaryDto } from './dto/update-diary.dto';

export type DiaryListQuery = { q?: string; mediaType?: MediaType; viewingMethod?: ViewingMethod; cursor?: string; limit?: number };

function apiError(statusCode: number, code: string, message: string, details?: Record<string, unknown>) {
  return new HttpException({ statusCode, code, message, ...(details ? { details } : {}) }, statusCode);
}

function assertNotFuture(date: string) {
  const today = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Seoul', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());
  if (date > today) throw apiError(400, 'FUTURE_WATCHED_DATE', '본 날짜는 오늘 이후일 수 없어요.');
}

function normalizedCreate(dto: CreateDiaryDto) {
  const content = (dto.content ?? '').trim();
  return {
    mediaId: dto.mediaId,
    viewingMethod: dto.viewingMethod!,
    watchedDate: dto.watchedDate,
    rating: dto.rating ?? null,
    content,
    hasSpoiler: content ? Boolean(dto.hasSpoiler) : false,
    visibility: dto.visibility ?? 'FRIENDS',
  };
}

function fingerprint(dto: CreateDiaryDto) {
  return createHash('sha256').update(JSON.stringify(normalizedCreate(dto))).digest('hex');
}

@Injectable()
export class DiariesService {
  constructor(
    @InjectRepository(DiaryEntity) private readonly diaries: Repository<DiaryEntity>,
    @InjectRepository(MediaEntity) private readonly media: Repository<MediaEntity>,
    @InjectRepository(DiaryShareEntity) private readonly shares: Repository<DiaryShareEntity>,
    private readonly access: DiaryAccessService,
  ) {}

  async create(userId: string, dto: CreateDiaryDto) {
    assertNotFuture(dto.watchedDate);
    const requestFingerprint = fingerprint(dto);
    const replay = await this.diaries.findOne({ where: { userId, clientRequestId: dto.clientRequestId! }, withDeleted: true, relations: { media: true, user: true } });
    if (replay) return this.resolveReplay(replay, requestFingerprint, userId);

    const media = await this.media.findOne({ where: { id: dto.mediaId } });
    if (!media) throw apiError(400, 'MEDIA_NOT_FOUND', '선택한 작품을 찾을 수 없어요.');

    const existing = await this.diaries.findOne({ where: { userId, mediaId: dto.mediaId, watchedDate: dto.watchedDate, viewingMethod: dto.viewingMethod }, relations: { media: true } });
    if (existing && !dto.allowDuplicate) {
      throw apiError(409, 'POSSIBLE_REWATCH', '이미 같은 조건의 기록이 있어요.', {
        existingRecord: { id: existing.id, mediaTitle: existing.media?.title ?? existing.title, watchedDate: existing.watchedDate, viewingMethod: existing.viewingMethod },
      });
    }

    const value = normalizedCreate(dto);
    const entity = this.diaries.create({
      userId,
      mediaId: media.id,
      title: media.title,
      content: value.content,
      watchedDate: value.watchedDate,
      rating: value.rating === null ? null : value.rating.toFixed(1),
      visibility: value.visibility,
      hasSpoiler: value.hasSpoiler,
      viewingMethod: value.viewingMethod,
      sharedAt: value.visibility === 'FRIENDS' ? new Date() : null,
      clientRequestId: dto.clientRequestId!,
      clientRequestFingerprint: requestFingerprint,
      watchedPlace: null,
      mood: null,
      memoryNote: null,
    });
    try {
      const saved = await this.diaries.save(entity);
      saved.media = media;
      return { diary: this.toDetail(saved, userId), deduplicated: false };
    } catch (error) {
      if ((error as { code?: string }).code === '23505') {
        const raced = await this.diaries.findOne({ where: { userId, clientRequestId: dto.clientRequestId! }, withDeleted: true, relations: { media: true, user: true } });
        if (raced) return this.resolveReplay(raced, requestFingerprint, userId);
      }
      throw error;
    }
  }

  async detail(userId: string, id: string) {
    const diary = await this.diaries.findOne({ where: { id }, relations: { media: true, user: true, selectedShares: true } });
    if (!diary || !(await this.access.canView(diary, userId))) throw apiError(404, 'RECORD_NOT_FOUND', '기록을 찾을 수 없어요.');
    return this.toDetail(diary, userId);
  }

  async update(userId: string, id: string, dto: UpdateDiaryDto) {
    const diary = await this.diaries.findOne({ where: { id, userId }, relations: { media: true, user: true, selectedShares: true } });
    if (!diary) throw apiError(404, 'RECORD_NOT_FOUND', '기록을 찾을 수 없어요.');
    if (dto.watchedDate) assertNotFuture(dto.watchedDate);
    if (dto.mediaId && dto.mediaId !== diary.mediaId) {
      const media = await this.media.findOne({ where: { id: dto.mediaId } });
      if (!media) throw apiError(400, 'MEDIA_NOT_FOUND', '선택한 작품을 찾을 수 없어요.');
      diary.mediaId = media.id;
      diary.media = media;
      diary.title = media.title;
    }
    if (dto.viewingMethod !== undefined) diary.viewingMethod = dto.viewingMethod;
    if (dto.watchedDate !== undefined) diary.watchedDate = dto.watchedDate;
    if (dto.rating !== undefined) diary.rating = dto.rating === null ? null : dto.rating.toFixed(1);
    if (dto.content !== undefined) diary.content = dto.content.trim();
    if (dto.hasSpoiler !== undefined) diary.hasSpoiler = dto.hasSpoiler;
    if (!diary.content.trim()) diary.hasSpoiler = false;
    if (dto.visibility !== undefined && dto.visibility !== diary.visibility) {
      const previous = diary.visibility;
      diary.visibility = dto.visibility;
      if (dto.visibility === 'FRIENDS' && previous !== 'FRIENDS') diary.sharedAt = new Date();
      if (dto.visibility === 'PRIVATE') diary.sharedAt = null;
      await this.shares.delete({ diaryId: diary.id });
    }
    const saved = await this.diaries.save(diary);
    return this.toDetail(saved, userId);
  }

  async remove(userId: string, id: string) {
    const diary = await this.diaries.findOne({ where: { id, userId } });
    if (!diary) throw apiError(404, 'RECORD_NOT_FOUND', '기록을 찾을 수 없어요.');
    await this.diaries.softDelete({ id, userId });
    return { id, deleted: true };
  }

  async feed(userId: string, query: DiaryListQuery) {
    const qb = this.baseListQuery();
    qb.leftJoin('diary.selectedShares', 'selectedShare');
    qb.andWhere(new Brackets((where) => {
      where.where(`diary.visibility = 'FRIENDS' AND (diary.userId = :viewerId OR EXISTS (SELECT 1 FROM friendships f WHERE f.status = 'ACCEPTED' AND ((f.requester_id = diary.user_id AND f.receiver_id = :viewerId) OR (f.receiver_id = diary.user_id AND f.requester_id = :viewerId)))`, { viewerId: userId })
        .orWhere(`diary.visibility = 'SELECTED' AND selectedShare.userId = :viewerId`, { viewerId: userId });
    }));
    this.applyFilters(qb, query, true);
    this.applyCursor(qb, query.cursor, 'feed');
    qb.orderBy('diary.sharedAt', 'DESC').addOrderBy('diary.createdAt', 'DESC').addOrderBy('diary.id', 'DESC');
    return this.finishPage(qb, userId, query.limit, 'feed');
  }

  async mine(userId: string, query: DiaryListQuery) {
    const qb = this.baseListQuery().andWhere('diary.userId = :viewerId', { viewerId: userId });
    this.applyFilters(qb, query, false);
    this.applyCursor(qb, query.cursor, 'mine');
    qb.orderBy('diary.watchedDate', 'DESC').addOrderBy('diary.createdAt', 'DESC').addOrderBy('diary.id', 'DESC');
    return this.finishPage(qb, userId, query.limit, 'mine');
  }

  private baseListQuery() {
    return this.diaries.createQueryBuilder('diary').innerJoinAndSelect('diary.media', 'media').innerJoinAndSelect('diary.user', 'author');
  }

  private applyFilters(qb: SelectQueryBuilder<DiaryEntity>, query: DiaryListQuery, includeAuthor: boolean) {
    const q = query.q?.trim();
    if (q) {
      const fields = includeAuthor ? '(media.title ILIKE :q OR media.originalTitle ILIKE :q OR author.nickname ILIKE :q)' : '(media.title ILIKE :q OR media.originalTitle ILIKE :q)';
      qb.andWhere(fields, { q: `%${q}%` });
    }
    if (query.mediaType) qb.andWhere('media.mediaType = :mediaType', { mediaType: query.mediaType });
    if (query.viewingMethod) qb.andWhere('diary.viewingMethod = :viewingMethod', { viewingMethod: query.viewingMethod });
  }

  private applyCursor(qb: SelectQueryBuilder<DiaryEntity>, raw: string | undefined, mode: 'feed' | 'mine') {
    if (!raw) return;
    try {
      const cursor = JSON.parse(Buffer.from(raw, 'base64url').toString('utf8')) as { first: string; createdAt: string; id: string };
      const first = mode === 'feed' ? 'diary.sharedAt' : 'diary.watchedDate';
      qb.andWhere(`(${first} < :cursorFirst OR (${first} = :cursorFirst AND diary.createdAt < :cursorCreated) OR (${first} = :cursorFirst AND diary.createdAt = :cursorCreated AND diary.id < :cursorId))`, { cursorFirst: cursor.first, cursorCreated: cursor.createdAt, cursorId: cursor.id });
    } catch {
      throw apiError(400, 'INVALID_CURSOR', '목록 위치 정보가 올바르지 않아요.');
    }
  }

  private async finishPage(qb: SelectQueryBuilder<DiaryEntity>, userId: string, requestedLimit: number | undefined, mode: 'feed' | 'mine') {
    const limit = Math.min(50, Math.max(1, requestedLimit ?? 20));
    const rows = await qb.take(limit + 1).getMany();
    const hasMore = rows.length > limit;
    const items = rows.slice(0, limit);
    const last = items.at(-1);
    const nextCursor = hasMore && last ? Buffer.from(JSON.stringify({ first: mode === 'feed' ? last.sharedAt?.toISOString() : last.watchedDate, createdAt: last.createdAt.toISOString(), id: last.id })).toString('base64url') : null;
    return { items: items.map((item) => this.toCard(item, userId)), nextCursor, hasMore };
  }

  private resolveReplay(diary: DiaryEntity, expected: string, userId: string) {
    if (diary.clientRequestFingerprint !== expected) throw apiError(409, 'IDEMPOTENCY_CONFLICT', '같은 요청 식별자로 다른 내용을 저장할 수 없어요.');
    return { diary: this.toDetail(diary, userId), deduplicated: true };
  }

  private toCard(diary: DiaryEntity, viewerId: string) {
    const content = diary.content?.trim() ?? '';
    return {
      id: diary.id,
      author: { id: diary.user?.id ?? diary.userId, nickname: diary.user?.nickname ?? '알 수 없음', profileImageUrl: diary.user?.profileImageUrl ?? null },
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

  private toDetail(diary: DiaryEntity, viewerId: string) {
    return { ...this.toCard(diary, viewerId), content: diary.content ?? '', updatedAt: diary.updatedAt?.toISOString(), selectedUserIds: diary.visibility === 'SELECTED' ? diary.selectedShares?.map((share) => share.userId) ?? [] : undefined };
  }
}
