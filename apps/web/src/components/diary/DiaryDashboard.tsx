'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { getDiaryDashboard } from '../../lib/api/diaries';
import { AppShell } from '../layout/AppShell';
import { DiaryFilterTabs } from './DiaryFilterTabs';
import { DiaryInsightGrid } from './DiaryInsightGrid';
import { DiaryRecentListSection } from './DiaryRecentListSection';
import { DiarySearchBar } from './DiarySearchBar';
import { DiarySummarySection } from './DiarySummarySection';
import { fixtureDiaryDashboard } from './diary-dashboard-fixtures';
import { filterDiaryItems, setDiaryDashboardQueryParam } from './diary-dashboard-utils';
import type { DiaryDashboardView, DiaryFilterTab } from './diary-dashboard-types';

export type DiaryDashboardStatus = 'loading' | 'ready' | 'error';

const filterTabs = new Set<DiaryFilterTab>(['전체', '최근', '평점순', '캘린더']);

function toFilterTab(value: string | null): DiaryFilterTab {
  return filterTabs.has(value as DiaryFilterTab) ? (value as DiaryFilterTab) : '전체';
}

function toCalendarDay(value: string | null) {
  const day = Number(value);
  return Number.isInteger(day) && day >= 1 && day <= 31 ? day : undefined;
}

export function DiaryDashboard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [dashboard, setDashboard] = useState<DiaryDashboardView>(fixtureDiaryDashboard);
  const [status, setStatus] = useState<DiaryDashboardStatus>('loading');
  const [query, setQuery] = useState(searchParams.get('q') ?? '');
  const [activeTab, setActiveTab] = useState<DiaryFilterTab>(toFilterTab(searchParams.get('tab')));
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
    const nextTab = toFilterTab(searchParams.get('tab'));
    const nextDay = toCalendarDay(searchParams.get('day'));
    setQuery(nextQuery);
    setActiveTab(nextTab);
    setSelectedCalendarDay(nextDay);
  }, [searchParams]);

  const visibleDiaries = useMemo(
    () => filterDiaryItems(dashboard.recentItems, query, activeTab, selectedCalendarDay),
    [dashboard.recentItems, query, activeTab, selectedCalendarDay],
  );

  const selectedCalendarDescription = activeTab === '캘린더' && selectedCalendarDay
    ? `${dashboard.calendar.month}월 ${selectedCalendarDay}일에 작성한 기록만 모아봤어요.`
    : undefined;

  const handleQueryChange = (nextQuery: string) => {
    setQuery(nextQuery);
    router.replace(setDiaryDashboardQueryParam(searchParams, { q: nextQuery, tab: activeTab, day: selectedCalendarDay }), {
      scroll: false,
    });
  };

  const handleTabChange = (nextTab: DiaryFilterTab) => {
    setActiveTab(nextTab);
    const nextDay = nextTab === '캘린더' ? selectedCalendarDay : undefined;
    router.replace(setDiaryDashboardQueryParam(searchParams, { q: query, tab: nextTab, day: nextDay }), { scroll: false });
  };

  const handleCalendarDaySelect = (nextDay: number) => {
    setActiveTab('캘린더');
    setSelectedCalendarDay(nextDay);
    router.replace(setDiaryDashboardQueryParam(searchParams, { q: query, tab: '캘린더', day: nextDay }), { scroll: false });
  };

  return (
    <AppShell>
      <div className="overflow-x-hidden pb-8" data-design="diary-dashboard">
        <DiarySearchBar value={query} onChange={handleQueryChange} />
        <DiaryFilterTabs activeTab={activeTab} onChange={handleTabChange} />
        {status === 'error' ? (
          <div className="mb-4 rounded-[24px] bg-white px-5 py-4 text-[13px] font-bold text-[#e85b6a] shadow-[0_14px_34px_rgba(31,42,68,0.07)]">
            다이어리 데이터를 불러오지 못했어요. 임시 데이터로 화면을 보여드릴게요.
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
        <DiaryRecentListSection
          items={visibleDiaries}
          title={activeTab === '캘린더' && selectedCalendarDay ? `${selectedCalendarDay}일 다이어리` : '최근 작성한 다이어리'}
          description={selectedCalendarDescription}
        />
      </div>
    </AppShell>
  );
}
