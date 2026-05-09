import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { describe, it } from 'node:test';

function source(path: string) {
  return readFileSync(new URL(path, import.meta.url), 'utf8');
}

const globalSource = source('./globals.css');
const landingSource = source('../components/auth/AuthenticatedLanding.tsx');
const headerSource = source('../components/layout/DavasHeader.tsx');
const appShellSource = source('../components/layout/AppShell.tsx');
const tabBarSource = source('../components/layout/BottomTabBar.tsx');
const dashboardSource = source('../components/home/HomeDashboard.tsx');
const archiveSectionSource = source('../components/home/ArchiveHighlightSection.tsx');
const statsGridSource = source('../components/home/HomeStatsGrid.tsx');
const favoriteMoviesSource = source('../components/home/FavoriteMoviesSection.tsx');
const mediaPosterRowSource = source('../components/home/MediaPosterRowSection.tsx');
const monthlyCalendarSource = source('../components/home/MonthlyWatchCalendarSection.tsx');
const recentRecordsSource = source('../components/home/RecentRecordsSection.tsx');
const homeUtilsSource = source('../components/home/home-utils.ts');
const placeholderSource = source('../components/layout/PlaceholderPage.tsx');
const middlewareSource = source('../middleware.ts');
const mediaDetailLoadingIndicatorSource = source('../components/media/MediaDetailLoadingIndicator.tsx');
const mediaHeroCarouselSource = source('../components/media/MediaHeroCarousel.tsx');

describe('Davas authenticated home design', () => {
  it('renders the authenticated landing through a live-data home dashboard without mock content', () => {
    assert.match(landingSource, /HomeDashboard/);
    assert.match(landingSource, /getDiaryDashboard/);
    assert.match(archiveSectionSource, /For Your Archive/);
    assert.match(archiveSectionSource, /MediaHeroCarousel/);
    assert.match(archiveSectionSource, /buildArchiveHeroItems/);
    assert.match(mediaHeroCarouselSource, /export type MediaHeroCarouselItem/);
    assert.match(mediaHeroCarouselSource, /imageVariant: 'poster' \| 'backdrop'/);
    assert.match(dashboardSource, /HomeDashboardView/);
    assert.match(landingSource, /MediaDetailLoadingIndicator/);
    assert.match(landingSource, /label="인증 상태를 확인하는 중"/);
    assert.doesNotMatch(landingSource, /인증 상태를 확인하고 있습니다/);
    assert.match(mediaDetailLoadingIndicatorSource, /fullScreen\?: boolean/);
    assert.match(dashboardSource, /ArchiveHighlightSection item=\{view\.archiveHighlight\}/);
    assert.match(dashboardSource, /HomeStatsGrid stats=\{view\.stats\}/);
    assert.match(dashboardSource, /FavoriteMoviesSection movies=\{view\.favorites\}/);
    assert.match(dashboardSource, /MonthlyWatchCalendarSection/);
    assert.match(dashboardSource, /RecentRecordsSection records=\{view\.recentRecords\}/);
    assert.match(favoriteMoviesSource, /내가 가장 사랑한 영화/);
    assert.match(favoriteMoviesSource, /MediaPosterRowSection/);
    assert.match(monthlyCalendarSource, /이번 달 관람 기록/);
    assert.match(recentRecordsSource, /최근 기록/);
    assert.doesNotMatch(dashboardSource, /\/images\/mock|인터스텔라|별빛이 머무는 밤|저 먼 우주에서|watchedDays = new Set|calendarDays = \[/);
  });

  it('splits reusable home regions into dedicated components with injectable props and utilities', () => {
    for (const componentName of [
      'ArchiveHighlightSection',
      'HomeStatsGrid',
      'FavoriteMoviesSection',
      'MonthlyWatchCalendarSection',
      'RecentRecordsSection',
    ]) {
      assert.match(dashboardSource, new RegExp(`<${componentName}`));
    }
    assert.match(archiveSectionSource, /type ArchiveHighlightSectionProps/);
    assert.match(statsGridSource, /type HomeStatsGridProps/);
    assert.match(favoriteMoviesSource, /type FavoriteMoviesSectionProps/);
    assert.match(monthlyCalendarSource, /type MonthlyWatchCalendarSectionProps/);
    assert.match(recentRecordsSource, /type RecentRecordsSectionProps/);
    assert.match(homeUtilsSource, /export function cn/);
    assert.match(homeUtilsSource, /export function getCalendarDayState/);
    assert.doesNotMatch(dashboardSource, /<section className=/);
  });

  it('keeps the top header and bottom tab bar as shared layout components', () => {
    assert.match(headerSource, /export function DavasHeader/);
    assert.match(headerSource, /function DavasLogoMark/);
    assert.match(headerSource, /data-design="davas-horizontal-logo"/);
    assert.match(headerSource, /\/images\/davas-logo-horizontal\.png/);
    assert.doesNotMatch(headerSource, /<path\s+d="M2\.8 3\.2/);
    assert.match(headerSource, /aria-label="메뉴 열기"/);
    assert.match(headerSource, /data-design="profile-avatar"/);
    assert.match(headerSource, /h-\[64px\]/);
    assert.match(headerSource, /fixed/);
    assert.match(headerSource, /top-0/);
    assert.match(headerSource, /left-1\/2/);
    assert.match(headerSource, /-translate-x-1\/2/);
    assert.match(headerSource, /z-\[60\]/);
    assert.match(headerSource, /w-full max-w-\[430px\]/);
    assert.match(headerSource, /bg-\[#f6f8fc\]\/95/);
    assert.match(headerSource, /backdrop-blur/);
    assert.match(headerSource, /useState/);
    assert.match(headerSource, /useEffect/);
    assert.match(headerSource, /isElevated/);
    assert.match(headerSource, /window\.scrollY > 0/);
    assert.match(headerSource, /data-elevated=\{isElevated\}/);
    assert.match(headerSource, /isElevated\s*\?\s*'shadow-\[0_8px_22px_rgba\(31,42,68,0\.06\)\]/);
    assert.match(headerSource, /:\s*'shadow-none'/);
    assert.match(headerSource, /data-design="sticky-header-gradient"/);
    assert.match(headerSource, /isElevated \? 'opacity-100' : 'opacity-0'/);
    assert.match(headerSource, /-bottom-5/);
    assert.match(headerSource, /h-5/);
    assert.match(headerSource, /bg-\[linear-gradient\(180deg,rgba\(246,248,252,0\.72\)_0%,rgba\(246,248,252,0\)_100%\)\]/);
    assert.match(headerSource, /pointer-events-none/);
    assert.match(headerSource, /transition-opacity/);
    assert.doesNotMatch(headerSource, /backdrop-blur min-\[390px\]:px-6">/);
    assert.match(headerSource, /px-5 min-\[390px\]:px-6/);
    assert.match(headerSource, /h-\[34px\]/);
    assert.match(headerSource, /w-auto/);
    assert.match(headerSource, /h-9 w-9/);
    assert.match(headerSource, /h-10 w-10/);
    assert.doesNotMatch(headerSource, /h-\[74px\]/);
    assert.doesNotMatch(headerSource, /width="38" height="38"/);
    assert.doesNotMatch(headerSource, /text-\[26px\]/);
    assert.match(appShellSource, /pt-\[64px\]/);
    assert.match(tabBarSource, /export function BottomTabBar/);
    assert.match(tabBarSource, /fixed/);
    assert.match(tabBarSource, /bottom-0/);
    assert.match(tabBarSource, /renderTabIcon/);
    assert.doesNotMatch(tabBarSource, /icon: '[⌂⌕♚▤◔]'/);
    assert.match(tabBarSource, /홈/);
    assert.match(tabBarSource, /탐색/);
    assert.match(tabBarSource, /커뮤니티/);
    assert.match(tabBarSource, /다이어리/);
    assert.match(tabBarSource, /프로필/);
  });

  it('adds temporary pages for non-home bottom navigation routes', () => {
    assert.match(placeholderSource, /임시 페이지/);
    for (const route of ['/explore', '/community', '/diary']) {
      assert.match(tabBarSource, new RegExp(`href: '${route}'`));
    }
  });

  it('uses designed SVG icons for statistic cards while archive actions stay text-only and actionable', () => {
    assert.match(statsGridSource, /function StatIcon/);
    assert.match(archiveSectionSource, /MediaHeroCarousel/);
    assert.match(dashboardSource, /posterUrl: item\.posterUrl/);
    assert.match(archiveSectionSource, /mediaId: item\.mediaId/);
    assert.match(dashboardSource, /diaryId: latestItem\.id/);
    assert.match(dashboardSource, /mediaId: latestItem\.mediaId/);
    assert.match(mediaHeroCarouselSource, /w-\[126px\]/);
    assert.match(mediaHeroCarouselSource, /h-\[154px\]/);
    assert.match(mediaHeroCarouselSource, /archive-action-row/);
    assert.match(statsGridSource, /NotebookIcon/);
    assert.match(statsGridSource, /CalendarWatchIcon/);
    assert.match(statsGridSource, /MasksIcon/);
    assert.match(archiveSectionSource, /label: '수정하기'/);
    assert.match(archiveSectionSource, /router\.push\(`\/diary\/\$\{item\.diaryId\}\/edit`\)/);
    assert.match(archiveSectionSource, /label: '상세보기'/);
    assert.match(archiveSectionSource, /getMediaDetail\(item\.mediaId\)/);
    assert.match(archiveSectionSource, /MediaDetailModal/);
    assert.doesNotMatch(archiveSectionSource, /ContinueWritingIcon/);
    assert.doesNotMatch(archiveSectionSource, /기록 이어쓰기/);
    assert.doesNotMatch(dashboardSource + archiveSectionSource + statsGridSource, /icon: '[▤▶★◈]'/);
  });

  it('matches the archive card visual treatment from the supplied design', () => {
    assert.match(mediaHeroCarouselSource, /archive-gradient-card/);
    assert.match(archiveSectionSource, /linear-gradient\(145deg,#ffffff_0%,#f7fbff_48%,#eef6ff_100%\)/);
    assert.match(mediaHeroCarouselSource, /archive-primary-action/);
    assert.match(mediaHeroCarouselSource, /bg-\[#2f7eea\]/);
    assert.match(mediaHeroCarouselSource, /h-\[34px\]/);
    assert.match(mediaHeroCarouselSource, /archive-secondary-action/);
    assert.match(mediaHeroCarouselSource, /bg-white|bg-\[#fbfdff\]/);
    assert.match(mediaHeroCarouselSource, /carousel-indicator/);
    assert.match(mediaHeroCarouselSource, /w-\[22px\]/);
    assert.match(mediaHeroCarouselSource, /bg-\[#dbe5f3\]/);
    assert.match(mediaHeroCarouselSource, /text-\[13px\] font-extrabold leading-\[18px\] text-\[#236fd7\]/);
    assert.match(mediaHeroCarouselSource, /text-\[25px\] font-black leading-\[29px\] tracking-\[-0\.04em\] text-\[#132b55\]/);
    assert.match(mediaHeroCarouselSource, /text-\[12px\] font-bold leading-\[16px\] text-\[#8b96a8\]|text-\[12px\] font-bold leading-\[16px\] text-\[#8d98a8\]/);
    assert.match(mediaHeroCarouselSource, /text-\[12px\] font-semibold leading-\[18px\] text-\[#747f91\]|text-\[12px\] font-semibold leading-\[18px\] text-\[#788395\]/);
  });

  it('matches the supplied 2x2 statistic-card design treatment', () => {
    assert.match(statsGridSource, /stats-grid/);
    assert.match(statsGridSource, /grid-cols-2 gap-\[10px\]/);
    assert.match(statsGridSource, /stat-card/);
    assert.match(statsGridSource, /min-h-\[76px\]/);
    assert.match(statsGridSource, /rounded-\[18px\]/);
    assert.match(statsGridSource, /shadow-\[0_5px_14px_rgba\(21,38,69,0\.07\)\]/);
    assert.match(statsGridSource, /stat-icon-circle/);
    assert.match(statsGridSource, /h-\[42px\] w-\[42px\]/);
    assert.match(statsGridSource, /data-design="stat-diary-icon"/);
    assert.match(statsGridSource, /data-design="stat-calendar-icon"/);
    assert.match(statsGridSource, /data-design="stat-rating-icon"/);
    assert.match(statsGridSource, /data-design="stat-genre-icon"/);
    assert.match(statsGridSource, /stat-icon-circle-blue/);
    assert.match(statsGridSource, /stat-icon-circle-red/);
    assert.match(statsGridSource, /text-\[12px\] font-bold text-\[#243047\]/);
    assert.match(statsGridSource, /text-\[21px\] font-extrabold leading-\[24px\] tracking-\[-0\.03em\] text-\[#111827\]/);
    assert.match(statsGridSource, /text-\[10px\] font-semibold leading-\[12px\] text-\[#9aa4b2\]/);
    assert.match(dashboardSource, /averageRating\.toFixed\(1\)\} \/ 5\.0/);
    assert.doesNotMatch(dashboardSource + statsGridSource, /4\.6 \/5\.0/);
  });

  it('uses a Korean app typography system close to the supplied mockup', () => {
    assert.match(globalSource, /pretendardvariable-dynamic-subset\.css/);
    assert.match(globalSource, /font-family:\s*'Pretendard Variable', Pretendard, -apple-system, BlinkMacSystemFont, system-ui, sans-serif/);
    assert.match(globalSource, /letter-spacing:\s*-0\.018em/);
    assert.match(globalSource, /font-feature-settings:\s*'kern'/);
    assert.match(globalSource, /text-rendering:\s*optimizeLegibility/);
    assert.match(dashboardSource, /text-\[13px\] font-semibold leading-\[18px\] text-\[#9aa6b8\]/);
    assert.match(mediaHeroCarouselSource, /text-\[13px\] font-extrabold leading-\[18px\] text-\[#236fd7\]/);
    assert.match(mediaHeroCarouselSource, /text-\[25px\] font-black leading-\[29px\] tracking-\[-0\.04em\] text-\[#132b55\]/);
    assert.match(mediaHeroCarouselSource, /text-\[12px\] font-bold leading-\[16px\] text-\[#8b96a8\]|text-\[12px\] font-bold leading-\[16px\] text-\[#8d98a8\]/);
    assert.match(mediaHeroCarouselSource, /text-\[12px\] font-semibold leading-\[18px\] text-\[#747f91\]|text-\[12px\] font-semibold leading-\[18px\] text-\[#788395\]/);
    assert.match(mediaPosterRowSource + monthlyCalendarSource + recentRecordsSource, /text-\[16px\] font-extrabold leading-\[22px\] tracking-\[-0\.02em\] text-\[#1f2a44\]/);
    assert.match(statsGridSource, /text-\[21px\] font-extrabold leading-\[24px\] tracking-\[-0\.03em\] text-\[#111827\]/);
    assert.match(tabBarSource, /text-\[11px\] font-bold leading-\[14px\]/);
  });

  it('uses the design-system tone and responsive mobile shell without page-level horizontal overflow', () => {
    assert.match(globalSource, /overflow-x:\s*hidden/);
    assert.match(appShellSource, /bg-\[#f6f8fc\]/);
    assert.match(appShellSource, /max-w-\[430px\]/);
    assert.match(appShellSource, /overflow-x-hidden/);
    assert.match(appShellSource, /px-4/);
    assert.match(appShellSource, /min-\[390px\]:px-5/);
    assert.match(archiveSectionSource + monthlyCalendarSource + recentRecordsSource, /card-surface/);
    assert.match(archiveSectionSource + statsGridSource + monthlyCalendarSource + recentRecordsSource, /max-\[374px\]:/);
    assert.match(mediaHeroCarouselSource, /max-\[374px\]:text-\[22px\]/);
    assert.match(mediaPosterRowSource, /-mx-4 overflow-x-auto px-4/);
    assert.match(mediaPosterRowSource, /min-\[390px\]:-mx-5 min-\[390px\]:px-5/);
  });

  it('keeps the archive poster image cropped from the visual center', () => {
    assert.match(mediaHeroCarouselSource, /data-design="archive-poster"/);
    assert.match(mediaHeroCarouselSource, /object-cover object-center/);
    assert.match(mediaHeroCarouselSource, /object-center/);
  });
});
