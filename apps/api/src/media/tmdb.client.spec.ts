import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { TmdbClient } from './tmdb.client';

describe('TmdbClient search', () => {
  it('fetches movie detail with credits, images, and release dates appended', async () => {
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
});
