import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { mapTmdbRecommendationResult, mapTmdbSearchResult } from './tmdb.mapper';

describe('mapTmdbSearchResult', () => {
  it('normalizes TMDB movie search results for Davas media cards', () => {
    const result = mapTmdbSearchResult({
      id: 550,
      media_type: 'movie',
      title: 'Fight Club',
      original_title: 'Fight Club',
      overview: 'An insomniac office worker and a soap maker form a club.',
      poster_path: '/poster.jpg',
      backdrop_path: '/backdrop.jpg',
      release_date: '1999-10-15',
      genre_ids: [18, 53],
      origin_country: ['US'],
    });

    assert.deepEqual(result, {
      externalProvider: 'TMDB',
      externalId: '550',
      mediaType: 'MOVIE',
      title: 'Fight Club',
      originalTitle: 'Fight Club',
      overview: 'An insomniac office worker and a soap maker form a club.',
      posterUrl: 'https://image.tmdb.org/t/p/w500/poster.jpg',
      backdropUrl: 'https://image.tmdb.org/t/p/w780/backdrop.jpg',
      releaseDate: '1999-10-15',
      genreIds: [18, 53],
      country: 'US',
    });
  });

  it('normalizes TMDB tv search results and falls back when optional images are missing', () => {
    const result = mapTmdbSearchResult({
      id: 1399,
      media_type: 'tv',
      name: 'Game of Thrones',
      original_name: 'Game of Thrones',
      overview: 'Seven noble families fight for control of Westeros.',
      poster_path: null,
      backdrop_path: null,
      first_air_date: '2011-04-17',
      genre_ids: [18, 10765],
      origin_country: ['US'],
    });

    assert.equal(result.mediaType, 'TV');
    assert.equal(result.title, 'Game of Thrones');
    assert.equal(result.releaseDate, '2011-04-17');
    assert.equal(result.posterUrl, null);
    assert.equal(result.backdropUrl, null);
  });
});

describe('mapTmdbRecommendationResult', () => {
  it('normalizes movie recommendation fields shared by trending and discover responses', () => {
    const result = mapTmdbRecommendationResult({
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
    }, 'trending');

    assert.deepEqual(result, {
      externalProvider: 'TMDB',
      externalId: '157336',
      mediaType: 'MOVIE',
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
    });
  });

  it('normalizes tv recommendation results with nullable rating signals', () => {
    const result = mapTmdbRecommendationResult({
      id: 1399,
      media_type: 'tv',
      name: '왕좌의 게임',
      original_name: 'Game of Thrones',
      overview: '가문들의 전쟁.',
      poster_path: null,
      backdrop_path: null,
      first_air_date: '2011-04-17',
      genre_ids: [18, 10765],
      origin_country: ['US'],
    }, 'genre:immersive-thriller');

    assert.equal(result.mediaType, 'TV');
    assert.equal(result.title, '왕좌의 게임');
    assert.equal(result.releaseDate, '2011-04-17');
    assert.equal(result.voteAverage, null);
    assert.equal(result.voteCount, null);
    assert.equal(result.popularity, null);
    assert.equal(result.reason, 'genre:immersive-thriller');
  });
});
