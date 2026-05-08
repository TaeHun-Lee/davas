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
      'NewDiaryFloatingButton',
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
    assert.match(newDiaryFloatingButtonSource, /href="\/diary\/new"/);
    assert.match(newDiaryFloatingButtonSource, /새 다이어리/);
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
    assert.match(newDiaryFloatingButtonSource, /fixed inset-x-0 bottom-\[92px\]/);
    assert.match(newDiaryFloatingButtonSource, /max-w-\[430px\]/);
  });

  it('uses diary dashboard utilities for calendar state instead of inline date math', () => {
    assert.match(diaryUtilsSource, /export function getDiaryCalendarDays/);
    assert.match(diaryMonthlyCalendarSource, /getDiaryCalendarDays/);
    assert.doesNotMatch(diaryMonthlyCalendarSource, /new Date\([^)]*\)\.getDay\(\)/);
  });
});
