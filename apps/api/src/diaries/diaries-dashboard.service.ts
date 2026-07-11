import { ForbiddenException, GoneException, Injectable, NotFoundException, Optional } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DiaryCompanionEntity, DiaryEntity, DiaryShareEntity, MediaEntity, WatchlistItemEntity } from '../database/entities';
import { resolveTmdbGenreLabel, resolveTmdbGenreLabels } from '../media/tmdb-genres';
import { CreateDiaryDto } from './dto/create-diary.dto';
import { UpdateDiaryDto } from './dto/update-diary.dto';
import { DiaryAccessService } from './diary-access.service';

const DEFAULT_POSTER_GRADIENT = 'from-[#e9eef7] via-[#f6f8fc] to-[#dfe8f5]';
const GENRE_ICON_KINDS = ['sf', 'drama', 'thriller', 'action', 'etc'] as const;

type DiaryDashboardItem = {
  id: string;
  mediaId: string;
  mediaTitle: string;
  diaryTitle: string;
  watchedDate: string;
  createdAt: string;
  rating: number;
  contentPreview: string;
  posterUrl?: string | null;
  posterGradient: string;
  genreNames: string[];
};

function toDateParts(dateString: string) {
  const [year, month, day] = dateString.split('-').map((part) => Number(part));
  return { year, month, day };
}

function formatWatchedDate(dateString: string) {
  return dateString.split('-').join('.');
}

function buildContentPreview(content: string) {
  return content.trim().slice(0, 120);
}

function buildGenreRatios(items: DiaryDashboardItem[]) {
  const counts = new Map<string, number>();
  for (const item of items) {
    for (const genre of item.genreNames) {
      const genreLabel = resolveTmdbGenreLabel(genre);
      counts.set(genreLabel, (counts.get(genreLabel) ?? 0) + 1);
    }
  }

  const total = Array.from(counts.values()).reduce((sum, count) => sum + count, 0);
  if (total === 0) {
    return [];
  }

  return Array.from(counts.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([genre, count], index) => ({
      genre,
      count,
      percentage: Math.round((count / total) * 100),
      iconKind: GENRE_ICON_KINDS[index] ?? 'etc',
    }));
}

@Injectable()
export class DiariesDashboardService {
  constructor(
    @InjectRepository(DiaryEntity)
    private readonly diaries: Repository<DiaryEntity>,
    @InjectRepository(MediaEntity)
    private readonly mediaRepository?: Repository<MediaEntity>,
    @Optional() @InjectRepository(DiaryCompanionEntity) private readonly companionRepository?: Repository<DiaryCompanionEntity>,
    @Optional() @InjectRepository(DiaryShareEntity) private readonly shareRepository?: Repository<DiaryShareEntity>,
    @Optional() @InjectRepository(WatchlistItemEntity) private readonly watchlistRepository?: Repository<WatchlistItemEntity>,
    @Optional() private readonly access?: DiaryAccessService,
  ) {}

  async createDiary(userId: string, dto: CreateDiaryDto) {
    await this.saveRepresentativePoster(dto);
    const relatedDto = this.normalizeRelatedRows(dto.visibility, dto);
    const connection = this.diaries.manager?.connection;
    if (connection?.isInitialized && this.companionRepository && this.shareRepository && this.watchlistRepository) {
      return connection.transaction(async (manager) => {
        const diaryRepository = manager.getRepository(DiaryEntity);
        const saved = await diaryRepository.save(this.createDiaryEntity(diaryRepository, userId, dto));
        await this.replaceRelatedRows(saved.id, relatedDto, manager.getRepository(DiaryCompanionEntity), manager.getRepository(DiaryShareEntity));
        const watchlistRepository = manager.getRepository(WatchlistItemEntity);
        const watchlist = await watchlistRepository.findOne({ where: { userId, mediaId: saved.mediaId } });
        if (watchlist) { watchlist.status = 'WATCHED'; await watchlistRepository.save(watchlist); }
        return saved;
      });
    }
    const saved = await this.diaries.save(this.createDiaryEntity(this.diaries, userId, dto));
    await this.replaceRelatedRows(saved.id, relatedDto);
    const watchlist = await this.watchlistRepository?.findOne({ where: { userId, mediaId: saved.mediaId } });
    if (watchlist) { watchlist.status = 'WATCHED'; await this.watchlistRepository?.save(watchlist); }
    return saved;
  }

  private createDiaryEntity(repository: Repository<DiaryEntity>, userId: string, dto: CreateDiaryDto) {
    return repository.create({
      userId,
      mediaId: dto.mediaId,
      title: dto.title,
      content: dto.content ?? '',
      watchedDate: dto.watchedDate,
      rating: dto.rating.toFixed(1),
      visibility: dto.visibility,
      hasSpoiler: dto.hasSpoiler,
      watchedPlace: dto.watchedPlace?.trim() || null,
      mood: dto.mood?.trim() || null,
      memoryNote: dto.memoryNote?.trim() || null,
    });
  }

  async getDiaryForEdit(userId: string, id: string) {
    const diary = await this.diaries.findOne({
      where: { id, userId },
      relations: { media: true },
    });
    if (!diary) {
      throw new NotFoundException('다이어리를 찾을 수 없습니다.');
    }

    return this.toEditableDiary(diary);
  }

  async getDiary(userId: string, id: string) {
    const diary = await this.diaries.findOne({
      where: { id },
      withDeleted: true,
      relations: { media: true, user: true, companions: { user: true }, selectedShares: true, comments: true, reactions: true } as never,
    });
    if (diary?.deletedAt) {
      if (diary.userId === userId) throw new GoneException('삭제된 기록입니다.');
      throw new NotFoundException('기록을 찾을 수 없습니다.');
    }
    await this.access?.assertCanView(diary, userId);
    if (!this.access && (!diary || diary.userId !== userId)) throw new NotFoundException('다이어리를 찾을 수 없습니다.');
    return this.toDiaryDetail(diary!, userId);
  }

  async updateDiary(userId: string, id: string, dto: UpdateDiaryDto) {
    const diary = await this.diaries.findOne({ where: { id, userId }, relations: { media: true } });
    if (!diary) {
      throw new NotFoundException('다이어리를 찾을 수 없습니다.');
    }

    if (dto.mediaId !== undefined) diary.mediaId = dto.mediaId;
    if (dto.title !== undefined) diary.title = dto.title;
    if (dto.content !== undefined) diary.content = dto.content;
    if (dto.watchedDate !== undefined) diary.watchedDate = dto.watchedDate;
    if (dto.rating !== undefined) diary.rating = dto.rating.toFixed(1);
    if (dto.visibility !== undefined) diary.visibility = dto.visibility;
    if (dto.hasSpoiler !== undefined) diary.hasSpoiler = dto.hasSpoiler;
    if (dto.watchedPlace !== undefined) diary.watchedPlace = dto.watchedPlace.trim() || null;
    if (dto.mood !== undefined) diary.mood = dto.mood.trim() || null;
    if (dto.memoryNote !== undefined) diary.memoryNote = dto.memoryNote.trim() || null;

    const relatedDto = this.normalizeRelatedRows(diary.visibility, dto);

    await this.saveRepresentativePoster(dto);
    const connection = this.diaries.manager?.connection;
    if (connection?.isInitialized && this.companionRepository && this.shareRepository) {
      const saved = await connection.transaction(async (manager) => {
        const row = await manager.getRepository(DiaryEntity).save(diary);
        await this.replaceRelatedRows(id, relatedDto, manager.getRepository(DiaryCompanionEntity), manager.getRepository(DiaryShareEntity));
        return row;
      });
      return this.toEditableDiary(saved);
    }
    const saved = await this.diaries.save(diary);
    await this.replaceRelatedRows(id, relatedDto);
    return this.toEditableDiary(saved);
  }

  async removeDiary(userId: string, id: string) {
    const repository = this.diaries as Repository<DiaryEntity> & { findOne: Repository<DiaryEntity>['findOne']; softDelete: Repository<DiaryEntity>['softDelete'] };
    const diary = await repository.findOne({ where: { id }, withDeleted: true });
    if (!diary) throw new NotFoundException('기록을 찾을 수 없습니다.');
    if (diary.deletedAt) throw new GoneException('이미 삭제된 기록입니다.');
    if (diary.userId !== userId) throw new ForbiddenException('기록을 삭제할 권한이 없습니다.');
    await repository.softDelete({ id, userId });
    return { id, deleted: true };
  }

  async getMyDiaries(userId: string) {
    const rows = await this.diaries.find({ where: { userId }, relations: { media: true }, order: { createdAt: 'DESC' } });
    return rows.map((diary) => this.toDiaryDetail(diary, userId));
  }

  async getFeed(userId: string) {
    const rows = await this.diaries.find({
      where: [{ visibility: 'FRIENDS' }, { visibility: 'SELECTED' }],
      relations: { media: true, user: true, comments: true, reactions: true } as never,
      order: { createdAt: 'DESC' },
      take: 100,
    });
    const visible: DiaryEntity[] = [];
    for (const row of rows) if (await this.access?.canView(row, userId)) visible.push(row);
    return visible.map((diary) => this.toDiaryDetail(diary, userId));
  }

  private toEditableDiary(diary: DiaryEntity) {
    const media = diary.media;
    return {
      id: diary.id,
      mediaId: diary.mediaId,
      title: diary.title,
      content: diary.content,
      watchedDate: diary.watchedDate,
      rating: Number(diary.rating),
      visibility: diary.visibility,
      hasSpoiler: diary.hasSpoiler,
      watchedPlace: diary.watchedPlace ?? null,
      mood: diary.mood ?? null,
      memoryNote: diary.memoryNote ?? null,
      companions: diary.companions?.map((item) => ({ id: item.id, userId: item.userId, displayName: item.displayName })) ?? [],
      selectedUserIds: diary.selectedShares?.map((item) => item.userId) ?? [],
      tags: [],
      media: {
        id: media?.id ?? diary.mediaId,
        title: media?.title ?? '제목 없음',
        originalTitle: media?.originalTitle ?? null,
        posterUrl: media?.posterUrl ?? null,
        releaseDate: media?.releaseDate ?? null,
        runtime: media?.runtime ?? null,
        mediaType: media?.mediaType ?? 'MOVIE',
        genres: resolveTmdbGenreLabels(media?.genres ?? []),
      },
    };
  }

  private toDiaryDetail(diary: DiaryEntity, viewerId: string) {
    return {
      ...this.toEditableDiary(diary),
      ownerMode: diary.userId === viewerId,
      author: { id: diary.user?.id ?? diary.userId, nickname: diary.user?.nickname ?? '나' },
      commentCount: diary.comments?.length ?? 0,
      reactions: diary.reactions?.map((reaction) => ({ id: reaction.id, emoji: reaction.emoji, userId: reaction.userId })) ?? [],
    };
  }

  private async replaceRelatedRows(diaryId: string, dto: { companions?: CreateDiaryDto['companions']; selectedUserIds?: CreateDiaryDto['selectedUserIds'] }, companionRepository = this.companionRepository, shareRepository = this.shareRepository) {
    if (dto.companions !== undefined && companionRepository) {
      await companionRepository.delete({ diaryId });
      const companions = dto.companions
        .map((item) => ({ userId: item.userId ?? null, displayName: item.displayName.trim() }))
        .filter((item) => item.displayName);
      if (companions.length) await companionRepository.save(companions.map((item) => companionRepository.create({ diaryId, ...item })));
    }
    if (dto.selectedUserIds !== undefined && shareRepository) {
      await shareRepository.delete({ diaryId });
      const ids = [...new Set(dto.selectedUserIds)];
      if (ids.length) await shareRepository.save(ids.map((userId) => shareRepository.create({ diaryId, userId })));
    }
  }

  private normalizeRelatedRows(
    visibility: DiaryEntity['visibility'],
    dto: { companions?: CreateDiaryDto['companions']; selectedUserIds?: CreateDiaryDto['selectedUserIds'] },
  ) {
    return {
      companions: dto.companions,
      selectedUserIds: visibility === 'SELECTED' ? dto.selectedUserIds : [],
    };
  }

  private async saveRepresentativePoster(dto: { mediaId?: string; mediaPosterUrl?: string | null }) {
    if (!dto.mediaId || !dto.mediaPosterUrl || !this.mediaRepository) {
      return;
    }

    const media = await this.mediaRepository.findOne({ where: { id: dto.mediaId } });
    if (!media || media.posterUrl === dto.mediaPosterUrl) {
      return;
    }

    media.posterUrl = dto.mediaPosterUrl;
    await this.mediaRepository.save(media);
  }

  async getDashboard(userId: string, selectedDate: { year?: number; month?: number; day?: number } = {}) {
    const diaries = await this.diaries.find({
      where: { userId },
      relations: { media: true },
      order: { createdAt: 'DESC', watchedDate: 'DESC' },
    });

    const dashboardItems = diaries.map((diary): DiaryDashboardItem => ({
      id: diary.id,
      mediaId: diary.mediaId,
      mediaTitle: diary.media?.title ?? '제목 없음',
      diaryTitle: diary.title,
      watchedDate: formatWatchedDate(diary.watchedDate),
      createdAt: diary.createdAt.toISOString(),
      rating: Number(diary.rating),
      contentPreview: buildContentPreview(diary.content),
      posterUrl: diary.media?.posterUrl ?? null,
      posterGradient: DEFAULT_POSTER_GRADIENT,
      genreNames: resolveTmdbGenreLabels(diary.media?.genres ?? []),
    }));

    const now = new Date();
    const latestDiaryDate = diaries[0]?.watchedDate ? toDateParts(diaries[0].watchedDate) : undefined;
    const baseDate = {
      year: selectedDate.year ?? latestDiaryDate?.year ?? now.getFullYear(),
      month: selectedDate.month ?? latestDiaryDate?.month ?? now.getMonth() + 1,
      day: selectedDate.day,
    };
    const monthlyItems = diaries.filter((diary) => {
      const { year, month } = toDateParts(diary.watchedDate);
      return year === baseDate.year && month === baseDate.month;
    });
    const averageRating = diaries.length > 0 ? diaries.reduce((sum, diary) => sum + Number(diary.rating), 0) / diaries.length : 0;
    const genreRatios = buildGenreRatios(dashboardItems);
    const markerCounts = new Map<number, number>();
    for (const diary of monthlyItems) {
      const { day } = toDateParts(diary.watchedDate);
      if (day) {
        markerCounts.set(day, (markerCounts.get(day) ?? 0) + 1);
      }
    }

    return {
      summary: {
        totalCount: diaries.length,
        monthlyCount: monthlyItems.length,
        averageRating: Number(averageRating.toFixed(2)),
        topGenre: genreRatios[0] ? { name: genreRatios[0].genre, count: genreRatios[0].count } : null,
      },
      calendar: {
        year: baseDate.year,
        month: baseDate.month,
        selectedDay: baseDate.day,
        markers: Array.from(markerCounts.entries())
          .sort((a, b) => a[0] - b[0])
          .map(([day, count]) => ({ day, count })),
      },
      genreRatios,
      recentItems: dashboardItems,
    };
  }
}
