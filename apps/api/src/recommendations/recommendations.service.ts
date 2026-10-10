import { Injectable, NotFoundException } from '@nestjs/common';
import { TmdbClient } from '../media/tmdb.client';

export type GenrePreset = {
  id: string;
  label: string;
  description: string;
  mediaType: 'movie' | 'tv';
  genreIds: number[];
  sortBy: string;
  voteCountGte: number;
};

// The 탐색 tab's four mood cards (EXPLORE_MOODS in the web) load these by id.
const GENRE_PRESETS: GenrePreset[] = [
  {
    id: 'immersive-thriller',
    label: '몰입감 있는 스릴러',
    description: '긴장감 있는 미스터리/스릴러 작품 추천',
    mediaType: 'movie',
    genreIds: [53, 9648],
    sortBy: 'popularity.desc',
    voteCountGte: 100,
  },
  {
    id: 'light-comedy',
    label: '가볍게 웃고 싶어요',
    description: '부담 없이 웃을 수 있는 코미디 추천',
    mediaType: 'movie',
    genreIds: [35],
    sortBy: 'popularity.desc',
    voteCountGte: 100,
  },
  {
    id: 'good-cry',
    label: '실컷 울고 싶어요',
    description: '마음이 먹먹해지는 가족 드라마 추천',
    mediaType: 'movie',
    genreIds: [18, 10751],
    sortBy: 'popularity.desc',
    voteCountGte: 100,
  },
  {
    id: 'chills',
    label: '오싹하게 보고 싶어요',
    description: '서늘한 공포 영화 추천',
    mediaType: 'movie',
    genreIds: [27],
    sortBy: 'popularity.desc',
    voteCountGte: 100,
  },
];

export type RecommendationQuery = {
  page?: number;
  limit?: number;
  language?: string;
  region?: string;
};

@Injectable()
export class RecommendationsService {
  constructor(private readonly tmdbClient: TmdbClient) {}

  async trending(query: RecommendationQuery & { period?: 'daily' | 'weekly' } = {}) {
    const limit = this.limit(query.limit);
    const response = await this.tmdbClient.trending({
      period: query.period === 'weekly' ? 'week' : 'day',
      page: query.page ?? 1,
      language: query.language ?? 'ko-KR',
    });

    return { ...response, items: response.items.slice(0, limit) };
  }

  async genreRecommendations(presetId: string, query: RecommendationQuery = {}) {
    const preset = GENRE_PRESETS.find((item) => item.id === presetId);
    if (!preset) {
      throw new NotFoundException('Recommendation genre preset not found');
    }

    return this.loadGenrePreset(preset, query);
  }

  private async loadGenrePreset(preset: GenrePreset, query: RecommendationQuery = {}) {
    const limit = this.limit(query.limit);
    const response = await this.tmdbClient.discover({
      mediaType: preset.mediaType,
      page: query.page ?? 1,
      language: query.language ?? 'ko-KR',
      region: query.region ?? 'KR',
      withGenres: preset.genreIds,
      sortBy: preset.sortBy,
      voteCountGte: preset.voteCountGte,
      reason: `genre:${preset.id}`,
    });

    return {
      preset: { id: preset.id, label: preset.label, description: preset.description },
      page: response.page,
      totalPages: response.totalPages,
      items: response.items.slice(0, limit),
    };
  }

  private limit(value?: number) {
    const normalized = Number(value ?? 10);
    if (!Number.isFinite(normalized)) {
      return 10;
    }
    return Math.min(Math.max(Math.trunc(normalized), 1), 20);
  }
}
