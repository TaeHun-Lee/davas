import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DiaryEntity } from '../database/entities/diary.entity';
import { MediaEntity } from '../database/entities/media.entity';
import { CreateDiaryDto } from './dto/create-diary.dto';

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
      counts.set(genre, (counts.get(genre) ?? 0) + 1);
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
  ) {}

  async createDiary(userId: string, dto: CreateDiaryDto) {
    await this.saveRepresentativePoster(dto);

    const diary = this.diaries.create({
      userId,
      mediaId: dto.mediaId,
      title: dto.title,
      content: dto.content ?? '',
      watchedDate: dto.watchedDate,
      rating: dto.rating.toFixed(1),
      visibility: dto.visibility,
      hasSpoiler: dto.hasSpoiler,
    });

    return this.diaries.save(diary);
  }

  private async saveRepresentativePoster(dto: CreateDiaryDto) {
    if (!dto.mediaPosterUrl || !this.mediaRepository) {
      return;
    }

    const media = await this.mediaRepository.findOne({ where: { id: dto.mediaId } });
    if (!media || media.posterUrl === dto.mediaPosterUrl) {
      return;
    }

    media.posterUrl = dto.mediaPosterUrl;
    await this.mediaRepository.save(media);
  }

  async getDashboard(userId: string) {
    const diaries = await this.diaries.find({
      where: { userId },
      relations: { media: true },
      order: { createdAt: 'DESC', watchedDate: 'DESC' },
      take: 50,
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
      genreNames: diary.media?.genres ?? [],
    }));

    const now = new Date();
    const baseDate = diaries[0]?.watchedDate ? toDateParts(diaries[0].watchedDate) : { year: now.getFullYear(), month: now.getMonth() + 1, day: undefined };
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
