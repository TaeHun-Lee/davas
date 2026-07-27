'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { getDiaryDashboard } from '../../lib/api/diaries';
import { AppShell } from '../layout/AppShell';
import { DiaryInsightGrid } from './DiaryInsightGrid';
import { DiaryRecentListSection } from './DiaryRecentListSection';
import { DiarySearchBar } from './DiarySearchBar';
import { DiarySummarySection } from './DiarySummarySection';
import {
  filterDiaryItems,
  getAdjacentDiaryMonth,
  setDiaryDashboardQueryParam,
  sortByWatchedDate,
} from './diary-dashboard-utils';
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

function toCalendarNumber(value: string | null) {
  const numberValue = Number(value);
  return Number.isInteger(numberValue) && numberValue > 0 ? numberValue : undefined;
}

export function DiaryDashboard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [dashboard, setDashboard] = useState<DiaryDashboardView>(emptyDiaryDashboard);
  const [status, setStatus] = useState<DiaryDashboardStatus>('loading');
  const [query, setQuery] = useState(searchParams.get('q') ?? '');
  const [calendarYear, setCalendarYear] = useState(
    toCalendarNumber(searchParams.get('year')) ?? emptyDiaryDashboard.calendar.year,
  );
  const [calendarMonth, setCalendarMonth] = useState(
    toCalendarNumber(searchParams.get('month')) ?? emptyDiaryDashboard.calendar.month,
  );
  const [selectedCalendarDay, setSelectedCalendarDay] = useState<number | undefined>(
    toCalendarDay(searchParams.get('day')),
  );
  const [showAllDiaries, setShowAllDiaries] = useState(false);
  const [retryKey, setRetryKey] = useState(0);

  useEffect(() => {
    let mounted = true;

    getDiaryDashboard({ year: calendarYear, month: calendarMonth, day: selectedCalendarDay })
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
  }, [calendarYear, calendarMonth, selectedCalendarDay, retryKey]);

  useEffect(() => {
    const nextQuery = searchParams.get('q') ?? '';
    const nextYear = toCalendarNumber(searchParams.get('year'));
    const nextMonth = toCalendarNumber(searchParams.get('month'));
    const nextDay = toCalendarDay(searchParams.get('day'));
    setQuery(nextQuery);
    if (nextYear) setCalendarYear(nextYear);
    if (nextMonth) setCalendarMonth(nextMonth);
    setSelectedCalendarDay(nextDay);
  }, [searchParams]);

  const selectedCalendarDate = useMemo(
    () => ({
      year: dashboard.calendar.year,
      month: dashboard.calendar.month,
      day: selectedCalendarDay,
    }),
    [dashboard.calendar.year, dashboard.calendar.month, selectedCalendarDay],
  );

  const visibleDiaries = useMemo(
    () =>
      showAllDiaries
        ? sortByWatchedDate(filterDiaryItems(dashboard.recentItems, query))
        : filterDiaryItems(dashboard.recentItems, query, selectedCalendarDate),
    [dashboard.recentItems, query, selectedCalendarDate, showAllDiaries],
  );

  const shouldShowMyDiarySection = visibleDiaries.length > 0;

  const selectedCalendarDescription = selectedCalendarDay
    ? `${dashboard.calendar.year}년 ${dashboard.calendar.month}월 ${selectedCalendarDay}일에 작성한 기록만 모아봤어요.`
    : showAllDiaries
      ? '관람일 기준으로 전체 다이어리를 정렬했어요.'
      : undefined;

  const handleQueryChange = (nextQuery: string) => {
    setQuery(nextQuery);
    router.replace(
      setDiaryDashboardQueryParam(searchParams, {
        q: nextQuery,
        year: dashboard.calendar.year,
        month: dashboard.calendar.month,
        day: selectedCalendarDay,
      }),
      { scroll: false },
    );
  };

  const handleCalendarDaySelect = (nextDay: number) => {
    setShowAllDiaries(false);
    setSelectedCalendarDay(nextDay);
    router.replace(
      setDiaryDashboardQueryParam(searchParams, {
        q: query,
        year: dashboard.calendar.year,
        month: dashboard.calendar.month,
        day: nextDay,
      }),
      { scroll: false },
    );
  };

  const handleCalendarMonthChange = (offset: -1 | 1) => {
    const nextMonth = getAdjacentDiaryMonth(
      dashboard.calendar.year,
      dashboard.calendar.month,
      offset,
    );
    setShowAllDiaries(false);
    setCalendarYear(nextMonth.year);
    setCalendarMonth(nextMonth.month);
    setSelectedCalendarDay(undefined);
    router.replace(
      setDiaryDashboardQueryParam(searchParams, {
        q: query,
        year: nextMonth.year,
        month: nextMonth.month,
      }),
      {
        scroll: false,
      },
    );
  };

  const handleCalendarMonthSelect = (nextYear: number, nextMonth: number) => {
    setShowAllDiaries(false);
    setCalendarYear(nextYear);
    setCalendarMonth(nextMonth);
    setSelectedCalendarDay(undefined);
    router.replace(
      setDiaryDashboardQueryParam(searchParams, { q: query, year: nextYear, month: nextMonth }),
      {
        scroll: false,
      },
    );
  };

  const handleCalendarSelectAll = () => {
    setShowAllDiaries(false);
    setSelectedCalendarDay(undefined);
    router.replace(
      setDiaryDashboardQueryParam(searchParams, {
        q: query,
        year: dashboard.calendar.year,
        month: dashboard.calendar.month,
      }),
      { scroll: false },
    );
  };

  const handleViewAllDiaries = () => {
    setShowAllDiaries(true);
    setSelectedCalendarDay(undefined);
    router.replace(
      setDiaryDashboardQueryParam(searchParams, {
        q: query,
        year: dashboard.calendar.year,
        month: dashboard.calendar.month,
      }),
      { scroll: false },
    );
  };

  if (status === 'loading') {
    return (
      <AppShell>
        <div className="space-y-4" aria-label="다이어리를 불러오는 중">
          <div className="h-12 animate-pulse rounded-[18px] bg-white" />
          <div className="h-48 animate-pulse rounded-[24px] bg-white" />
          <div className="h-72 animate-pulse rounded-[24px] bg-white" />
        </div>
      </AppShell>
    );
  }

  if (status === 'error') {
    return (
      <AppShell>
        <section className="rounded-[24px] bg-white px-5 py-8 text-center">
          <h1 className="text-[17px] font-black text-[#23426f]">다이어리를 불러오지 못했어요</h1>
          <p className="mt-2 text-[13px] font-bold text-[#65758a]">
            로그인 문제와 네트워크 문제를 구분해 다시 확인해주세요.
          </p>
          <button
            type="button"
            onClick={() => {
              setStatus('loading');
              setRetryKey((value) => value + 1);
            }}
            className="mt-5 min-h-11 rounded-[16px] bg-[#284778] px-5 text-[13px] font-black text-white"
          >
            다시 시도
          </button>
        </section>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="overflow-x-hidden pb-8" data-design="diary-dashboard">
        <DiarySearchBar value={query} onChange={handleQueryChange} />
        <DiarySummarySection summary={dashboard.summary} />
        <DiaryInsightGrid
          year={dashboard.calendar.year}
          month={dashboard.calendar.month}
          selectedDay={selectedCalendarDay ?? dashboard.calendar.selectedDay}
          calendarMarkers={dashboard.calendar.markers}
          genreRatios={dashboard.genreRatios}
          onDaySelect={handleCalendarDaySelect}
          onMonthChange={handleCalendarMonthChange}
          onMonthSelect={handleCalendarMonthSelect}
          onSelectAll={handleCalendarSelectAll}
        />
        {shouldShowMyDiarySection ? (
          <DiaryRecentListSection
            items={visibleDiaries}
            title="내가 작성한 다이어리"
            description={selectedCalendarDescription}
            onViewAll={handleViewAllDiaries}
          />
        ) : dashboard.recentItems.length === 0 ? (
          <section className="mt-5 rounded-[24px] bg-white px-5 py-8 text-center">
            <h2 className="text-[16px] font-black text-[#23426f]">아직 감상 기록이 없어요</h2>
            <p className="mt-2 text-[13px] font-bold text-[#65758a]">
              마음에 남은 작품부터 하나 골라보세요.
            </p>
            <button
              type="button"
              onClick={() => router.push('/explore?intent=record')}
              className="mt-5 min-h-11 rounded-[16px] bg-[#ff5a52] px-5 text-[13px] font-black text-white"
            >
              작품 찾아 기록하기
            </button>
          </section>
        ) : (
          <DiaryRecentListSection items={[]} />
        )}
      </div>
    </AppShell>
  );
}
