import { ArchiveHighlight, ArchiveHighlightSection } from './ArchiveHighlightSection';
import { FavoriteMovie, FavoriteMoviesSection } from './FavoriteMoviesSection';
import { HomeStat, HomeStatsGrid } from './HomeStatsGrid';
import { MonthlyWatchCalendarSection } from './MonthlyWatchCalendarSection';
import { RecentRecord, RecentRecordsSection } from './RecentRecordsSection';
import { AppShell } from '../layout/AppShell';

type HomeDashboardProps = {
  user?: {
    nickname: string;
    email: string;
  };
};

const archiveHighlight: ArchiveHighlight = {
  posterSrc: '/images/mock/interstellar-poster.jpg',
  posterAlt: '인터스텔라 포스터',
  eyebrow: '최근에 본 영화',
  title: '인터스텔라',
  meta: 'SF · 2014',
  quote: '우린 답을 찾을 것이다. 늘 그랬듯이.',
};

const stats: HomeStat[] = [
  { label: '전체 다이어리', value: '128', unit: '개', helper: '모든 기록의 합계', kind: 'diary' },
  { label: '이번 달 관람 수', value: '18', unit: '편', helper: '이번 달 기록한 작품 수', kind: 'watch' },
  { label: '평균 평점', value: '4.6 / 5.0', helper: '지금까지의 평균 평점', kind: 'rating' },
  { label: '최다 장르', value: '드라마', helper: '가장 많이 기록한 장르', kind: 'genre' },
];

const favorites: FavoriteMovie[] = [
  { title: '별빛이 머무는 밤', meta: '드라마 · 2022', rating: '4.9', gradient: 'from-[#26245a] via-[#6c58bc] to-[#f7a7d8]' },
  { title: '파도 너머로', meta: '드라마 · 2021', rating: '4.8', gradient: 'from-[#0c315e] via-[#3b82bd] to-[#f3d59c]' },
  { title: '저 먼 우주에서', meta: 'SF · 2023', rating: '4.8', gradient: 'from-[#07111f] via-[#184a85] to-[#8cc7ff]' },
  { title: '비 오는 오후', meta: '로맨스 · 2020', rating: '4.7', gradient: 'from-[#314057] via-[#8b715f] to-[#ffd7a8]' },
  { title: '시네마 천국', meta: '드라마 · 1988', rating: '4.6', gradient: 'from-[#16171d] via-[#3f4656] to-[#bc8b62]' },
];

const recentRecords: RecentRecord[] = [
  { title: '저 먼 우주에서', desc: '우주 속에서 인간의 외로움과 희망을 아름답게 그린 작품.', date: '2024.05.29', rating: '4.5', gradient: 'from-[#07111f] via-[#184a85] to-[#8cc7ff]' },
  { title: '비 오는 오후', desc: '잔잔한 감성과 따뜻한 위로가 마음에 남았다.', date: '2024.05.27', rating: '4.0', gradient: 'from-[#314057] via-[#8b715f] to-[#ffd7a8]' },
  { title: '파도 너머로', desc: '삶의 방향을 다시 생각하게 만든 영화.', date: '2024.05.24', rating: '4.5', gradient: 'from-[#0c315e] via-[#3b82bd] to-[#f3d59c]' },
  { title: '별빛이 머무는 밤', desc: '섬세한 연출과 대사가 인상 깊었다.', date: '2024.05.21', rating: '4.0', gradient: 'from-[#26245a] via-[#6c58bc] to-[#f7a7d8]' },
];

const watchedDays = new Set([2, 6, 8, 11, 14, 17, 21, 24, 27, 29]);
const diaryDays = new Set([2, 6, 14, 21, 24, 27]);
const calendarDays = [28, 29, 30, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 1];

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

export function HomeDashboard({ user }: HomeDashboardProps) {
  return (
    <AppShell nickname={user?.nickname}>
      <HomeSearchBar />
      <ArchiveHighlightSection item={archiveHighlight} />
      <HomeStatsGrid stats={stats} />
      <FavoriteMoviesSection movies={favorites} />
      <MonthlyWatchCalendarSection
        yearMonthLabel="2024년 5월"
        days={calendarDays}
        watchedDays={watchedDays}
        diaryDays={diaryDays}
        selectedDay={29}
      />
      <RecentRecordsSection records={recentRecords} />
    </AppShell>
  );
}
