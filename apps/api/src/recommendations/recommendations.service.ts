import { Injectable, NotFoundException } from '@nestjs/common';
import { MediaRecommendationItem } from '../media/tmdb.mapper';
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

const GENRE_PRESETS: GenrePreset[] = [
  {
    id: 'rainy-day',
    label: '비 오는 날 보기 좋은 드라마',
    description: '잔잔한 감정선과 몰입감 있는 드라마 중심 추천',
    mediaType: 'movie',
    genreIds: [18, 10749],
    sortBy: 'popularity.desc',
    voteCountGte: 100,
  },
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
    id: 'sci-fi-worlds',
    label: '상상력을 자극하는 SF',
    description: '세계관이 돋보이는 SF 영화와 시리즈 추천',
    mediaType: 'movie',
    genreIds: [878, 12],
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

export type RandomGenreRecommendationQuery = RecommendationQuery & {
  seed?: string;
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

  genrePresets() {
    return {
      items: GENRE_PRESETS.map(({ id, label, description }) => ({ id, label, description })),
    };
  }

  async genreRecommendations(presetId: string, query: RecommendationQuery = {}) {
    const preset = GENRE_PRESETS.find((item) => item.id === presetId);
    if (!preset) {
      throw new NotFoundException('Recommendation genre preset not found');
    }

    return this.loadGenrePreset(preset, query);
  }

  async randomGenreRecommendations(query: RandomGenreRecommendationQuery = {}) {
    const preset = this.pickGenrePreset(query.seed);
    return this.loadGenrePreset(preset, query);
  }

  async today(query: RecommendationQuery = {}): Promise<{ item: MediaRecommendationItem }> {
    const trending = await this.trending({ ...query, limit: 1 });
    const item = trending.items[0];
    if (!item) {
      throw new NotFoundException('Today recommendation not found');
    }

    return { item: { ...item, reason: 'today:trending' } };
  }

  async todayCarousel(query: RecommendationQuery = {}): Promise<{ items: MediaRecommendationItem[] }> {
    const trending = await this.trending({ ...query, limit: query.limit ?? 3 });
    const items = trending.items.map((item) => ({ ...item, reason: 'today:carousel' }));
    if (items.length === 0) {
      throw new NotFoundException('Today recommendation not found');
    }

    return { items };
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

  private pickGenrePreset(seed?: string) {
    const seededPreset = seed ? GENRE_PRESETS.find((preset) => preset.id === seed) : undefined;
    if (seededPreset) {
      return seededPreset;
    }

    const seedValue = seed
      ? Array.from(seed).reduce((total, character) => total + character.charCodeAt(0), 0)
      : Math.floor(Math.random() * GENRE_PRESETS.length);
    return GENRE_PRESETS[seedValue % GENRE_PRESETS.length];
  }

  private limit(value?: number) {
    const normalized = Number(value ?? 10);
    if (!Number.isFinite(normalized)) {
      return 10;
    }
    return Math.min(Math.max(Math.trunc(normalized), 1), 20);
  }
}
