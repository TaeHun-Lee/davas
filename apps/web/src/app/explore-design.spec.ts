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
const mediaDetailModalSource = source('../components/media/MediaDetailModal.tsx');
const mediaDetailSectionsSource = source('../components/media/media-detail-sections.tsx');
const mediaGenreSource = source('../components/media/media-genres.ts');
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
    assert.match(exploreDashboardSource, /MediaSearchResults/);
    assert.match(exploreDashboardSource, /MediaDetailModal/);
    assert.doesNotMatch(exploreDashboardSource, /SelectedMediaPanel/);
    assert.doesNotMatch(exploreDashboardSource, /function MediaSearchResults/);
    assert.doesNotMatch(exploreDashboardSource, /function SearchResultPoster/);
  });

  it('opens selected media in a reusable detail modal matching the supplied movie-detail design', () => {
    assert.match(mediaDetailModalSource, /export function MediaDetailModal/);
    assert.match(mediaDetailModalSource, /role="dialog"/);
    assert.match(mediaDetailModalSource, /aria-modal="true"/);
    assert.match(mediaDetailModalSource, /data-design="media-detail-modal"/);
    assert.match(mediaDetailModalSource, /영화 상세|드라마 상세/);
    assert.match(mediaDetailModalSource, /posterUrl/);
    assert.match(mediaDetailModalSource, /리뷰·다이어리 작성/);
    assert.match(mediaDetailModalSource, /찜하기/);
    assert.match(mediaDetailModalSource, /시놉시스/);
    assert.match(mediaDetailModalSource, /TMDB 상세 정보/);
    assert.doesNotMatch(mediaDetailModalSource, /꿈과 현실, 장면과 감상이 겹치는 순간/);
    assert.match(mediaDetailSectionsSource, /스틸 컷/);
    assert.match(mediaDetailSectionsSource, /기본 정보/);
    assert.match(mediaDetailSectionsSource, /나의 별점/);
    assert.match(mediaDetailModalSource, /bg-\[#ff5a52\]/);
    assert.match(mediaDetailModalSource, /fixed inset-0/);
    assert.match(mediaDetailModalSource, /overflow-x-hidden/);
    assert.doesNotMatch(mediaDetailModalSource, /right-\[-36px\]/);
    assert.match(mediaDetailSectionsSource, /export function DetailInfoCard/);
    assert.match(mediaDetailSectionsSource, /export function StillCutStrip/);
    assert.match(exploreDashboardSource, /isDetailModalOpen/);
    assert.match(exploreDashboardSource, /onClose=\{/);
  });

  it('uses real TMDB search fields conservatively instead of fabricating detail data', () => {
    assert.match(mediaGenreSource, /18: '드라마'/);
    assert.match(mediaGenreSource, /28: '액션'/);
    assert.match(mediaGenreSource, /export function getTmdbGenreNames/);
    assert.match(mediaDetailModalSource, /getTmdbGenreNames/);
    assert.match(mediaDetailModalSource, /media\.genres\?\.length/);
    assert.match(mediaDetailSectionsSource, /media\.stillCuts\?\.length/);
    assert.doesNotMatch(mediaDetailSectionsSource, /media\.posterUrl, media\.backdropUrl/);
    assert.match(mediaDetailSectionsSource, /별도 스틸컷 API 연결 후 표시됩니다/);
  });

  it('loads selected media detail from the backend before showing the modal', () => {
    assert.match(mediaApiSource, /export type MediaDetail/);
    assert.match(mediaApiSource, /export async function getMediaDetail/);
    assert.match(mediaApiSource, /\/media\/\$\{id\}/);
    assert.match(exploreDashboardSource, /getMediaDetail/);
    assert.match(exploreDashboardSource, /setSelectedMedia\(detail\)/);
    assert.match(mediaDetailModalSource, /media\.runtime/);
    assert.match(mediaDetailModalSource, /media\.tmdbRating/);
    assert.match(mediaDetailSectionsSource, /media\.director/);
    assert.match(mediaDetailSectionsSource, /media\.cast/);
    assert.match(mediaDetailSectionsSource, /media\.stillCuts/);
  });

  it('replaces the fake brief-plot card with real detail metadata from TMDB detail', () => {
    assert.doesNotMatch(mediaDetailModalSource, /간략한 줄거리/);
    assert.doesNotMatch(mediaDetailModalSource, /별도의 간략한 줄거리 데이터를 제공하지 않아/);
    assert.match(mediaDetailModalSource, /TMDB 상세 정보/);
    assert.match(mediaDetailModalSource, /numberOfEpisodes/);
    assert.match(mediaDetailModalSource, /certification/);
    assert.match(mediaDetailSectionsSource, /media\.director/);
    assert.match(mediaDetailSectionsSource, /media\.runtime/);
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
