import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { mapTmdbDetail } from './tmdb-detail.mapper';

describe('mapTmdbDetail', () => {
  it('maps TMDB movie detail fields that search results cannot provide', () => {
    const detail = mapTmdbDetail({
      id: 1124566,
      title: '센티멘탈 밸류',
      original_title: 'Affeksjonsverdi',
      overview: '공식 시놉시스',
      tagline: '함께하는 마지막 영화가 될지도 몰라',
      poster_path: '/poster.jpg',
      backdrop_path: '/backdrop.jpg',
      release_date: '2025-08-20',
      runtime: 133,
      genres: [{ id: 18, name: '드라마' }],
      production_countries: [{ iso_3166_1: 'NO', name: 'Norway' }],
      vote_average: 7.494,
      vote_count: 861,
      credits: {
        cast: [{ name: 'Renate Reinsve', order: 0 }, { name: 'Stellan Skarsgård', order: 1 }],
        crew: [{ name: 'Joachim Trier', job: 'Director' }],
      },
      images: {
        backdrops: [{ file_path: '/still-1.jpg' }, { file_path: '/still-2.jpg' }],
      },
      release_dates: {
        results: [{ iso_3166_1: 'KR', release_dates: [{ certification: '15' }] }],
      },
    }, 'MOVIE');

    assert.equal(detail.runtime, 133);
    assert.deepEqual(detail.genres, ['드라마']);
    assert.equal(detail.director, 'Joachim Trier');
    assert.deepEqual(detail.cast, ['Renate Reinsve', 'Stellan Skarsgård']);
    assert.deepEqual(detail.stillCuts, [
      'https://image.tmdb.org/t/p/w780/still-1.jpg',
      'https://image.tmdb.org/t/p/w780/still-2.jpg',
    ]);
    assert.equal(detail.certification, '15');
    assert.equal(detail.tmdbRating, 7.494);
    assert.equal(detail.tmdbVoteCount, 861);
  });
});
