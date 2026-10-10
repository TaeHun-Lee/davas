import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import type { MediaRecommendationItem } from '../media/tmdb.mapper';
import { rankForViewer, titleKey, type Viewer } from './personal-ranking';
import { buildTasteProfile, type TasteSignal } from './taste-profile';

const NOW = new Date('2026-10-10T03:00:00.000Z');

function item(
  externalId: string,
  options: Partial<MediaRecommendationItem> = {},
): MediaRecommendationItem {
  return {
    externalProvider: 'TMDB',
    externalId,
    mediaType: 'MOVIE',
    title: externalId,
    originalTitle: externalId,
    overview: '',
    posterUrl: null,
    backdropUrl: null,
    releaseDate: '2026-06-01',
    genreIds: [18],
    country: 'US',
    voteAverage: 7.5,
    voteCount: 2000,
    popularity: 100,
    reason: 'trending',
    ...options,
  };
}

const watched = (contentId: string, genres: string[]): TasteSignal => ({
  contentId,
  features: genres,
  at: new Date('2026-09-01T12:00:00Z'),
  kind: 'WATCHED',
});

function viewer(signals: TasteSignal[] = [], seen: string[] = []): Viewer {
  return {
    accountId: 'u1',
    profile: buildTasteProfile(signals, NOW),
    historyFeatures: signals.map((signal) => signal.features),
    seen: new Set(seen),
  };
}

const ids = (items: MediaRecommendationItem[]) => items.map((entry) => entry.externalId);

describe('personal ranking of popular lists', () => {
  it('leaves out titles the viewer watched or turned down, titles not out yet and repeats', () => {
    const items = [
      item('kept'),
      item('seen'),
      item('upcoming', { releaseDate: '2026-12-24' }),
      item('kept'),
      // The same TMDB number on a series is another title.
      item('seen', { mediaType: 'TV' }),
    ];
    const ranked = rankForViewer(items, viewer([], [titleKey(item('seen'))]), NOW, 10);
    assert.deepEqual(
      ranked.map((entry) => titleKey(entry)),
      ['MOVIE:kept', 'TV:seen'],
    );
  });

  it('puts a title in the genres the viewer keeps watching ahead of an otherwise equal one', () => {
    const history = [
      ...Array.from({ length: 6 }, (_, index) => watched(`comedy-${index}`, ['코미디'])),
      watched('drama-0', ['드라마']),
    ];
    const items = [item('drama', { genreIds: [18] }), item('comedy', { genreIds: [35] })];
    assert.deepEqual(ids(rankForViewer(items, viewer(history), NOW, 10)), ['comedy', 'drama']);
  });

  it('without any history, prefers a recent, well-rated title over a higher TMDB rank', () => {
    const items = [
      item('old-and-middling', { releaseDate: '2019-05-01', voteAverage: 6.1, popularity: 120 }),
      item('new-and-good', { releaseDate: '2026-09-01', voteAverage: 8.2, popularity: 100 }),
    ];
    assert.deepEqual(ids(rankForViewer(items, viewer(), NOW, 10)), [
      'new-and-good',
      'old-and-middling',
    ]);
  });

  it('takes movies and series in turn up to the limit, filling with one kind when the other runs out', () => {
    const items = [item('m1'), item('m2'), item('m3'), item('t1', { mediaType: 'TV' }), item('m4')];
    assert.deepEqual(ids(rankForViewer(items, viewer(), NOW, 4)), ['m1', 't1', 'm2', 'm3']);
  });
});
