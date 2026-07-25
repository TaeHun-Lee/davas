import { Injectable, NotFoundException, Optional } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DiaryEntity } from '../database/entities/diary.entity';
import { UserEntity } from '../database/entities/user.entity';
import { resolveTmdbGenreLabel } from '../media/tmdb-genres';
import { DiaryAccessService } from '../diaries/diary-access.service';

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

export type CommunityAuthorProfileResponse = {
  author: {
    id: string;
    nickname: string;
    profileImageUrl: string | null;
    bio: string | null;
    isMine: boolean;
  };
  stats: {
    publicDiaryCount: number;
  };
  feed: CommunityDiaryCard[];
};

type ViewerContext = {
  userId?: string;
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

function toCommunityDiaryCard(diary: DiaryEntity, viewer: ViewerContext = {}): CommunityDiaryCard {
  const authorId = diary.userId ?? diary.user?.id;
  return {
    id: diary.id,
    author: {
      id: authorId,
      nickname: diary.user?.nickname ?? '알 수 없는 사용자',
      profileImageUrl: diary.user?.profileImageUrl ?? null,
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

function toCommunityDiaryDetail(diary: DiaryEntity, viewer: ViewerContext = {}): CommunityDiaryDetail {
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

function sortByLatest(a: DiaryEntity, b: DiaryEntity) {
  return b.createdAt.getTime() - a.createdAt.getTime();
}

@Injectable()
export class CommunityService {
  constructor(
    @InjectRepository(DiaryEntity)
    private readonly diaries: Repository<DiaryEntity>,
    @Optional()
    @InjectRepository(UserEntity)
    private readonly users: Repository<UserEntity> | undefined,
    private readonly access: DiaryAccessService,
  ) {}

  async getDashboard(query: CommunityDashboardQuery = {}): Promise<CommunityDashboardResponse> {
    const tab = normalizeTab(query.tab);
    const q = query.q?.trim() ?? '';
    const topic = normalizeTopic(query.topic);
    const candidateDiaries = await this.diaries.find({
      where: [{ visibility: 'FRIENDS' }, { visibility: 'SELECTED' }],
      relations: { media: true, user: true, comments: true },
      order: { createdAt: 'DESC' },
      take: 100,
    });

    const publicDiaries: DiaryEntity[] = [];
    for (const diary of candidateDiaries) {
      if (!query.userId) continue;
      if (await this.access.canView(diary, query.userId)) publicDiaries.push(diary);
    }
    const topicDiaries = topic ? publicDiaries.filter((diary) => matchesTopic(diary, topic)) : publicDiaries;
    const searchedDiaries = q ? topicDiaries.filter((diary) => matchesQuery(diary, q)) : topicDiaries;
    const feedCandidates = searchedDiaries;
    const feedSource = [...feedCandidates].sort(sortByLatest);

    return {
      tab,
      topics: [],
      popularDiaries: [],
      feed: feedSource.map((diary) => toCommunityDiaryCard(diary, { userId: query.userId })),
      ...(topic ? { topic } : {}),
    };
  }

  async getPublicDiary(id: string, userId?: string): Promise<CommunityDiaryDetail> {
    const diary = await this.getAccessibleDiaryEntity(id, userId);
    return toCommunityDiaryDetail(diary, { userId });
  }

  async getAuthorProfile(authorId: string, userId?: string): Promise<CommunityAuthorProfileResponse> {
    const [author, feed] = await Promise.all([
      this.users?.findOne({ where: { id: authorId } }),
      this.diaries.find({
        where: [{ userId: authorId, visibility: 'FRIENDS' }, { userId: authorId, visibility: 'SELECTED' }],
        relations: { media: true, user: true, comments: true },
        order: { createdAt: 'DESC' },
        take: 100,
      }),
    ]);
    const accessibleFeed: DiaryEntity[] = [];
    for (const diary of feed) if (userId && await this.access.canView(diary, userId)) accessibleFeed.push(diary);
    const profileAuthor = author ?? accessibleFeed[0]?.user;
    if (!profileAuthor) {
      throw new NotFoundException('작성자를 찾을 수 없습니다.');
    }
    return {
      author: {
        id: profileAuthor.id,
        nickname: profileAuthor.nickname,
        profileImageUrl: profileAuthor.profileImageUrl ?? null,
        bio: profileAuthor.bio ?? null,
        isMine: userId === authorId,
      },
      stats: {
        publicDiaryCount: accessibleFeed.length,
      },
      feed: accessibleFeed.map((diary) => toCommunityDiaryCard(diary, { userId })),
    };
  }

  private async getPublicDiaryEntity(id: string) {
    const diary = await this.diaries.findOne({
      where: { id },
      relations: { media: true, user: true, comments: true },
    });
    if (!diary) {
      throw new NotFoundException('기록을 찾을 수 없습니다.');
    }
    return diary;
  }

  private async getAccessibleDiaryEntity(id: string, userId?: string) {
    const diary = await this.getPublicDiaryEntity(id);
    if (!userId) throw new NotFoundException('기록을 찾을 수 없습니다.');
    await this.access.assertCanView(diary, userId);
    return diary;
  }

}
