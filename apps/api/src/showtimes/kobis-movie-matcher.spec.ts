import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import type { MediaRecommendationItem } from '../media/tmdb.mapper';
import type { KobisFilm } from './kobis-api.client';
import {
  exactCandidates,
  isReissue,
  kobisBaseTitle,
  KobisMovieMatcher,
  looseCandidates,
  sameDirector,
} from './kobis-movie-matcher';

function film(overrides: Partial<KobisFilm> = {}): KobisFilm {
  return {
    code: '20250654',
    title: '오디세이',
    titleEn: 'The Odyssey',
    originalTitle: null,
    productionYear: 2025,
    openDate: '2026-07-15',
    directors: ['크리스토퍼 놀란', 'Christopher Nolan'],
    ...overrides,
  };
}

function candidate(externalId: string, title: string, releaseDate: string, originalTitle = title) {
  return {
    externalProvider: 'TMDB',
    externalId,
    mediaType: 'MOVIE',
    title,
    originalTitle,
    overview: '',
    posterUrl: null,
    backdropUrl: null,
    releaseDate,
    genreIds: [],
    country: null,
    voteAverage: 7,
    voteCount: 100,
    popularity: 10,
    reason: 'now-showing',
  } satisfies MediaRecommendationItem;
}

describe('linking KOBIS films to TMDB titles', () => {
  it('drops the print and the re-release edition from KOBIS titles', () => {
    assert.equal(kobisBaseTitle('암살자(들)(디지털)'), '암살자(들)');
    assert.equal(
      kobisBaseTitle('셀린느와 줄리 배 타러 가다 (디지털)'),
      '셀린느와 줄리 배 타러 가다',
    );
    assert.equal(kobisBaseTitle('어벤져스: 엔드게임 앙코르(4D)'), '어벤져스: 엔드게임');
    assert.equal(kobisBaseTitle('더 폴: 디렉터스 컷'), '더 폴');
    assert.equal(kobisBaseTitle('청춘(봄)'), '청춘(봄)');
  });

  it('takes titles named like the film within a year of it, and near names only by director', () => {
    const odyssey = candidate('1368337', '오디세이', '2026-07-15', 'The Odyssey');
    const old = candidate('581', '오디세이', '1997-05-18', 'The Odyssey');
    const remake = candidate('9', '오디세이 2', '2026-01-01');
    assert.deepEqual(
      exactCandidates(film(), [odyssey, old, remake]).map((item) => item.externalId),
      ['1368337'],
    );
    assert.deepEqual(
      looseCandidates(film(), [old, remake]).map((item) => item.externalId),
      ['9'],
    );
    assert.equal(sameDirector(film(), ['Christopher Nolan']), true);
    assert.equal(sameDirector(film(), ['크리스토퍼놀란']), true);
    assert.equal(sameDirector(film(), ['Someone Else']), false);
  });

  it('links a single clear title, settles ties by director, and leaves unclear ones unlinked', async () => {
    const searches: string[] = [];
    const details: string[] = [];
    let results: MediaRecommendationItem[] = [];
    let directors: Record<string, string> = {};
    const matcher = new KobisMovieMatcher(
      { configured: true, film: async () => film() } as never,
      {
        searchMovies: async (query: string) => {
          searches.push(query);
          return results;
        },
        movieDirectors: async (externalId: string) => {
          details.push(externalId);
          return directors[externalId] ? [directors[externalId]] : [];
        },
      } as never,
    );

    results = [candidate('1368337', '오디세이', '2026-07-15', 'The Odyssey')];
    assert.equal((await matcher.match('20250654'))?.tmdb?.externalId, '1368337');
    assert.deepEqual(searches, ['오디세이', 'The Odyssey']);
    assert.deepEqual(details, [], 'one clear title needs no director check');

    results = [candidate('1', '오디세이', '2025-10-01'), candidate('2', '오디세이', '2026-07-15')];
    directors = { '2': 'Christopher Nolan', '1': 'Other' };
    assert.equal((await matcher.match('20250654'))?.tmdb?.externalId, '2');

    directors = {};
    assert.equal((await matcher.match('20250654'))?.tmdb, null);
  });

  // The films left unlinked by the first production run, 2026-10-11.
  it('compares directors by any of their names, in any word order', () => {
    const alpha = film({
      title: '알파',
      titleEn: 'Alpha',
      directors: ['줄리아 뒤쿠르노', 'Julia Ducournau'],
    });
    // TMDB spells the Korean name another way; its original name is the same.
    assert.equal(sameDirector(alpha, ['쥘리아 뒤쿠르노', 'Julia Ducournau']), true);
    assert.equal(sameDirector(alpha, ['쥘리아 뒤쿠르노']), false);
    assert.equal(sameDirector(film({ directors: ['DUCOURNAU Julia'] }), ['Julia Ducournau']), true);
    assert.equal(sameDirector(alpha, ['Julia Roberts']), false);
  });

  it('picks 알파 among four 2024–2026 films of that name by its director', async () => {
    const alpha = film({
      code: '20264847',
      title: '알파',
      titleEn: 'Alpha',
      productionYear: 2025,
      openDate: '2026-09-30',
      directors: ['줄리아 뒤쿠르노', 'Julia Ducournau'],
    });
    const directors: Record<string, string[]> = {
      '1284460': ['쥘리아 뒤쿠르노', 'Julia Ducournau'],
      '1576462': ['Dhiwangkara Seta'],
      '1318803': ['Jan-Willem van Ewijk'],
      '1193198': ['Anteros Marra'],
    };
    const matcher = new KobisMovieMatcher(
      { configured: true, film: async () => alpha } as never,
      {
        searchMovies: async () => [
          candidate('1284460', '알파', '2025-08-20', 'Alpha'),
          candidate('1576462', '알파', '2025-12-01', 'αLPα'),
          candidate('1318803', '알파.', '2025-02-13', 'Alpha.'),
          candidate('1193198', 'ALPHA', '2024-07-12'),
        ],
        movieDirectors: async (externalId: string) => directors[externalId] ?? [],
      } as never,
    );
    assert.equal((await matcher.match('20264847'))?.tmdb?.externalId, '1284460');
  });

  it('links a re-release to the original by its director, whatever year KOBIS gives it', async () => {
    const encore = film({
      code: '20266766',
      title: '어벤져스: 엔드게임 앙코르',
      titleEn: 'Avengers: Endgame Encore',
      productionYear: 2026,
      openDate: '2026-09-23',
      directors: ['안소니 루소', 'Anthony RUSSO', '조 루소', 'Joe RUSSO'],
    });
    assert.equal(isReissue(encore), true);
    assert.equal(isReissue(film()), false);
    assert.equal(kobisBaseTitle('Avengers: Endgame Encore'), 'Avengers: Endgame');
    const searches: string[] = [];
    const matcher = new KobisMovieMatcher(
      { configured: true, film: async () => encore } as never,
      {
        searchMovies: async (query: string) => {
          searches.push(query);
          return [
            candidate('299534', '어벤져스: 엔드게임', '2019-04-24', 'Avengers: Endgame'),
            candidate('1', '어벤져스: 엔드게임 메이킹', '2019-08-01'),
          ];
        },
        movieDirectors: async (externalId: string) =>
          externalId === '299534' ? ['안소니 루소', 'Anthony Russo'] : ['Someone'],
      } as never,
    );
    assert.equal((await matcher.match('20266766'))?.tmdb?.externalId, '299534');
    assert.deepEqual(searches, ['어벤져스: 엔드게임', 'Avengers: Endgame']);
  });

  it('finds a film TMDB names differently in Korean by its English title and director', async () => {
    const escaped = film({
      code: '20135630',
      title: '사형수 탈옥하다',
      titleEn: 'A man escaped',
      productionYear: 1956,
      openDate: null,
      directors: ['로베르 브레송', 'BRESSON Robert'],
    });
    const matcher = new KobisMovieMatcher(
      { configured: true, film: async () => escaped } as never,
      {
        searchMovies: async (query: string) =>
          query === 'A man escaped'
            ? [
                candidate('15244', '저항', '1956-11-11', 'Un condamné à mort s’est échappé'),
                candidate('2', '탈옥', '2010-01-01'),
              ]
            : [],
        movieDirectors: async (externalId: string) =>
          externalId === '15244' ? ['로베르 브레송', 'Robert Bresson'] : ['Someone'],
      } as never,
    );
    assert.equal((await matcher.match('20135630'))?.tmdb?.externalId, '15244');
  });
});
