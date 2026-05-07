import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { describe, it } from 'node:test';

function source(path: string) {
  return readFileSync(new URL(path, import.meta.url), 'utf8');
}

const explorePageSource = source('./explore/page.tsx');
const exploreDashboardSource = source('../components/explore/ExploreDashboard.tsx');
const tabBarSource = source('../components/layout/BottomTabBar.tsx');
const mediaPosterRowSource = source('../components/home/MediaPosterRowSection.tsx');
const favoriteMoviesSource = source('../components/home/FavoriteMoviesSection.tsx');
const mediaApiSource = source('../lib/api/media.ts');
const mediaSearchResultsSource = source('../components/media/MediaSearchResults.tsx');
const selectedMediaPanelSource = source('../components/media/SelectedMediaPanel.tsx');
const useMediaSearchSource = source('../hooks/useMediaSearch.ts');

describe('Davas explore screen design', () => {
  it('routes /explore to the designed explore dashboard instead of a placeholder', () => {
    assert.match(explorePageSource, /ExploreDashboard/);
    assert.doesNotMatch(explorePageSource, /PlaceholderPage/);
    assert.match(exploreDashboardSource, /AppShell/);
  });

  it('matches the supplied explore search and category filter design', () => {
    assert.match(exploreDashboardSource, /use client/);
    assert.match(exploreDashboardSource, /useMediaSearch/);
    assert.match(exploreDashboardSource, /value=\{searchQuery\}/);
    assert.match(exploreDashboardSource, /onChange=\{/);
    assert.match(exploreDashboardSource, /영화, 드라마, 배우를 검색해보세요/);
    for (const chip of ['전체', '영화', '드라마', '배우', '감독', '장르', '평점순']) {
      assert.match(exploreDashboardSource, new RegExp(chip));
    }
    assert.match(exploreDashboardSource, /explore-filter-row/);
    assert.match(exploreDashboardSource, /bg-\[#216bd8\]/);
    assert.match(exploreDashboardSource, /rounded-full/);
  });

  it('calls the backend media search API with Korean and English capable query params', () => {
    assert.match(mediaApiSource, /URLSearchParams/);
    assert.match(mediaApiSource, /params\.set\('q', query\)/);
    assert.match(mediaApiSource, /params\.set\('language', language\)/);
    assert.match(mediaApiSource, /ko-KR/);
    assert.match(mediaApiSource, /credentials: 'include'/);
    assert.match(useMediaSearchSource, /export function useMediaSearch/);
    assert.match(useMediaSearchSource, /searchMedia/);
    assert.match(mediaSearchResultsSource, /검색 결과/);
    assert.match(mediaSearchResultsSource, /검색 중/);
    assert.match(mediaSearchResultsSource, /검색 결과가 없어요/);
  });

  it('lets search result cards select and persist a TMDB result through the backend API', () => {
    assert.match(mediaApiSource, /export async function selectMedia/);
    assert.match(mediaApiSource, /\/media\/selections/);
    assert.match(mediaApiSource, /method: 'POST'/);
    assert.match(mediaApiSource, /JSON\.stringify\(selection\)/);
    assert.match(exploreDashboardSource, /selectMedia/);
    assert.match(exploreDashboardSource, /selectedMedia/);
    assert.match(mediaSearchResultsSource, /onSelect/);
    assert.match(mediaSearchResultsSource, /type="button"/);
    assert.match(mediaSearchResultsSource, /검색 결과 선택/);
  });

  it('extracts reusable media search results and selected media panel components', () => {
    assert.match(mediaSearchResultsSource, /export function MediaSearchResults/);
    assert.match(mediaSearchResultsSource, /SearchResultPoster/);
    assert.match(selectedMediaPanelSource, /export function SelectedMediaPanel/);
    assert.match(selectedMediaPanelSource, /다이어리 쓰기/);
    assert.match(selectedMediaPanelSource, /상세 정보/);
    assert.match(exploreDashboardSource, /MediaSearchResults/);
    assert.match(exploreDashboardSource, /SelectedMediaPanel/);
    assert.doesNotMatch(exploreDashboardSource, /function MediaSearchResults/);
    assert.doesNotMatch(exploreDashboardSource, /function SearchResultPoster/);
  });

  it('renders the today recommendation hero card from the supplied design', () => {
    assert.match(exploreDashboardSource, /오늘의 추천/);
    assert.match(exploreDashboardSource, /푸른 밤의 기록/);
    assert.match(exploreDashboardSource, /드라마 · 2023/);
    assert.match(exploreDashboardSource, /잊고 있던 꿈을 다시 마주하게 된 한 사람의 이야기\./);
    assert.match(exploreDashboardSource, /상세 보기/);
    assert.match(exploreDashboardSource, /다이어리 쓰기/);
    assert.match(exploreDashboardSource, /today-recommendation-card/);
    assert.match(exploreDashboardSource, /recommendation-still/);
    assert.match(exploreDashboardSource, /carousel-indicator/);
  });

  it('renders popular works, genre recommendation tiles, and quick shortcuts', () => {
    assert.match(exploreDashboardSource, /지금 많이 찾는 작품/);
    for (const title of ['저 먼 우주에서', '비 오는 오후', '파도 너머로', '침묵의 문', '그 해의 여름']) {
      assert.match(exploreDashboardSource, new RegExp(title));
    }
    assert.match(exploreDashboardSource, /장르별 추천/);
    assert.match(exploreDashboardSource, /비 오는 날 보기 좋은 영화/);
    assert.match(exploreDashboardSource, /몰입감 높은 스릴러/);
    assert.match(exploreDashboardSource, /탐색 바로가기/);
    for (const shortcut of ['인기작', '신작', '평점순', '배우', '감독', '장르']) {
      assert.match(exploreDashboardSource, new RegExp(shortcut));
    }
    assert.match(exploreDashboardSource, /quick-explore-grid/);
  });

  it('reuses the shared media poster row for popular works instead of an inline duplicate', () => {
    assert.match(mediaPosterRowSource, /export function MediaPosterRowSection/);
    assert.match(mediaPosterRowSource, /type MediaPosterRowSectionProps/);
    assert.match(mediaPosterRowSource, /title: string/);
    assert.match(mediaPosterRowSource, /posterClassName\?: string/);
    assert.match(mediaPosterRowSource, /itemClassName\?: string/);
    assert.match(mediaPosterRowSource, /MoviePosterVisual/);
    assert.match(favoriteMoviesSource, /MediaPosterRowSection/);
    assert.match(exploreDashboardSource, /MediaPosterRowSection/);
    assert.match(exploreDashboardSource, /title="지금 많이 찾는 작품"/);
    assert.doesNotMatch(exploreDashboardSource, /function Poster/);
    assert.doesNotMatch(exploreDashboardSource, /function SectionHeader/);
    assert.doesNotMatch(exploreDashboardSource, /popularWorks\.map/);
  });

  it('keeps the bottom navigation explore tab available', () => {
    assert.match(tabBarSource, /href: '\/explore'/);
    assert.match(tabBarSource, /탐색/);
  });
});
