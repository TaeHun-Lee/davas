import type { SpaceMemories } from '@davas/shared';
import { monthDayLabel } from '../../lib/dates';

/** This month in Korea, as `2026-10`. */
export const seoulMonth = (now = new Date()) =>
  new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Seoul', year: 'numeric', month: '2-digit' })
    .format(now)
    .slice(0, 7);

export function shiftMonth(month: string, offset: number) {
  const [year, monthNumber] = month.split('-').map(Number);
  const date = new Date(Date.UTC(year, monthNumber - 1 + offset, 1));
  return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, '0')}`;
}

/** The cells of a Sunday-first month grid: null for the blanks before the 1st, then each day. */
export function monthGrid(month: string): Array<string | null> {
  const [year, monthNumber] = month.split('-').map(Number);
  const firstWeekday = new Date(Date.UTC(year, monthNumber - 1, 1)).getUTCDay();
  const days = new Date(Date.UTC(year, monthNumber, 0)).getUTCDate();
  return [
    ...Array.from({ length: firstWeekday }, () => null),
    ...Array.from({ length: days }, (_, index) => `${month}-${String(index + 1).padStart(2, '0')}`),
  ];
}

/** `2026-03-01` → `3월 1일`. */
export type RecapLine = { label: string; value: string };

/**
 * The year-end card's highlights, in reading order. The on-screen card and the saved image
 * both use these, so they always say the same thing.
 */
export function recapLines(data: SpaceMemories): RecapLine[] {
  const { recap } = data;
  const lines: RecapLine[] = [];
  const best = recap.topRated[0];
  if (best) {
    lines.push({
      label: '우리 별점 1위',
      value: `${best.title} · ★ ${best.averageRating.toFixed(1)}`,
    });
  }
  if (recap.busiestMonth) {
    lines.push({
      label: '가장 많이 본 달',
      value: `${recap.busiestMonth.month}월 · ${recap.busiestMonth.count}편`,
    });
  }
  if (recap.firstWatch) {
    lines.push({
      label: '처음 함께 본 작품',
      value: `${recap.firstWatch.title} · ${monthDayLabel(recap.firstWatch.watchedDate)}`,
    });
  }
  if (data.genres[0]) lines.push({ label: '자주 본 장르', value: data.genres[0].name });
  if (recap.favoritePlace) {
    lines.push({
      label: '자주 간 곳',
      value: `${recap.favoritePlace.name} · ${recap.favoritePlace.count}번`,
    });
  }
  if (recap.favoriteService) {
    lines.push({
      label: '자주 본 OTT',
      value: `${recap.favoriteService.name} · ${recap.favoriteService.count}편`,
    });
  }
  return lines;
}
