'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { getDiaryDashboard } from '../../lib/api/diaries';
import { AppShell } from '../layout/AppShell';
import { DiaryInsightGrid } from './DiaryInsightGrid';
import { DiaryRecentListSection } from './DiaryRecentListSection';
import { DiarySearchBar } from './DiarySearchBar';
import { DiarySummarySection } from './DiarySummarySection';
import { filterDiaryItems, setDiaryDashboardQueryParam } from './diary-dashboard-utils';
import type { DiaryDashboardView } from './diary-dashboard-types';

export type DiaryDashboardStatus = 'loading' | 'ready' | 'error';

const today = new Date();

const emptyDiaryDashboard: DiaryDashboardView = {
  summary: {
    totalCount: 0,
    monthlyCount: 0,
    averageRating: 0,
    topGenre: null,
  },
  calendar: {
    year: today.getFullYear(),
    month: today.getMonth() + 1,
    markers: [],
  },
  genreRatios: [],
  recentItems: [],
};

function toCalendarDay(value: string | null) {
  const day = Number(value);
  return Number.isInteger(day) && day >= 1 && day <= 31 ? day : undefined;
}

export function DiaryDashboard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [dashboard, setDashboard] = useState<DiaryDashboardView>(emptyDiaryDashboard);
  const [status, setStatus] = useState<DiaryDashboardStatus>('loading');
  const [query, setQuery] = useState(searchParams.get('q') ?? '');
  const [selectedCalendarDay, setSelectedCalendarDay] = useState<number | undefined>(
    toCalendarDay(searchParams.get('day')),
  );

  useEffect(() => {
    let mounted = true;

    getDiaryDashboard()
      .then((nextDashboard) => {
        if (!mounted) return;
        setDashboard(nextDashboard);
        setStatus('ready');
      })
      .catch(() => {
        if (!mounted) return;
        setStatus('error');
      });

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    const nextQuery = searchParams.get('q') ?? '';
    const nextDay = toCalendarDay(searchParams.get('day'));
    setQuery(nextQuery);
    setSelectedCalendarDay(nextDay);
  }, [searchParams]);

  const visibleDiaries = useMemo(
    () => filterDiaryItems(dashboard.recentItems, query, selectedCalendarDay),
    [dashboard.recentItems, query, selectedCalendarDay],
  );

  const shouldShowMyDiarySection = visibleDiaries.length > 0;

  const selectedCalendarDescription = selectedCalendarDay
    ? `${dashboard.calendar.month}월 ${selectedCalendarDay}일에 작성한 기록만 모아봤어요.`
    : undefined;

  const handleQueryChange = (nextQuery: string) => {
    setQuery(nextQuery);
    router.replace(setDiaryDashboardQueryParam(searchParams, { q: nextQuery, day: selectedCalendarDay }), {
      scroll: false,
    });
  };

  const handleCalendarDaySelect = (nextDay: number) => {
    setSelectedCalendarDay(nextDay);
    router.replace(setDiaryDashboardQueryParam(searchParams, { q: query, day: nextDay }), { scroll: false });
  };

  return (
    <AppShell>
      <div className="overflow-x-hidden pb-8" data-design="diary-dashboard">
        <DiarySearchBar value={query} onChange={handleQueryChange} />
        {status === 'error' ? (
          <div className="mb-4 rounded-[24px] bg-white px-5 py-4 text-[13px] font-bold text-[#e85b6a] shadow-[0_14px_34px_rgba(31,42,68,0.07)]">
            다이어리 데이터를 불러오지 못했어요. 잠시 후 다시 시도해주세요.
          </div>
        ) : null}
        <DiarySummarySection summary={dashboard.summary} />
        <DiaryInsightGrid
          year={dashboard.calendar.year}
          month={dashboard.calendar.month}
          selectedDay={selectedCalendarDay ?? dashboard.calendar.selectedDay}
          calendarMarkers={dashboard.calendar.markers}
          genreRatios={dashboard.genreRatios}
          onDaySelect={handleCalendarDaySelect}
        />
        {shouldShowMyDiarySection ? (
          <DiaryRecentListSection
            items={visibleDiaries}
            title="내가 작성한 다이어리"
            description={selectedCalendarDescription}
          />
        ) : null}
      </div>
    </AppShell>
  );
}
