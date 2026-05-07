import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { RecommendationsService } from './recommendations.service';

class FakeTmdbClient {
  trendingCalls: Array<{ period: 'day' | 'week'; page: number; language: string }> = [];
  discoverCalls: Array<{
    mediaType: 'movie' | 'tv';
    page: number;
    language: string;
    region: string;
    withGenres: number[];
    sortBy: string;
    voteCountGte: number;
    reason: string;
  }> = [];

  async trending(input: { period: 'day' | 'week'; page: number; language: string }) {
    this.trendingCalls.push(input);
    return {
      page: input.page,
      totalPages: 1,
      items: [
        {
          externalProvider: 'TMDB' as const,
          externalId: '157336',
          mediaType: 'MOVIE' as const,
          title: '인터스텔라',
          originalTitle: 'Interstellar',
          overview: '우주를 향한 여정.',
          posterUrl: 'https://image.tmdb.org/t/p/w500/poster.jpg',
          backdropUrl: 'https://image.tmdb.org/t/p/w780/backdrop.jpg',
          releaseDate: '2014-11-06',
          genreIds: [12, 18, 878],
          country: 'US',
          voteAverage: 8.4,
          voteCount: 36000,
          popularity: 122.5,
          reason: 'trending',
        },
      ],
    };
  }

  async discover(input: {
    mediaType: 'movie' | 'tv';
    page: number;
    language: string;
    region: string;
    withGenres: number[];
    sortBy: string;
    voteCountGte: number;
    reason: string;
  }) {
    this.discoverCalls.push(input);
    return {
      page: input.page,
      totalPages: 1,
      items: [
        {
          externalProvider: 'TMDB' as const,
          externalId: '1399',
          mediaType: 'TV' as const,
          title: '왕좌의 게임',
          originalTitle: 'Game of Thrones',
          overview: '가문들의 전쟁.',
          posterUrl: 'https://image.tmdb.org/t/p/w500/got.jpg',
          backdropUrl: 'https://image.tmdb.org/t/p/w780/got-bg.jpg',
          releaseDate: '2011-04-17',
          genreIds: [18, 10765],
          country: 'US',
          voteAverage: 8.5,
          voteCount: 24000,
          popularity: 90,
          reason: input.reason,
        },
      ],
    };
  }
}

describe('RecommendationsService', () => {
  it('loads daily trending recommendations with Korean defaults and limit slicing', async () => {
    const tmdbClient = new FakeTmdbClient();
    const service = new RecommendationsService(tmdbClient as never);

    const result = await service.trending({ period: 'daily', limit: 1 });

    assert.equal(result.items[0].title, '인터스텔라');
    assert.deepEqual(tmdbClient.trendingCalls[0], { period: 'day', page: 1, language: 'ko-KR' });
  });

  it('returns curated genre preset metadata before loading a preset', () => {
    const service = new RecommendationsService(new FakeTmdbClient() as never);

    const presets = service.genrePresets();

    assert.ok(presets.items.some((preset) => preset.id === 'rainy-day'));
    assert.ok(presets.items.some((preset) => preset.id === 'immersive-thriller'));
  });

  it('loads genre recommendations through a configured TMDB discover preset', async () => {
    const tmdbClient = new FakeTmdbClient();
    const service = new RecommendationsService(tmdbClient as never);

    const result = await service.genreRecommendations('immersive-thriller', { limit: 1 });

    assert.equal(result.preset.id, 'immersive-thriller');
    assert.equal(result.items[0].reason, 'genre:immersive-thriller');
    assert.deepEqual(tmdbClient.discoverCalls[0], {
      mediaType: 'movie',
      page: 1,
      language: 'ko-KR',
      region: 'KR',
      withGenres: [53, 9648],
      sortBy: 'popularity.desc',
      voteCountGte: 100,
      reason: 'genre:immersive-thriller',
    });
  });

  it('uses trending as the default today hero fallback', async () => {
    const tmdbClient = new FakeTmdbClient();
    const service = new RecommendationsService(tmdbClient as never);

    const result = await service.today();

    assert.equal(result.item.title, '인터스텔라');
    assert.equal(result.item.reason, 'today:trending');
  });
});
