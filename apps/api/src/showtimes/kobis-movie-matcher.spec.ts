import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import type { MediaRecommendationItem } from '../media/tmdb.mapper';
import type { KobisFilm } from './kobis-api.client';
import {
  exactCandidates,
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
    assert.equal(sameDirector(film(), 'Christopher Nolan'), true);
    assert.equal(sameDirector(film(), '크리스토퍼놀란'), true);
    assert.equal(sameDirector(film(), 'Someone Else'), false);
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
        detail: async ({ externalId }: { externalId: string }) => {
          details.push(externalId);
          return { director: directors[externalId] ?? null };
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
});
