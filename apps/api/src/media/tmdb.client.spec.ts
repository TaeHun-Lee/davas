import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { TmdbClient } from './tmdb.client';

const jsonResponse = (body: unknown) => new Response(JSON.stringify(body), { status: 200 });

describe('TmdbClient search', () => {
  it('searches people through TMDB person search and normalizes known works', async () => {
    let requestedUrl = '';
    const client = new TmdbClient(undefined, {
      apiKey: 'test-key',
      fetcher: async (url) => {
        requestedUrl = String(url);
        return jsonResponse({
          page: 1,
          total_pages: 1,
          results: [
            {
              id: 20738,
              name: '송강호',
              profile_path: '/song.jpg',
              known_for_department: 'Acting',
              known_for: [
                {
                  id: 496243,
                  media_type: 'movie',
                  title: '기생충',
                  original_title: 'Parasite',
                  overview: '전원백수 가족의 이야기.',
                  poster_path: '/parasite.jpg',
                  backdrop_path: '/parasite-bg.jpg',
                  release_date: '2019-05-30',
                  genre_ids: [35, 53, 18],
                },
              ],
            },
          ],
        });
      },
    });

    const result = await client.searchPeople({ query: '송강호', page: 1, language: 'ko-KR' });

    const url = new URL(requestedUrl);
    assert.equal(url.pathname, '/3/search/person');
    assert.equal(url.searchParams.get('query'), '송강호');
    assert.equal(url.searchParams.get('language'), 'ko-KR');
    assert.equal(url.searchParams.get('include_adult'), 'false');
    assert.equal(url.searchParams.get('api_key'), 'test-key');
    assert.equal(result.items[0].id, '20738');
    assert.equal(result.items[0].name, '송강호');
    assert.equal(result.items[0].profileUrl, 'https://image.tmdb.org/t/p/w500/song.jpg');
    assert.equal(result.items[0].knownForDepartment, 'Acting');
    assert.equal(result.items[0].knownFor[0].title, '기생충');
  });

  it('loads person combined credits and filters them to selectable movie and tv works', async () => {
    let requestedUrl = '';
    const client = new TmdbClient(undefined, {
      apiKey: 'test-key',
      fetcher: async (url) => {
        requestedUrl = String(url);
        return jsonResponse({
          cast: [
            {
              id: 496243,
              media_type: 'movie',
              title: '기생충',
              original_title: 'Parasite',
              overview: '전원백수 가족의 이야기.',
              poster_path: '/parasite.jpg',
              backdrop_path: '/parasite-bg.jpg',
              release_date: '2019-05-30',
              genre_ids: [35, 53, 18],
            },
            {
              id: 123,
              media_type: 'person',
              name: '지원하지 않는 사람 결과',
            },
            {
              id: 70523,
              media_type: 'tv',
              name: '나의 아저씨',
              original_name: 'My Mister',
              overview: '삶의 무게를 버티는 사람들.',
              poster_path: '/mymister.jpg',
              first_air_date: '2018-03-21',
              genre_ids: [18],
              origin_country: ['KR'],
            },
          ],
          crew: [],
        });
      },
    });

    const result = await client.personCredits({ personId: '20738', language: 'ko-KR' });

    const url = new URL(requestedUrl);
    assert.equal(url.pathname, '/3/person/20738/combined_credits');
    assert.equal(url.searchParams.get('language'), 'ko-KR');
    assert.deepEqual(result.items.map((item) => item.mediaType), ['MOVIE', 'TV']);
    assert.equal(result.items[0].externalId, '496243');
    assert.equal(result.items[1].title, '나의 아저씨');
  });

  it('requests movie detail with credits, images, and release dates appended', async () => {
    const requestedUrls: string[] = [];
    const client = new TmdbClient(undefined, {
      apiKey: 'test-key',
      fetcher: async (url) => {
        requestedUrls.push(String(url));
        return new Response(JSON.stringify({
          id: 1124566,
          title: '센티멘탈 밸류',
          runtime: 133,
          genres: [{ id: 18, name: '드라마' }],
          credits: { cast: [], crew: [{ name: 'Joachim Trier', job: 'Director' }] },
          images: { backdrops: [{ file_path: '/still.jpg' }] },
          release_dates: { results: [{ iso_3166_1: 'KR', release_dates: [{ certification: '15' }] }] },
        }), { status: 200 });
      },
    });

    const detail = await client.detail({ externalId: '1124566', mediaType: 'MOVIE', language: 'ko-KR' });

    const url = new URL(requestedUrls[0]);
    assert.equal(url.pathname, '/3/movie/1124566');
    assert.equal(url.searchParams.get('append_to_response'), 'credits,images,release_dates');
    assert.equal(detail.runtime, 133);
    assert.equal(detail.director, 'Joachim Trier');
    assert.deepEqual(detail.stillCuts, ['https://image.tmdb.org/t/p/w780/still.jpg']);
    assert.equal(detail.certification, '15');
  });

  it('supports Korean search by URL-encoding the query and requesting Korean localized results', async () => {
    const requestedUrls: string[] = [];
    const client = new TmdbClient(undefined, {
      apiKey: 'test-key',
      fetcher: async (url) => {
        requestedUrls.push(String(url));
        return new Response(JSON.stringify({ page: 1, total_pages: 1, results: [] }), { status: 200 });
      },
    });

    await client.search({ query: '인터스텔라', type: 'multi', page: 1 });

    assert.equal(requestedUrls.length, 1);
    const url = new URL(requestedUrls[0]);
    assert.equal(url.pathname, '/3/search/multi');
    assert.equal(url.searchParams.get('query'), '인터스텔라');
    assert.equal(url.searchParams.get('language'), 'ko-KR');
    assert.equal(url.searchParams.get('region'), 'KR');
    assert.equal(url.searchParams.get('api_key'), 'test-key');
  });

  it('supports English search with the same API path and normalized Davas media result shape', async () => {
    const client = new TmdbClient(undefined, {
      apiKey: 'test-key',
      fetcher: async () => new Response(JSON.stringify({
        page: 1,
        total_pages: 1,
        results: [{
          id: 157336,
          media_type: 'movie',
          title: 'Interstellar',
          original_title: 'Interstellar',
          overview: 'A team travels through a wormhole.',
          poster_path: '/poster.jpg',
          backdrop_path: '/backdrop.jpg',
          release_date: '2014-11-06',
          genre_ids: [12, 18, 878],
          origin_country: ['US'],
        }],
      }), { status: 200 }),
    });

    const result = await client.search({ query: 'Interstellar', type: 'multi', page: 1 });

    assert.equal(result.query, 'Interstellar');
    assert.equal(result.items[0].title, 'Interstellar');
    assert.equal(result.items[0].mediaType, 'MOVIE');
    assert.equal(result.items[0].posterUrl, 'https://image.tmdb.org/t/p/w500/poster.jpg');
  });

  it('maps movie and tv filters to dedicated TMDB search endpoints', async () => {
    const requestedPaths: string[] = [];
    const client = new TmdbClient(undefined, {
      apiKey: 'test-key',
      fetcher: async (url) => {
        requestedPaths.push(new URL(String(url)).pathname);
        return new Response(JSON.stringify({ page: 1, total_pages: 1, results: [] }), { status: 200 });
      },
    });

    await client.search({ query: 'Arrival', type: 'movie', page: 1 });
    await client.search({ query: '왕좌의 게임', type: 'tv', page: 1 });

    assert.deepEqual(requestedPaths, ['/3/search/movie', '/3/search/tv']);
  });

  it('loads daily trending movie and tv recommendations and filters unsupported media types', async () => {
    let requestedUrl = '';
    const client = new TmdbClient(undefined, {
      apiKey: 'test-key',
      fetcher: async (url) => {
        requestedUrl = String(url);
        return jsonResponse({
          page: 1,
          total_pages: 3,
          results: [
            {
              id: 157336,
              media_type: 'movie',
              title: '인터스텔라',
              original_title: 'Interstellar',
              overview: '우주를 향한 여정.',
              poster_path: '/poster.jpg',
              backdrop_path: '/backdrop.jpg',
              release_date: '2014-11-06',
              genre_ids: [12, 18, 878],
              origin_country: ['US'],
              vote_average: 8.4,
              vote_count: 36000,
              popularity: 122.5,
            },
            { id: 1, media_type: 'person', name: '지원하지 않는 인물' },
          ],
        });
      },
    });

    const result = await client.trending({ period: 'day', page: 1, language: 'ko-KR' });

    const url = new URL(requestedUrl);
    assert.equal(url.pathname, '/3/trending/all/day');
    assert.equal(url.searchParams.get('language'), 'ko-KR');
    assert.equal(url.searchParams.get('api_key'), 'test-key');
    assert.equal(result.page, 1);
    assert.equal(result.totalPages, 3);
    assert.equal(result.items.length, 1);
    assert.equal(result.items[0].externalId, '157336');
    assert.equal(result.items[0].voteAverage, 8.4);
    assert.equal(result.items[0].reason, 'trending');
  });

  it('loads genre discover recommendations with preset discover query options', async () => {
    let requestedUrl = '';
    const client = new TmdbClient(undefined, {
      apiKey: 'test-key',
      fetcher: async (url) => {
        requestedUrl = String(url);
        return jsonResponse({
          page: 2,
          total_pages: 9,
          results: [
            {
              id: 1399,
              name: '왕좌의 게임',
              original_name: 'Game of Thrones',
              overview: '가문들의 전쟁.',
              poster_path: '/got.jpg',
              backdrop_path: '/got-bg.jpg',
              first_air_date: '2011-04-17',
              genre_ids: [18, 10765],
              origin_country: ['US'],
              vote_average: 8.5,
              vote_count: 24000,
              popularity: 90,
            },
          ],
        });
      },
    });

    const result = await client.discover({
      mediaType: 'tv',
      page: 2,
      language: 'ko-KR',
      region: 'KR',
      withGenres: [18, 10765],
      sortBy: 'popularity.desc',
      voteCountGte: 100,
      reason: 'genre:immersive-thriller',
    });

    const url = new URL(requestedUrl);
    assert.equal(url.pathname, '/3/discover/tv');
    assert.equal(url.searchParams.get('with_genres'), '18,10765');
    assert.equal(url.searchParams.get('sort_by'), 'popularity.desc');
    assert.equal(url.searchParams.get('vote_count.gte'), '100');
    assert.equal(url.searchParams.get('language'), 'ko-KR');
    assert.equal(url.searchParams.get('region'), 'KR');
    assert.equal(result.page, 2);
    assert.equal(result.items[0].mediaType, 'TV');
    assert.equal(result.items[0].reason, 'genre:immersive-thriller');
  });
});
