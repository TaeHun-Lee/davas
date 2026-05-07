import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { mapTmdbDetail } from './tmdb-detail.mapper';

describe('mapTmdbDetail', () => {
  it('maps TV creators and runtime fallback fields when episode_run_time is missing', () => {
    const detail = mapTmdbDetail({
      id: 154385,
      name: '성난 사람들',
      original_name: 'BEEF',
      overview: 'TV 시놉시스',
      first_air_date: '2023-04-06',
      episode_run_time: [],
      last_episode_to_air: { runtime: 55 },
      number_of_episodes: 18,
      number_of_seasons: 2,
      created_by: [{ name: '이성진' }],
      genres: [{ id: 35, name: '코미디' }, { id: 18, name: '드라마' }],
      content_ratings: { results: [{ iso_3166_1: 'KR', rating: '19' }] },
    }, 'TV');

    assert.equal(detail.runtime, 55);
    assert.equal(detail.director, '이성진');
    assert.deepEqual(detail.creators, ['이성진']);
    assert.equal(detail.numberOfEpisodes, 18);
    assert.equal(detail.numberOfSeasons, 2);
    assert.equal(detail.certification, '19');
    assert.deepEqual(detail.genres, ['코미디', '드라마']);
  });

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
