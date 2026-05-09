import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DiaryEntity } from '../database/entities/diary.entity';
import { resolveTmdbGenreLabel } from '../media/tmdb-genres';

export type CommunityTab = 'recommended' | 'popular' | 'following' | 'latest';

export type CommunityDashboardQuery = {
  tab?: CommunityTab;
  q?: string;
};

export type CommunityTopic = {
  label: string;
  count: number;
};

export type CommunityDiaryCard = {
  id: string;
  author: {
    id: string;
    nickname: string;
    profileImageUrl: string | null;
  };
  media: {
    id: string;
    title: string;
    releaseYear: string | null;
    posterUrl: string | null;
  };
  diaryTitle: string;
  contentPreview: string;
  rating: number;
  commentCount: number;
  createdAt: string;
};

export type CommunityDashboardResponse = {
  tab: CommunityTab;
  topics: CommunityTopic[];
  popularDiaries: CommunityDiaryCard[];
  feed: CommunityDiaryCard[];
};

function normalizeTab(tab: CommunityTab | undefined): CommunityTab {
  return tab === 'popular' || tab === 'following' || tab === 'latest' ? tab : 'recommended';
}

function buildContentPreview(content: string) {
  return content.trim().replace(/\s+/g, ' ').slice(0, 120);
}

function getReleaseYear(releaseDate: string | null | undefined) {
  return releaseDate?.slice(0, 4) || null;
}

function getCommentCount(diary: DiaryEntity) {
  return Array.isArray(diary.comments) ? diary.comments.length : 0;
}

function matchesQuery(diary: DiaryEntity, query: string) {
  const target = [diary.title, diary.content, diary.media?.title, diary.user?.nickname].filter(Boolean).join(' ').toLowerCase();
  return target.includes(query.toLowerCase());
}

function toCommunityDiaryCard(diary: DiaryEntity): CommunityDiaryCard {
  return {
    id: diary.id,
    author: {
      id: diary.user?.id ?? diary.userId,
      nickname: diary.user?.nickname ?? '알 수 없는 사용자',
      profileImageUrl: diary.user?.profileImageUrl ?? null,
    },
    media: {
      id: diary.media?.id ?? diary.mediaId,
      title: diary.media?.title ?? '제목 없음',
      releaseYear: getReleaseYear(diary.media?.releaseDate),
      posterUrl: diary.media?.posterUrl ?? null,
    },
    diaryTitle: diary.title,
    contentPreview: buildContentPreview(diary.content),
    rating: Number(diary.rating),
    commentCount: getCommentCount(diary),
    createdAt: diary.createdAt.toISOString(),
  };
}

function buildTopics(diaries: DiaryEntity[]): CommunityTopic[] {
  const counts = new Map<string, number>();
  for (const diary of diaries) {
    for (const genre of diary.media?.genres ?? []) {
      const label = `#${resolveTmdbGenreLabel(genre)}`;
      counts.set(label, (counts.get(label) ?? 0) + 1);
    }
  }

  return Array.from(counts.entries())
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], 'ko'))
    .map(([label, count]) => ({ label, count }));
}

function sortByPopularity(a: DiaryEntity, b: DiaryEntity) {
  const commentDiff = getCommentCount(b) - getCommentCount(a);
  if (commentDiff !== 0) return commentDiff;
  const ratingDiff = Number(b.rating) - Number(a.rating);
  if (ratingDiff !== 0) return ratingDiff;
  return b.createdAt.getTime() - a.createdAt.getTime();
}

function sortByLatest(a: DiaryEntity, b: DiaryEntity) {
  return b.createdAt.getTime() - a.createdAt.getTime();
}

@Injectable()
export class CommunityService {
  constructor(
    @InjectRepository(DiaryEntity)
    private readonly diaries: Repository<DiaryEntity>,
  ) {}

  async getDashboard(query: CommunityDashboardQuery = {}): Promise<CommunityDashboardResponse> {
    const tab = normalizeTab(query.tab);
    const q = query.q?.trim() ?? '';
    const publicDiaries = await this.diaries.find({
      where: { visibility: 'PUBLIC' },
      relations: { media: true, user: true, comments: true },
      order: { createdAt: 'DESC' },
      take: 100,
    });

    const searchedDiaries = q ? publicDiaries.filter((diary) => matchesQuery(diary, q)) : publicDiaries;
    const popularDiaries = [...searchedDiaries].sort(sortByPopularity).slice(0, 5).map(toCommunityDiaryCard);
    const feedSource = tab === 'following' ? [] : [...searchedDiaries].sort(tab === 'latest' ? sortByLatest : sortByPopularity);

    return {
      tab,
      topics: buildTopics(publicDiaries).slice(0, 8),
      popularDiaries,
      feed: feedSource.map(toCommunityDiaryCard),
    };
  }
}
