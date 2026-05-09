import { BadRequestException, Injectable, NotFoundException, Optional } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DiaryEntity } from '../database/entities/diary.entity';
import { UserFollowEntity } from '../database/entities/user-follow.entity';
import { resolveTmdbGenreLabel } from '../media/tmdb-genres';

export type CommunityTab = 'recommended' | 'popular' | 'following' | 'latest';

export type CommunityDashboardQuery = {
  tab?: CommunityTab;
  q?: string;
  topic?: string;
  userId?: string;
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
    isFollowed: boolean;
    isMine: boolean;
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
  hasSpoiler: boolean;
  createdAt: string;
};

export type CommunityDiaryDetail = CommunityDiaryCard & {
  content: string;
  watchedDate: string;
  hasSpoiler: boolean;
  media: CommunityDiaryCard['media'] & {
    genreNames: string[];
  };
};

export type CommunityDashboardResponse = {
  tab: CommunityTab;
  topics: CommunityTopic[];
  popularDiaries: CommunityDiaryCard[];
  feed: CommunityDiaryCard[];
  topic?: string;
};

export type CommunityFollowResponse = {
  followingId: string;
  isFollowed: boolean;
};

type ViewerContext = {
  userId?: string;
  followingIds: Set<string>;
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

function normalizeTopic(topic: string | undefined) {
  return topic?.trim().replace(/^#/, '') ?? '';
}

function matchesTopic(diary: DiaryEntity, topic: string) {
  if (!topic) return true;
  return (diary.media?.genres ?? []).some((genre) => resolveTmdbGenreLabel(genre) === topic);
}

function toCommunityDiaryCard(diary: DiaryEntity, viewer: ViewerContext = { followingIds: new Set() }): CommunityDiaryCard {
  const authorId = diary.userId ?? diary.user?.id;
  return {
    id: diary.id,
    author: {
      id: authorId,
      nickname: diary.user?.nickname ?? '알 수 없는 사용자',
      profileImageUrl: diary.user?.profileImageUrl ?? null,
      isFollowed: viewer.followingIds.has(authorId),
      isMine: viewer.userId === authorId,
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
    hasSpoiler: diary.hasSpoiler,
    createdAt: diary.createdAt.toISOString(),
  };
}

function toCommunityDiaryDetail(diary: DiaryEntity, viewer: ViewerContext = { followingIds: new Set() }): CommunityDiaryDetail {
  const card = toCommunityDiaryCard(diary, viewer);
  return {
    ...card,
    content: diary.content,
    watchedDate: diary.watchedDate,
    hasSpoiler: diary.hasSpoiler,
    media: {
      ...card.media,
      genreNames: (diary.media?.genres ?? []).map(resolveTmdbGenreLabel),
    },
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
    @Optional()
    @InjectRepository(UserFollowEntity)
    private readonly follows?: Repository<UserFollowEntity>,
  ) {}

  async getDashboard(query: CommunityDashboardQuery = {}): Promise<CommunityDashboardResponse> {
    const tab = normalizeTab(query.tab);
    const q = query.q?.trim() ?? '';
    const topic = normalizeTopic(query.topic);
    const viewer = await this.buildViewerContext(query.userId);
    const publicDiaries = await this.diaries.find({
      where: { visibility: 'PUBLIC' },
      relations: { media: true, user: true, comments: true },
      order: { createdAt: 'DESC' },
      take: 100,
    });

    const topicDiaries = topic ? publicDiaries.filter((diary) => matchesTopic(diary, topic)) : publicDiaries;
    const searchedDiaries = q ? topicDiaries.filter((diary) => matchesQuery(diary, q)) : topicDiaries;
    const popularDiaries = [...searchedDiaries].sort(sortByPopularity).slice(0, 5).map((diary) => toCommunityDiaryCard(diary, viewer));
    const feedCandidates = tab === 'following' ? searchedDiaries.filter((diary) => viewer.followingIds.has(diary.userId ?? diary.user?.id)) : searchedDiaries;
    const feedSource = [...feedCandidates].sort(tab === 'latest' ? sortByLatest : sortByPopularity);

    return {
      tab,
      topics: buildTopics(publicDiaries).slice(0, 8),
      popularDiaries,
      feed: feedSource.map((diary) => toCommunityDiaryCard(diary, viewer)),
      ...(topic ? { topic } : {}),
    };
  }

  async getPublicDiary(id: string, userId?: string): Promise<CommunityDiaryDetail> {
    const diary = await this.getPublicDiaryEntity(id);
    const viewer = await this.buildViewerContext(userId);
    return toCommunityDiaryDetail(diary, viewer);
  }

  async followDiaryAuthor(diaryId: string, userId: string): Promise<CommunityFollowResponse> {
    const diary = await this.getPublicDiaryEntity(diaryId);
    const followingId = diary.userId ?? diary.user?.id;
    if (followingId === userId) {
      throw new BadRequestException('자기 자신은 팔로우할 수 없습니다.');
    }

    const existing = await this.follows?.findOne({ where: { followerId: userId, followingId } });
    if (!existing) {
      await this.follows?.save(this.follows.create({ followerId: userId, followingId }));
    }
    return { followingId, isFollowed: true };
  }

  async unfollowDiaryAuthor(diaryId: string, userId: string): Promise<CommunityFollowResponse> {
    const diary = await this.getPublicDiaryEntity(diaryId);
    const followingId = diary.userId ?? diary.user?.id;
    if (followingId === userId) {
      throw new BadRequestException('자기 자신은 팔로우할 수 없습니다.');
    }

    await this.follows?.delete({ followerId: userId, followingId });
    return { followingId, isFollowed: false };
  }

  private async getPublicDiaryEntity(id: string) {
    const diary = await this.diaries.findOne({
      where: { id, visibility: 'PUBLIC' },
      relations: { media: true, user: true, comments: true },
    });
    if (!diary) {
      throw new NotFoundException('공개 다이어리를 찾을 수 없습니다.');
    }
    return diary;
  }

  private async buildViewerContext(userId?: string): Promise<ViewerContext> {
    if (!userId || !this.follows) {
      return { userId, followingIds: new Set() };
    }
    const followRows = await this.follows.find({ where: { followerId: userId } });
    return { userId, followingIds: new Set(followRows.map((follow) => follow.followingId)) };
  }
}
