import type { DiaryCalendarDay, DiaryCalendarMarker, DiaryFilterTab, DiaryListItemView } from './diary-dashboard-types';

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

export function filterDiaryItems(items: DiaryListItemView[], query: string, tab: DiaryFilterTab) {
  const normalizedQuery = query.trim().toLocaleLowerCase('ko-KR');
  const filteredItems = normalizedQuery
    ? items.filter((item) =>
        [item.mediaTitle, item.diaryTitle, item.contentPreview, ...item.genreNames]
          .join(' ')
          .toLocaleLowerCase('ko-KR')
          .includes(normalizedQuery),
      )
    : items;

  if (tab === '평점순') {
    return [...filteredItems].sort((a, b) => b.rating - a.rating);
  }

  return [...filteredItems].sort((a, b) => Number(new Date(b.watchedDate)) - Number(new Date(a.watchedDate)));
}

export function setDiaryDashboardQueryParam(
  searchParams: URLSearchParams | ReadonlyURLSearchParamsLike,
  { q, tab }: { q: string; tab: DiaryFilterTab },
) {
  const params = new URLSearchParams(searchParams.toString());
  const trimmedQuery = q.trim();

  if (trimmedQuery) {
    params.set('q', trimmedQuery);
  } else {
    params.delete('q');
  }

  if (tab === '전체') {
    params.delete('tab');
  } else {
    params.set('tab', tab);
  }

  const queryString = params.toString();
  return queryString ? `/diary?${queryString}` : '/diary';
}

type ReadonlyURLSearchParamsLike = {
  toString(): string;
};
