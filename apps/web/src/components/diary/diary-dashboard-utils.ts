import type { DiaryCalendarDay, DiaryCalendarMarker, DiaryListItemView } from './diary-dashboard-types';

export function getDiaryCalendarDays({
  year,
  month,
  selectedDay,
  today = new Date(),
  markers,
}: {
  year: number;
  month: number;
  selectedDay?: number;
  today?: Date;
  markers: DiaryCalendarMarker[];
}): DiaryCalendarDay[] {
  const firstDay = new Date(year, month - 1, 1);
  const currentMonthDays = new Date(year, month, 0).getDate();
  const leadingDays = firstDay.getDay();
  const previousMonthDays = new Date(year, month - 1, 0).getDate();
  const markerMap = new Map(markers.map((marker) => [marker.day, marker.count]));
  const totalSlots = Math.ceil((leadingDays + currentMonthDays) / 7) * 7;

  return Array.from({ length: totalSlots }, (_, index) => {
    const currentMonth = index >= leadingDays && index < leadingDays + currentMonthDays;
    const day = currentMonth
      ? index - leadingDays + 1
      : index < leadingDays
        ? previousMonthDays - leadingDays + index + 1
        : index - leadingDays - currentMonthDays + 1;

    return {
      key: `${currentMonth ? 'current' : index < leadingDays ? 'prev' : 'next'}-${index}-${day}`,
      day,
      currentMonth,
      selected: currentMonth && day === selectedDay,
      today: currentMonth && today.getFullYear() === year && today.getMonth() + 1 === month && today.getDate() === day,
      entryCount: currentMonth ? markerMap.get(day) ?? 0 : 0,
    };
  });
}

export type DiaryDateSelection = {
  year?: number;
  month?: number;
  day?: number;
};

export function filterDiaryItems(items: DiaryListItemView[], query: string, selectedDate?: DiaryDateSelection) {
  const normalizedQuery = query.trim().toLocaleLowerCase('ko-KR');
  const filteredItems = normalizedQuery
    ? items.filter((item) =>
        [item.mediaTitle, item.diaryTitle, item.contentPreview, ...item.genreNames]
          .join(' ')
          .toLocaleLowerCase('ko-KR')
          .includes(normalizedQuery),
      )
    : items;

  const calendarItems = selectedDate?.day
    ? filteredItems.filter((item) => isSameWatchedDate(item.watchedDate, selectedDate))
    : filteredItems;

  return sortByRecentlyWritten(calendarItems);
}

export function sortByRecentlyWritten(items: DiaryListItemView[]) {
  return [...items].sort((a, b) => Number(new Date(b.createdAt)) - Number(new Date(a.createdAt)));
}

export function sortByWatchedDate(items: DiaryListItemView[]) {
  return [...items].sort((a, b) => {
    const dateDiff = Number(new Date(toIsoWatchedDate(b.watchedDate))) - Number(new Date(toIsoWatchedDate(a.watchedDate)));
    return dateDiff || Number(new Date(b.createdAt)) - Number(new Date(a.createdAt));
  });
}

export function getAdjacentDiaryMonth(year: number, month: number, offset: -1 | 1) {
  const nextDate = new Date(year, month - 1 + offset, 1);
  return { year: nextDate.getFullYear(), month: nextDate.getMonth() + 1 };
}

function isSameWatchedDate(watchedDate: string, selectedDate: DiaryDateSelection) {
  const [year, month, day] = watchedDate.trim().split(/[.-]/).map(Number);
  return year === selectedDate.year && month === selectedDate.month && day === selectedDate.day;
}

function toIsoWatchedDate(watchedDate: string) {
  return watchedDate.trim().replace(/\./g, '-');
}

export function setDiaryDashboardQueryParam(
  searchParams: URLSearchParams | ReadonlyURLSearchParamsLike,
  { q, year, month, day }: { q: string; year?: number; month?: number; day?: number },
) {
  const params = new URLSearchParams(searchParams.toString());
  const trimmedQuery = q.trim();

  if (trimmedQuery) {
    params.set('q', trimmedQuery);
  } else {
    params.delete('q');
  }

  params.delete('tab');

  if (year && month) {
    params.set('year', String(year));
    params.set('month', String(month));
  } else {
    params.delete('year');
    params.delete('month');
  }

  if (day) {
    params.set('day', String(day));
  } else {
    params.delete('day');
  }

  const queryString = params.toString();
  return queryString ? `/diary?${queryString}` : '/diary';
}

type ReadonlyURLSearchParamsLike = {
  toString(): string;
};
