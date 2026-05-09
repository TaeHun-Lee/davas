import type { DiaryDashboardView, DiaryListItemView } from '../diary/diary-dashboard-types';
import { ArchiveHighlight, ArchiveHighlightSection } from './ArchiveHighlightSection';
import { FavoriteMovie, FavoriteMoviesSection } from './FavoriteMoviesSection';
import { HomeStat, HomeStatsGrid } from './HomeStatsGrid';
import { MonthlyWatchCalendarSection } from './MonthlyWatchCalendarSection';
import { RecentRecord, RecentRecordsSection } from './RecentRecordsSection';
import { AppShell } from '../layout/AppShell';

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

function SearchIcon() {
  return (
    <svg width="19" height="19" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <circle cx="8.8" cy="8.8" r="5.7" stroke="#216BD8" strokeWidth="2" />
      <path d="m13.3 13.3 3.6 3.6" stroke="#216BD8" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  );
}

function HomeSearchBar() {
  return (
    <div className="card-surface rounded-[18px] px-4 py-3">
      <div className="flex items-center gap-3 text-[13px] font-semibold leading-[18px] text-[#9aa6b8]">
        <SearchIcon />
        <span>영화나 드라마를 검색해보세요</span>
      </div>
    </div>
  );
}

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
  return (
    <AppShell nickname={user?.nickname}>
      <HomeSearchBar />
      <ArchiveHighlightSection item={view.archiveHighlight} />
      <HomeStatsGrid stats={view.stats} />
      {view.favorites.length > 0 ? <FavoriteMoviesSection movies={view.favorites} /> : null}
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
  );
}
