import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { MediaEntity } from '../database/entities';
import type { MediaRecommendationItem } from '../media/tmdb.mapper';
import { RecommendationsService } from './recommendations.service';
import type { TasteHistoryResult } from './taste-history';

const NOW = new Date('2026-10-10T03:00:00.000Z');
const MINUTE = 60 * 1000;

function item(
  externalId: string,
  mediaType: 'MOVIE' | 'TV',
  reason = 'trending',
): MediaRecommendationItem {
  return {
    externalProvider: 'TMDB',
    externalId,
    mediaType,
    title: `작품 ${externalId}`,
    originalTitle: `Title ${externalId}`,
    overview: '',
    posterUrl: null,
    backdropUrl: null,
    releaseDate: '2026-05-01',
    genreIds: [18],
    country: 'US',
    voteAverage: 7.5,
    voteCount: 2000,
    popularity: 100,
    reason,
  };
}

const stored = (id: string, externalId: string, mediaType: 'MOVIE' | 'TV') =>
  Object.assign(new MediaEntity(), { id, externalProvider: 'TMDB', externalId, mediaType });

class FakeTmdbClient {
  failingPages = new Set<number>();
  trendingCalls: Array<{ period: 'day' | 'week'; page: number; language: string }> = [];
  discoverCalls: Array<Record<string, unknown> & { page: number; reason: string }> = [];
  pages: Record<number, MediaRecommendationItem[]> = {
    1: [item('1', 'MOVIE'), item('2', 'TV')],
    2: [item('3', 'MOVIE'), item('1', 'TV')],
    3: [item('4', 'TV')],
  };

  async trending(input: { period: 'day' | 'week'; page: number; language: string }) {
    this.trendingCalls.push(input);
    if (this.failingPages.has(input.page)) throw new Error('TMDB down');
    return { page: input.page, totalPages: 3, items: this.pages[input.page] ?? [] };
  }

  async discover(input: Record<string, unknown> & { page: number; reason: string }) {
    this.discoverCalls.push(input);
    return {
      page: input.page,
      totalPages: 3,
      items: input.page === 1 ? [item('1399', 'MOVIE', input.reason)] : [],
    };
  }
}

/** The viewer watched movie 1 and turned down series 4 in a pick. */
class FakeTasteHistory {
  reads: Array<{ ids: string[]; options?: { spaceId?: string } }> = [];

  async read(ids: string[], options?: { spaceId?: string }): Promise<TasteHistoryResult> {
    this.reads.push({ ids, options });
    return {
      signals: new Map(ids.map((id) => [id, []])),
      shared: [],
      watched: new Set(['watched-movie']),
      rejected: new Set(['rejected-series']),
      titles: new Map([
        ['watched-movie', stored('watched-movie', '1', 'MOVIE')],
        ['rejected-series', stored('rejected-series', '4', 'TV')],
      ]),
    };
  }
}

/** Two films play this week: movie 1 (watched) and movie 7, at three theaters. */
class FakeShowtimes {
  async nowShowing() {
    const tmdb = (externalId: string) => {
      const { reason, ...summary } = item(externalId, 'MOVIE', 'now-showing');
      void reason;
      // A film TMDB dates later than today still shows when a theater plays it.
      return { ...summary, releaseDate: '2026-12-01' };
    };
    return {
      updatedAt: '2026-10-10T03:25:00.000Z',
      films: [
        { tmdb: tmdb('1'), theaterCodes: ['A'], firstDate: '2026-10-10' },
        { tmdb: tmdb('7'), theaterCodes: ['A', 'B', 'C'], firstDate: '2026-10-11' },
      ],
    };
  }

  async theaterVisits() {
    return new Map([['B', 4]]);
  }
}

function setup() {
  const tmdb = new FakeTmdbClient();
  const history = new FakeTasteHistory();
  const service = new RecommendationsService(
    tmdb as never,
    history as never,
    new FakeShowtimes() as never,
  );
  let now = NOW;
  service.now = () => now;
  return { tmdb, history, service, later: (ms: number) => (now = new Date(now.getTime() + ms)) };
}

const keys = (items: MediaRecommendationItem[]) =>
  items.map((entry) => `${entry.mediaType}:${entry.externalId}`).sort();

describe('RecommendationsService', () => {
  it('reads three trending pages and leaves out what the viewer watched or turned down', async () => {
    const { tmdb, history, service } = setup();

    const result = await service.trending('u1', 20);

    assert.deepEqual(keys(result.items), ['MOVIE:3', 'TV:1', 'TV:2']);
    assert.deepEqual(
      tmdb.trendingCalls.map((call) => [call.period, call.page, call.language]),
      [
        ['day', 1, 'ko-KR'],
        ['day', 2, 'ko-KR'],
        ['day', 3, 'ko-KR'],
      ],
    );
    // The viewer's own history, with their wishes from every space.
    assert.deepEqual(history.reads, [{ ids: ['u1'], options: undefined }]);
  });

  it('keeps a list for half an hour for everyone, then reads it again', async () => {
    const { tmdb, service, later } = setup();
    await service.trending('u1');
    await service.trending('u2');
    assert.equal(tmdb.trendingCalls.length, 3);
    later(31 * MINUTE);
    await service.trending('u1');
    assert.equal(tmdb.trendingCalls.length, 6);
  });

  it('uses the pages it could read without keeping that list, and fails when none could be read', async () => {
    const { tmdb, service } = setup();
    tmdb.failingPages = new Set([2]);
    assert.deepEqual(keys((await service.trending('u1')).items), ['TV:2']);
    await service.trending('u1');
    assert.equal(tmdb.trendingCalls.length, 6, 'a list missing a page is read again');

    const failing = setup();
    failing.tmdb.failingPages = new Set([1, 2, 3]);
    await assert.rejects(failing.service.trending('u1'), /TMDB down/);
  });

  it('lists films playing this week that the viewer has not seen, with where they play', async () => {
    const { service } = setup();

    const result = await service.nowShowing('u1', 20);

    assert.equal(result.updatedAt, '2026-10-10T03:25:00.000Z');
    assert.deepEqual(
      result.items.map((entry) => [entry.externalId, entry.showing]),
      [['7', { theaters: 3, myTheaters: 1, firstDate: '2026-10-11' }]],
    );
  });

  it('has a preset for each of the 탐색 tab mood cards and rejects unknown ones', async () => {
    const { service } = setup();
    for (const id of ['light-comedy', 'immersive-thriller', 'good-cry', 'chills']) {
      const result = await service.genreRecommendations('u1', id, 1);
      assert.equal(result.preset.id, id);
    }
    await assert.rejects(service.genreRecommendations('u1', 'rainy-day'), /preset not found/);
  });

  it('loads a mood card through its TMDB discover preset', async () => {
    const { tmdb, service } = setup();

    const result = await service.genreRecommendations('u1', 'immersive-thriller', 1);

    assert.equal(result.items[0].reason, 'genre:immersive-thriller');
    assert.deepEqual(
      tmdb.discoverCalls.map((call) => call.page),
      [1, 2, 3],
    );
    assert.deepEqual(tmdb.discoverCalls[0], {
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
});
