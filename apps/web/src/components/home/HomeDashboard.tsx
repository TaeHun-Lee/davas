'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import type { DiaryDashboardView, DiaryListItemView } from '../diary/diary-dashboard-types';
import { ArchiveHighlight, ArchiveHighlightSection } from './ArchiveHighlightSection';
import { FavoriteMovie, FavoriteMoviesSection } from './FavoriteMoviesSection';
import { HomeStat, HomeStatsGrid } from './HomeStatsGrid';
import { MonthlyWatchCalendarSection } from './MonthlyWatchCalendarSection';
import { RecentRecord, RecentRecordsSection } from './RecentRecordsSection';
import { AppShell } from '../layout/AppShell';
import { SearchEntry } from '../common/SearchField';
import { MediaDetailModal } from '../media/MediaDetailModal';
import { getMediaDetail, type MediaDetail } from '../../lib/api/media';

export type HomeDashboardView = {
  archiveHighlight: ArchiveHighlight;
  stats: HomeStat[];
  favorites: FavoriteMovie[];
  calendar: {
    yearMonthLabel: string;
    days: number[];
    watchedDays: ReadonlySet<number>;
    diaryDays: ReadonlySet<number>;
    selectedDay: number;
    leadingDays: number;
    currentMonthDays: number;
  };
  recentRecords: RecentRecord[];
};

type HomeDashboardProps = {
  user?: {
    nickname: string;
    email: string;
  };
  view: HomeDashboardView;
};

const DEFAULT_POSTER_GRADIENT = 'from-[#e9eef7] via-[#f6f8fc] to-[#dfe8f5]';

function formatRating(rating: number) {
  return rating.toFixed(1);
}

function getPrimaryGenre(item: DiaryListItemView) {
  return item.genreNames[0] ?? '장르 정보 없음';
}

function getMediaMeta(item: DiaryListItemView) {
  return getPrimaryGenre(item);
}

function buildCalendarDays(year: number, month: number) {
  const leadingDays = new Date(year, month - 1, 1).getDay();
  const currentMonthDays = new Date(year, month, 0).getDate();
  const previousMonthDays = new Date(year, month - 1, 0).getDate();
  const totalSlots = Math.ceil((leadingDays + currentMonthDays) / 7) * 7;
  const days = Array.from({ length: totalSlots }, (_, index) => {
    if (index < leadingDays) return previousMonthDays - leadingDays + index + 1;
    if (index < leadingDays + currentMonthDays) return index - leadingDays + 1;
    return index - leadingDays - currentMonthDays + 1;
  });

  return { days, leadingDays, currentMonthDays };
}

export function buildHomeDashboardView(dashboard: DiaryDashboardView): HomeDashboardView {
  const recentItems = dashboard.recentItems;
  const latestItem = recentItems[0];
  const topRatedItems = [...recentItems]
    .sort((a, b) => b.rating - a.rating || Number(new Date(b.createdAt)) - Number(new Date(a.createdAt)))
    .slice(0, 10);
  const calendar = buildCalendarDays(dashboard.calendar.year, dashboard.calendar.month);
  const diaryDays = new Set(dashboard.calendar.markers.map((marker) => marker.day));

  return {
    archiveHighlight: latestItem
      ? {
          diaryId: latestItem.id,
          mediaId: latestItem.mediaId,
          posterSrc: latestItem.posterUrl ?? null,
          posterAlt: `${latestItem.mediaTitle} 포스터`,
          eyebrow: '최근에 기록한 작품',
          title: latestItem.mediaTitle,
          meta: getMediaMeta(latestItem),
          quote: latestItem.contentPreview || latestItem.diaryTitle,
        }
      : {
          posterSrc: null,
          posterAlt: '기록 대기 중인 포스터 영역',
          eyebrow: '아직 기록이 없어요',
          title: '첫 다이어리를 남겨보세요',
          meta: '실제 기록이 생기면 이곳에 표시됩니다',
          quote: '탐색 화면에서 작품을 고르고 감상을 기록해보세요.',
        },
    stats: [
      { label: '전체 다이어리', value: String(dashboard.summary.totalCount), unit: '개', helper: '모든 기록의 합계', kind: 'diary' },
      { label: '이번 달 관람 수', value: String(dashboard.summary.monthlyCount), unit: '편', helper: '이번 달 기록한 작품 수', kind: 'watch' },
      { label: '평균 평점', value: `${dashboard.summary.averageRating.toFixed(1)} / 5.0`, helper: '지금까지의 평균 평점', kind: 'rating' },
      { label: '최다 장르', value: dashboard.summary.topGenre?.name ?? '-', helper: '가장 많이 기록한 장르', kind: 'genre' },
    ],
    favorites: topRatedItems.map((item) => ({
      mediaId: item.mediaId,
      title: item.mediaTitle,
      meta: getMediaMeta(item),
      rating: formatRating(item.rating),
      gradient: item.posterGradient || DEFAULT_POSTER_GRADIENT,
      posterUrl: item.posterUrl,
    })),
    calendar: {
      yearMonthLabel: `${dashboard.calendar.year}년 ${dashboard.calendar.month}월`,
      days: calendar.days,
      watchedDays: diaryDays,
      diaryDays,
      selectedDay: dashboard.calendar.selectedDay ?? new Date().getDate(),
      leadingDays: calendar.leadingDays,
      currentMonthDays: calendar.currentMonthDays,
    },
    recentRecords: recentItems.slice(0, 5).map((item) => ({
      diaryId: item.id,
      title: item.mediaTitle,
      desc: item.contentPreview || item.diaryTitle,
      date: item.watchedDate,
      rating: formatRating(item.rating),
      gradient: item.posterGradient || DEFAULT_POSTER_GRADIENT,
      posterUrl: item.posterUrl,
    })),
  };
}

export function HomeDashboard({ user, view }: HomeDashboardProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const detailMediaId = searchParams.get('detail');
  const [selectedMedia, setSelectedMedia] = useState<MediaDetail | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function loadDetail() {
      if (!detailMediaId) {
        setIsDetailOpen(false);
        setSelectedMedia(null);
        return;
      }
      const mediaDetail = await getMediaDetail(detailMediaId);
      if (!isMounted) return;
      setSelectedMedia(mediaDetail);
      setIsDetailOpen(true);
    }

    void loadDetail();
    return () => {
      isMounted = false;
    };
  }, [detailMediaId]);

  function openHomeMediaDetail(mediaId?: string) {
    if (!mediaId) return;
    router.push(`/?detail=${encodeURIComponent(mediaId)}`, { scroll: false });
  }

  function closeHomeMediaDetail() {
    setIsDetailOpen(false);
    setSelectedMedia(null);
    router.replace('/', { scroll: false });
  }

  return (
    <>
      <AppShell nickname={user?.nickname}>
        <SearchEntry href="/explore" placeholder="영화나 드라마를 검색해보세요" ariaLabel="탐색에서 영화나 드라마 검색하기" className="text-[13px] font-semibold leading-[18px] text-[#9aa6b8]" />
        <ArchiveHighlightSection item={view.archiveHighlight} onDetailSelect={openHomeMediaDetail} />
        <HomeStatsGrid stats={view.stats} />
        {view.favorites.length > 0 ? <FavoriteMoviesSection movies={view.favorites} onDetailSelect={openHomeMediaDetail} /> : null}
        <MonthlyWatchCalendarSection
          yearMonthLabel={view.calendar.yearMonthLabel}
          days={view.calendar.days}
          watchedDays={view.calendar.watchedDays}
          diaryDays={view.calendar.diaryDays}
          selectedDay={view.calendar.selectedDay}
          leadingDays={view.calendar.leadingDays}
          currentMonthDays={view.calendar.currentMonthDays}
        />
        {view.recentRecords.length > 0 ? <RecentRecordsSection records={view.recentRecords} /> : null}
      </AppShell>
      {selectedMedia ? <MediaDetailModal media={selectedMedia} isOpen={isDetailOpen} onClose={closeHomeMediaDetail} returnTo="/" /> : null}
    </>
  );
}
