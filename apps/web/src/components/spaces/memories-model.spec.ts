import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import type { SpaceMemories } from '@davas/shared';
import { monthDayLabel, monthGrid, recapLines, seoulMonth, shiftMonth } from './memories-model';

describe('calendar and year-end card helpers', () => {
  it('lays a month out from Sunday and steps across years', () => {
    // October 2026 starts on a Thursday.
    const october = monthGrid('2026-10');
    assert.deepEqual(october.slice(0, 5), [null, null, null, null, '2026-10-01']);
    assert.equal(october.at(-1), '2026-10-31');
    assert.equal(monthGrid('2028-02').filter(Boolean).length, 29);
    assert.equal(shiftMonth('2026-01', -1), '2025-12');
    assert.equal(shiftMonth('2026-12', 1), '2027-01');
    assert.equal(seoulMonth(new Date('2026-09-30T16:30:00Z')), '2026-10');
    assert.equal(monthDayLabel('2026-03-01'), '3월 1일');
  });

  it('lists the year’s highlights that exist, in reading order', () => {
    const data = {
      year: 2026,
      totals: { records: 3, movies: 2, series: 1, photos: 0 },
      genres: [{ name: '드라마', count: 2 }],
      sources: { theater: 2, ott: 1, other: 0 },
      onThisDay: [],
      inProgress: [],
      recap: {
        monthly: [0, 0, 2, 0, 0, 0, 1, 0, 0, 0, 0, 0],
        busiestMonth: { month: 3, count: 2 },
        firstWatch: { watchEventId: 'a', title: '듄: 파트 2', watchedDate: '2026-03-01' },
        latestWatch: { watchEventId: 'b', title: '파묘', watchedDate: '2026-07-02' },
        topRated: [
          {
            mediaId: 'm',
            title: '듄: 파트 2',
            posterUrl: null,
            averageRating: 4.5,
            ratingCount: 2,
          },
        ],
        favoritePlace: { name: 'CGV 용산', count: 2 },
        favoriteService: null,
        coverPhotos: [],
      },
    } satisfies SpaceMemories;
    assert.deepEqual(recapLines(data), [
      { label: '우리 별점 1위', value: '듄: 파트 2 · ★ 4.5' },
      { label: '가장 많이 본 달', value: '3월 · 2편' },
      { label: '처음 함께 본 작품', value: '듄: 파트 2 · 3월 1일' },
      { label: '자주 본 장르', value: '드라마' },
      { label: '자주 간 곳', value: 'CGV 용산 · 2번' },
    ]);
  });
});
