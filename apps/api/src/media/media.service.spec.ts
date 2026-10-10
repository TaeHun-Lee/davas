import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { MediaService } from './media.service';

class FakeTmdbClient {
  calls: Array<{ query: string; type: 'movie' | 'tv' | 'multi'; page: number }> = [];
  detailCalls: Array<{ externalId: string; mediaType: 'MOVIE' | 'TV'; language?: string }> = [];

  async detail(input: { externalId: string; mediaType: 'MOVIE' | 'TV'; language?: string }) {
    this.detailCalls.push(input);
    return {
      externalProvider: 'TMDB' as const,
      externalId: input.externalId,
      mediaType: input.mediaType,
      title: '센티멘탈 밸류',
      originalTitle: 'Affeksjonsverdi',
      overview: '상세 시놉시스',
      tagline: '함께하는 마지막 영화가 될지도 몰라',
      posterUrl: 'https://image.tmdb.org/t/p/w500/poster.jpg',
      backdropUrl: 'https://image.tmdb.org/t/p/w780/backdrop.jpg',
      releaseDate: '2025-08-20',
      runtime: 133,
      genres: ['드라마'],
      country: 'Norway',
      countries: ['Norway'],
      tmdbRating: 7.494,
      tmdbVoteCount: 861,
      director: 'Joachim Trier',
      cast: ['Renate Reinsve'],
      stillCuts: ['https://image.tmdb.org/t/p/w780/still.jpg'],
      certification: '15',
    };
  }

  async search(input: { query: string; type: 'movie' | 'tv' | 'multi'; page: number }) {
    this.calls.push(input);
    return {
      query: input.query,
      page: input.page,
      totalPages: 1,
      items: [
        {
          externalProvider: 'TMDB' as const,
          externalId: input.query === '인터스텔라' ? '157336' : '550',
          mediaType: 'MOVIE' as const,
          title: input.query,
          originalTitle: input.query,
          overview: 'overview',
          posterUrl: null,
          backdropUrl: null,
          releaseDate: '2014-11-06',
          genreIds: [],
          country: 'US',
        },
      ],
    };
  }
}

function fakeRepository(media: Record<string, unknown> | null) {
  return {
    async findOne() {
      return media;
    },
  };
}

function fakeDiaryRepository(diary: Record<string, unknown> | null) {
  return {
    async findOne() {
      return diary;
    },
    async find() {
      return diary ? [diary] : [];
    },
  };
}

function fakeDiariesRepository(diaries: Array<Record<string, unknown>>) {
  const calls: unknown[] = [];
  return {
    calls,
    async find(input?: unknown) {
      calls.push(input);
      return diaries;
    },
  };
}

describe('MediaService detail', () => {
  it('hydrates a selected TMDB media row with detail-only fields from TMDB', async () => {
    const tmdbClient = new FakeTmdbClient();
    const service = new MediaService(
      tmdbClient as never,
      fakeRepository({
        id: 'media-id',
        externalProvider: 'TMDB',
        externalId: '1124566',
        mediaType: 'MOVIE',
        title: '센티멘탈 밸류',
        originalTitle: 'Affeksjonsverdi',
        overview: '검색 시놉시스',
        posterUrl: null,
        backdropUrl: null,
        releaseDate: '2026-02-18',
        genres: ['18'],
        country: null,
        runtime: null,
      }) as never,
    );

    const detail = await service.findDetail('media-id');

    assert.equal(detail.id, 'media-id');
    assert.equal(detail.runtime, 133);
    assert.equal(detail.director, 'Joachim Trier');
    assert.deepEqual(detail.cast, ['Renate Reinsve']);
    assert.deepEqual(detail.stillCuts, ['https://image.tmdb.org/t/p/w780/still.jpg']);
    assert.equal(detail.certification, '15');
    assert.equal(detail.tmdbRating, 7.494);
    assert.deepEqual(tmdbClient.detailCalls, [
      { externalId: '1124566', mediaType: 'MOVIE', language: 'ko-KR' },
    ]);
  });

  it('includes the authenticated user diary for the selected media detail', async () => {
    const tmdbClient = new FakeTmdbClient();
    const service = new MediaService(
      tmdbClient as never,
      fakeRepository({
        id: 'media-id',
        externalProvider: 'TMDB',
        externalId: '1124566',
        mediaType: 'MOVIE',
        title: '센티멘탈 밸류',
        originalTitle: 'Affeksjonsverdi',
        overview: '검색 시놉시스',
        posterUrl: null,
        backdropUrl: null,
        releaseDate: '2026-02-18',
        genres: ['18'],
        country: null,
        runtime: null,
      }) as never,
      fakeDiaryRepository({
        id: 'diary-id',
        mediaId: 'media-id',
        title: '극장에서 남긴 기록',
        content: '배우들의 감정선이 오래 남았다.',
        watchedDate: '2026-05-09',
        rating: '4.5',
        updatedAt: new Date('2026-05-09T10:00:00.000Z'),
      }) as never,
    );

    const detail = await service.findDetail('media-id', 'user-id');

    assert.deepEqual(detail.myDiary, {
      id: 'diary-id',
      rating: 4.5,
      title: '극장에서 남긴 기록',
      contentPreview: '배우들의 감정선이 오래 남았다.',
      watchedDate: '2026.05.09',
      updatedAt: '2026-05-09T10:00:00.000Z',
    });
  });

  it('includes all authenticated user diaries and their average rating for the selected media detail', async () => {
    const tmdbClient = new FakeTmdbClient();
    const diaries = fakeDiariesRepository([
      {
        id: 'unrated-diary-id',
        mediaId: 'media-id',
        title: '별점 없이 남긴 기록',
        content: '기록만 남겼어요.',
        watchedDate: '2026-05-11',
        rating: null,
        updatedAt: new Date('2026-05-11T10:00:00.000Z'),
      },
      {
        id: 'newer-diary-id',
        mediaId: 'media-id',
        title: '두 번째 기록',
        content: '다시 보니 장면의 결이 달랐다.',
        watchedDate: '2026-05-10',
        rating: '3.5',
        updatedAt: new Date('2026-05-10T10:00:00.000Z'),
      },
      {
        id: 'older-diary-id',
        mediaId: 'media-id',
        title: '첫 번째 기록',
        content: '처음 본 감상이 오래 남았다.',
        watchedDate: '2026-05-09',
        rating: '4.5',
        updatedAt: new Date('2026-05-09T10:00:00.000Z'),
      },
    ]);
    const service = new MediaService(
      tmdbClient as never,
      fakeRepository({
        id: 'media-id',
        externalProvider: 'TMDB',
        externalId: '1124566',
        mediaType: 'MOVIE',
        title: '센티멘탈 밸류',
        originalTitle: 'Affeksjonsverdi',
        overview: '검색 시놉시스',
        posterUrl: null,
        backdropUrl: null,
        releaseDate: '2026-02-18',
        genres: ['18'],
        country: null,
        runtime: null,
      }) as never,
      diaries as never,
    );

    const detail = await service.findDetail('media-id', 'user-id');

    assert.deepEqual(diaries.calls[0], {
      where: { userId: 'user-id', mediaId: 'media-id' },
      order: { updatedAt: 'DESC', createdAt: 'DESC' },
    });
    assert.equal(detail.myAverageRating, 4);
    assert.deepEqual(detail.myDiaries, [
      {
        id: 'unrated-diary-id',
        rating: null,
        title: '별점 없이 남긴 기록',
        contentPreview: '기록만 남겼어요.',
        watchedDate: '2026.05.11',
        updatedAt: '2026-05-11T10:00:00.000Z',
      },
      {
        id: 'newer-diary-id',
        rating: 3.5,
        title: '두 번째 기록',
        contentPreview: '다시 보니 장면의 결이 달랐다.',
        watchedDate: '2026.05.10',
        updatedAt: '2026-05-10T10:00:00.000Z',
      },
      {
        id: 'older-diary-id',
        rating: 4.5,
        title: '첫 번째 기록',
        contentPreview: '처음 본 감상이 오래 남았다.',
        watchedDate: '2026.05.09',
        updatedAt: '2026-05-09T10:00:00.000Z',
      },
    ]);
  });

  it('includes the authenticated watchlist state without exposing legacy favorite state', async () => {
    const tmdbClient = new FakeTmdbClient();
    const watchlist = { findOne: async () => ({ id: 'watchlist-id', status: 'ACTIVE' }) };
    const service = new MediaService(
      tmdbClient as never,
      fakeRepository({
        id: 'media-id',
        externalProvider: 'TMDB',
        externalId: '1124566',
        mediaType: 'MOVIE',
        title: '센티멘탈 밸류',
        originalTitle: 'Affeksjonsverdi',
        overview: '검색 시놉시스',
        posterUrl: null,
        backdropUrl: null,
        releaseDate: '2026-02-18',
        genres: ['18'],
        country: null,
        runtime: null,
      }) as never,
      fakeDiaryRepository(null) as never,
      watchlist as never,
    );

    const detail = await service.findDetail('media-id', 'user-id');

    assert.equal(detail.watchlistItemId, 'watchlist-id');
    assert.equal(detail.watchlistStatus, 'ACTIVE');
    assert.equal('isFavorite' in detail, false);
  });
});

describe('MediaService search', () => {
  it('passes Korean and English queries through to the TMDB client without ASCII-only normalization', async () => {
    const tmdbClient = new FakeTmdbClient();
    const service = new MediaService(tmdbClient as never);

    const korean = await service.search({ query: '인터스텔라', type: 'multi', page: 1 });
    const english = await service.search({ query: 'Interstellar', type: 'multi', page: 1 });

    assert.equal(korean.items[0].title, '인터스텔라');
    assert.equal(english.items[0].title, 'Interstellar');
    assert.deepEqual(
      tmdbClient.calls.map((call) => call.query),
      ['인터스텔라', 'Interstellar'],
    );
  });

  it('trims query and applies default type/page values', async () => {
    const tmdbClient = new FakeTmdbClient();
    const service = new MediaService(tmdbClient as never);

    await service.search({ query: '  Arrival  ' });

    assert.deepEqual(tmdbClient.calls[0], {
      query: 'Arrival',
      type: 'multi',
      page: 1,
      language: 'ko-KR',
      region: 'KR',
    });
  });
});
