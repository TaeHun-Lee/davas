'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { getDiaryDashboard } from '../../lib/api/diaries';
import { DiaryFilterTabs } from './DiaryFilterTabs';
import { DiaryInsightGrid } from './DiaryInsightGrid';
import { DiaryRecentListSection } from './DiaryRecentListSection';
import { DiarySearchBar } from './DiarySearchBar';
import { DiarySummarySection } from './DiarySummarySection';
import { NewDiaryFloatingButton } from './NewDiaryFloatingButton';
import { fixtureDiaryDashboard } from './diary-dashboard-fixtures';
import { filterDiaryItems, setDiaryDashboardQueryParam } from './diary-dashboard-utils';
import type { DiaryDashboardView, DiaryFilterTab } from './diary-dashboard-types';

export type DiaryDashboardStatus = 'loading' | 'ready' | 'error';

const filterTabs = new Set<DiaryFilterTab>(['전체', '최근', '평점순', '캘린더']);

function toFilterTab(value: string | null): DiaryFilterTab {
  return filterTabs.has(value as DiaryFilterTab) ? (value as DiaryFilterTab) : '전체';
}

export function DiaryDashboard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [dashboard, setDashboard] = useState<DiaryDashboardView>(fixtureDiaryDashboard);
  const [status, setStatus] = useState<DiaryDashboardStatus>('loading');
  const [query, setQuery] = useState(searchParams.get('q') ?? '');
  const [activeTab, setActiveTab] = useState<DiaryFilterTab>(toFilterTab(searchParams.get('tab')));

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
    setQuery(nextQuery);
    setActiveTab(nextTab);
  }, [searchParams]);

  const visibleDiaries = useMemo(
    () => filterDiaryItems(dashboard.recentItems, query, activeTab),
    [dashboard.recentItems, query, activeTab],
  );

  const handleQueryChange = (nextQuery: string) => {
    setQuery(nextQuery);
    router.replace(setDiaryDashboardQueryParam(searchParams, { q: nextQuery, tab: activeTab }), { scroll: false });
  };

  const handleTabChange = (nextTab: DiaryFilterTab) => {
    setActiveTab(nextTab);
    router.replace(setDiaryDashboardQueryParam(searchParams, { q: query, tab: nextTab }), { scroll: false });
  };

  return (
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
        selectedDay={dashboard.calendar.selectedDay}
        calendarMarkers={dashboard.calendar.markers}
        genreRatios={dashboard.genreRatios}
      />
      <DiaryRecentListSection items={visibleDiaries} />
      <NewDiaryFloatingButton />
    </div>
  );
}
