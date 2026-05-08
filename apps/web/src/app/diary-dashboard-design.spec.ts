import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { describe, it } from 'node:test';

function source(path: string) {
  return readFileSync(new URL(path, import.meta.url), 'utf8');
}

function optionalSource(path: string) {
  const url = new URL(path, import.meta.url);
  return existsSync(url) ? readFileSync(url, 'utf8') : '';
}

const diaryPageSource = source('./diary/page.tsx');
const diaryDashboardSource = optionalSource('../components/diary/DiaryDashboard.tsx');
const diaryApiSource = optionalSource('../lib/api/diaries.ts');
const diarySearchBarSource = optionalSource('../components/diary/DiarySearchBar.tsx');
const diaryFilterTabsSource = optionalSource('../components/diary/DiaryFilterTabs.tsx');
const diarySummarySectionSource = optionalSource('../components/diary/DiarySummarySection.tsx');
const diaryInsightGridSource = optionalSource('../components/diary/DiaryInsightGrid.tsx');
const diaryMonthlyCalendarSource = optionalSource('../components/diary/DiaryMonthlyCalendarCard.tsx');
const diaryGenreRatioSource = optionalSource('../components/diary/DiaryGenreRatioCard.tsx');
const diaryRecentListSource = optionalSource('../components/diary/DiaryRecentListSection.tsx');
const diaryListItemSource = optionalSource('../components/diary/DiaryListItem.tsx');
const newDiaryFloatingButtonSource = optionalSource('../components/diary/NewDiaryFloatingButton.tsx');
const diaryUtilsSource = optionalSource('../components/diary/diary-dashboard-utils.ts');
const appShellSource = optionalSource('../components/layout/AppShell.tsx');

describe('Davas diary dashboard design', () => {
  it('routes /diary to the designed diary dashboard instead of a placeholder', () => {
    assert.match(diaryPageSource, /DiaryDashboard/);
    assert.doesNotMatch(diaryPageSource, /PlaceholderPage/);
  });

  it('splits the diary dashboard into reusable mobile sections', () => {
    assert.match(diaryDashboardSource, /export function DiaryDashboard/);
    for (const componentName of [
      'DiarySearchBar',
      'DiaryFilterTabs',
      'DiarySummarySection',
      'DiaryInsightGrid',
      'DiaryRecentListSection',
    ]) {
      assert.match(diaryDashboardSource, new RegExp(componentName));
    }
    assert.match(diarySearchBarSource, /export function DiarySearchBar/);
    assert.match(diaryFilterTabsSource, /export function DiaryFilterTabs/);
    assert.match(diarySummarySectionSource, /export function DiarySummarySection/);
    assert.match(diaryInsightGridSource, /export function DiaryInsightGrid/);
    assert.match(diaryRecentListSource, /export function DiaryRecentListSection/);
    assert.match(newDiaryFloatingButtonSource, /export function NewDiaryFloatingButton/);
  });

  it('matches the supplied diary tab information architecture', () => {
    assert.match(diarySearchBarSource, /다이어리 제목이나 영화 제목으로 검색해보세요/);
    for (const tab of ['전체', '최근', '평점순', '캘린더']) {
      assert.match(diaryFilterTabsSource, new RegExp(tab));
    }
    for (const summaryLabel of ['전체 기록', '이번 달', '평균 평점', '최다 장르']) {
      assert.match(diarySummarySectionSource, new RegExp(summaryLabel));
    }
    assert.match(diarySummarySectionSource, /나의 다이어리 요약/);
    assert.match(diaryMonthlyCalendarSource, /이번 달 기록 캘린더/);
    assert.match(diaryGenreRatioSource, /장르별 기록 비율/);
    assert.match(diaryRecentListSource, /최근 작성한 다이어리/);
    assert.doesNotMatch(diaryDashboardSource, /NewDiaryFloatingButton/);
    assert.doesNotMatch(diaryDashboardSource, /새 다이어리/);
  });

  it('keeps the diary search bar focused on text search without a right drawer icon', () => {
    assert.match(diarySearchBarSource, /type="search"/);
    assert.match(diarySearchBarSource, /다이어리 제목이나 영화 제목으로 검색해보세요/);
    assert.doesNotMatch(diarySearchBarSource, /다이어리 상세 필터/);
    assert.doesNotMatch(diarySearchBarSource, /☰/);
    assert.doesNotMatch(diarySearchBarSource, /<button[^>]*aria-label="다이어리 상세 필터"/);
  });

  it('keeps the diary dashboard inside the shared mobile app shell with header and bottom tab bar', () => {
    assert.match(diaryDashboardSource, /import \{ AppShell \} from '\.\.\/layout\/AppShell'/);
    assert.match(diaryDashboardSource, /<AppShell>/);
    assert.match(diaryDashboardSource, /<\/AppShell>/);
    assert.match(appShellSource, /max-w-\[430px\]/);
    assert.match(appShellSource, /<DavasHeader \/>/);
    assert.match(appShellSource, /<BottomTabBar \/>/);
  });

  it('keeps the diary dashboard mobile-safe and accessible', () => {
    assert.match(diaryDashboardSource, /overflow-x-hidden/);
    assert.match(diaryListItemSource, /min-w-0/);
    assert.match(diaryListItemSource, /line-clamp-2/);
    assert.match(diaryFilterTabsSource, /aria-pressed=\{tab === activeTab\}/);
    assert.match(diaryFilterTabsSource, /aria-label=\{`\$\{tab\} 다이어리 필터`\}/);
    assert.match(diaryGenreRatioSource, /role="progressbar"/);
    assert.match(diaryGenreRatioSource, /aria-valuenow=\{item\.percentage\}/);
    assert.match(diaryMonthlyCalendarSource, /aria-selected=\{day\.selected\}/);
    assert.doesNotMatch(diaryDashboardSource, /<NewDiaryFloatingButton \/>/);
    assert.doesNotMatch(newDiaryFloatingButtonSource, /href="\/diary\/new"/);
    assert.doesNotMatch(newDiaryFloatingButtonSource, /새 다이어리/);
  });

  it('uses diary dashboard utilities for calendar state instead of inline date math', () => {
    assert.match(diaryUtilsSource, /export function getDiaryCalendarDays/);
    assert.match(diaryMonthlyCalendarSource, /getDiaryCalendarDays/);
    assert.doesNotMatch(diaryMonthlyCalendarSource, /new Date\([^)]*\)\.getDay\(\)/);
  });

  it('supports Slice 2 client-side diary search, tab state, and empty results', () => {
    assert.match(diaryDashboardSource, /useSearchParams/);
    assert.match(diaryDashboardSource, /useRouter/);
    assert.match(diaryDashboardSource, /setDiaryDashboardQueryParam/);
    assert.match(diaryDashboardSource, /activeTab/);
    assert.match(diaryDashboardSource, /filterDiaryItems/);
    assert.match(diaryRecentListSource, /검색 결과가 없어요/);
    assert.match(diaryRecentListSource, /다른 제목이나 작품명으로 다시 검색해보세요/);
  });

  it('loads Slice 3 diary dashboard data through the backend API with safe fallback states', () => {
    assert.match(diaryPageSource, /Suspense/);
    assert.match(diaryPageSource, /<Suspense fallback=\{null\}>/);
    assert.match(diaryApiSource, /export async function getDiaryDashboard/);
    assert.match(diaryApiSource, /\/diaries\/dashboard/);
    assert.match(diaryDashboardSource, /getDiaryDashboard/);
    assert.match(diaryDashboardSource, /DiaryDashboardStatus/);
    assert.match(diaryDashboardSource, /useEffect/);
    assert.match(diaryDashboardSource, /다이어리 데이터를 불러오지 못했어요/);
    assert.doesNotMatch(diaryDashboardSource, /const data = dashboard \? dashboard : fixtureDiaryDashboard/);
  });

  it('supports Slice 4 calendar-day drilldown with URL state and filtered diary results', () => {
    assert.match(diaryDashboardSource, /selectedCalendarDay/);
    assert.match(diaryDashboardSource, /toCalendarDay\(searchParams\.get\('day'\)\)/);
    assert.match(diaryDashboardSource, /handleCalendarDaySelect/);
    assert.match(diaryDashboardSource, /setDiaryDashboardQueryParam\(searchParams, \{ q: query, tab: '캘린더', day: nextDay \}\)/);
    assert.match(diaryDashboardSource, /filterDiaryItems\(dashboard\.recentItems, query, activeTab, selectedCalendarDay\)/);
    assert.match(diaryInsightGridSource, /onDaySelect/);
    assert.match(diaryMonthlyCalendarSource, /onDaySelect\?: \(day: number\) => void/);
    assert.match(diaryMonthlyCalendarSource, /disabled=\{!day\.currentMonth\}/);
    assert.match(diaryUtilsSource, /selectedDay\?: number/);
    assert.match(diaryUtilsSource, /tab === '캘린더' && selectedDay/);
    assert.match(diaryUtilsSource, /params\.set\('day', String\(day\)\)/);
    assert.match(diaryUtilsSource, /params\.delete\('day'\)/);
    assert.match(diaryRecentListSource, /description\?: string/);
  });
});
