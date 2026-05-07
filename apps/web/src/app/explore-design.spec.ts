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
const recommendationsApiSource = source('../lib/api/recommendations.ts');
const useExploreRecommendationsSource = source('../hooks/useExploreRecommendations.ts');
const mediaSearchResultsSource = source('../components/media/MediaSearchResults.tsx');
const personSearchResultsSource = source('../components/media/PersonSearchResults.tsx');
const personCreditResultsSource = source('../components/media/PersonCreditResults.tsx');
const mediaDetailModalSource = source('../components/media/MediaDetailModal.tsx');
const mediaDetailSectionsSource = source('../components/media/media-detail-sections.tsx');
const mediaGenreSource = source('../components/media/media-genres.ts');
const useMediaSearchSource = source('../hooks/useMediaSearch.ts');
const usePeopleSearchSource = source('../hooks/usePeopleSearch.ts');
const exploreSearchBarSource = source('../components/explore/ExploreSearchBar.tsx');
const exploreFilterChipsSource = source('../components/explore/ExploreFilterChips.tsx');
const todayRecommendationSource = source('../components/explore/TodayRecommendationSection.tsx');
const genreRecommendationSource = source('../components/explore/GenreRecommendationSection.tsx');
const exploreShortcutGridSource = source('../components/explore/ExploreShortcutGrid.tsx');

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
    assert.match(exploreSearchBarSource, /영화, 드라마, 배우를 검색해보세요/);
    for (const chip of ['전체', '영화', '드라마', '배우', '감독', '장르', '평점순']) {
      assert.match(exploreFilterChipsSource, new RegExp(chip));
    }
    assert.match(exploreFilterChipsSource, /explore-filter-row/);
    assert.match(exploreFilterChipsSource, /bg-\[#216bd8\]/);
    assert.match(exploreFilterChipsSource, /rounded-full/);
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

  it('calls backend person search and credits APIs without exposing TMDB to the browser', () => {
    assert.match(mediaApiSource, /export type PersonSearchResult/);
    assert.match(mediaApiSource, /export type PersonSearchResponse/);
    assert.match(mediaApiSource, /export type PersonCreditsResponse/);
    assert.match(mediaApiSource, /export async function searchPeople/);
    assert.match(mediaApiSource, /export async function getPersonCredits/);
    assert.match(mediaApiSource, /\/media\/people\/search/);
    assert.match(mediaApiSource, /\/media\/people\/\$\{personId\}\/credits/);
    assert.doesNotMatch(mediaApiSource, /api\.themoviedb\.org/);
    assert.match(usePeopleSearchSource, /export function usePeopleSearch/);
    assert.match(usePeopleSearchSource, /searchPeople/);
    assert.match(usePeopleSearchSource, /getPersonCredits/);
    assert.match(usePeopleSearchSource, /selectedPerson/);
  });

  it('renders separate actor candidates and actor credit results before selecting a work', () => {
    assert.match(personSearchResultsSource, /export function PersonSearchResults/);
    assert.match(personSearchResultsSource, /배우 검색 결과/);
    assert.match(personSearchResultsSource, /출연작 보기/);
    assert.match(personSearchResultsSource, /knownFor/);
    assert.match(personCreditResultsSource, /export function PersonCreditResults/);
    assert.match(personCreditResultsSource, /출연 작품/);
    assert.match(personCreditResultsSource, /작품 선택/);
    assert.match(personCreditResultsSource, /onSelect/);
    assert.match(exploreDashboardSource, /usePeopleSearch/);
    assert.match(exploreDashboardSource, /PersonSearchResults/);
    assert.match(exploreDashboardSource, /PersonCreditResults/);
    assert.match(exploreDashboardSource, /handlePersonSelect/);
    assert.match(exploreDashboardSource, /handleCreditSelect/);
    assert.match(exploreDashboardSource, /selectMedia\(item\)/);
    assert.match(exploreDashboardSource, /getMediaDetail\(media\.id\)/);
    assert.doesNotMatch(exploreDashboardSource, /function PersonSearchResults/);
    assert.doesNotMatch(exploreDashboardSource, /function PersonCreditResults/);
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
    assert.doesNotMatch(mediaDetailModalSource, /TMDB 상세 정보/);
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

  it('keeps the detail modal focused on a single synopsis card and no default diary rating', () => {
    assert.doesNotMatch(mediaDetailModalSource, /line-clamp-4/);
    assert.doesNotMatch(mediaDetailModalSource, /border-\[18px\] border-\[#e8f0f8\]/);
    assert.doesNotMatch(mediaDetailModalSource, /pointer-events-none absolute right-2 top-\[56px\]/);
    assert.doesNotMatch(mediaDetailModalSource, /TMDB 상세 정보/);
    assert.match(mediaDetailModalSource, /<DetailInfoCard title="시놉시스">\{overview\}<\/DetailInfoCard>/);
    assert.match(mediaDetailSectionsSource, /showChevron = false/);
    assert.doesNotMatch(mediaDetailSectionsSource, /<span className="text-\[#ff5a52\]">★<\/span><span className="text-\[#ff5a52\]">★/);
    assert.match(mediaDetailSectionsSource, /Array\.from\(\{ length: 5 \}/);
    assert.match(mediaDetailSectionsSource, /currentRating = 0/);
  });

  it('extracts reusable explore search and filter controls', () => {
    assert.match(exploreSearchBarSource, /export function ExploreSearchBar/);
    assert.match(exploreSearchBarSource, /SearchIcon/);
    assert.match(exploreSearchBarSource, /영화, 드라마, 배우를 검색해보세요/);
    assert.match(exploreFilterChipsSource, /export function ExploreFilterChips/);
    assert.match(exploreFilterChipsSource, /explore-filter-row/);
    assert.match(exploreFilterChipsSource, /filters\.map/);
    assert.match(exploreDashboardSource, /ExploreSearchBar/);
    assert.match(exploreDashboardSource, /ExploreFilterChips/);
    assert.doesNotMatch(exploreDashboardSource, /function SearchIcon/);
    assert.doesNotMatch(exploreDashboardSource, /filters\.map/);
  });

  it('renders the today recommendation hero card from a reusable component', () => {
    assert.match(todayRecommendationSource, /export function TodayRecommendationSection/);
    assert.match(todayRecommendationSource, /오늘의 추천/);
    assert.match(todayRecommendationSource, /푸른 밤의 기록/);
    assert.match(todayRecommendationSource, /드라마 · 2023/);
    assert.match(todayRecommendationSource, /잊고 있던 꿈을 다시 마주하게 된 한 사람의 이야기\./);
    assert.match(todayRecommendationSource, /상세 보기/);
    assert.match(todayRecommendationSource, /다이어리 쓰기/);
    assert.match(todayRecommendationSource, /today-recommendation-card/);
    assert.match(todayRecommendationSource, /today-recommendation-actions/);
    assert.match(todayRecommendationSource, /whitespace-nowrap/);
    assert.match(todayRecommendationSource, /shrink-0/);
    assert.match(todayRecommendationSource, /RecommendationStill/);
    assert.match(todayRecommendationSource, /PencilIcon/);
    assert.match(todayRecommendationSource, /carousel-indicator/);
    assert.match(exploreDashboardSource, /TodayRecommendationSection/);
    assert.doesNotMatch(exploreDashboardSource, /function RecommendationStill/);
    assert.doesNotMatch(exploreDashboardSource, /function PencilIcon/);
  });

  it('fetches explore recommendations through backend recommendation APIs', () => {
    assert.match(recommendationsApiSource, /export type MediaRecommendationItem/);
    assert.match(recommendationsApiSource, /export async function getTrendingRecommendations/);
    assert.match(recommendationsApiSource, /export async function getGenreRecommendationPresets/);
    assert.match(recommendationsApiSource, /export async function getGenreRecommendations/);
    assert.match(recommendationsApiSource, /export async function getTodayRecommendation/);
    assert.match(recommendationsApiSource, /\/recommendations\/trending/);
    assert.match(recommendationsApiSource, /\/recommendations\/genres/);
    assert.match(recommendationsApiSource, /\/recommendations\/today/);
    assert.match(recommendationsApiSource, /credentials: 'include'/);
    assert.doesNotMatch(recommendationsApiSource, /api\.themoviedb\.org/);
    assert.match(useExploreRecommendationsSource, /export function useExploreRecommendations/);
    assert.match(useExploreRecommendationsSource, /getTrendingRecommendations/);
    assert.match(useExploreRecommendationsSource, /getGenreRecommendations/);
    assert.match(useExploreRecommendationsSource, /getTodayRecommendation/);
  });

  it('renders popular, genre, and today sections from live recommendation state with reusable selection flow', () => {
    assert.match(exploreDashboardSource, /useExploreRecommendations/);
    assert.match(exploreDashboardSource, /recommendations\.trendingItems/);
    assert.match(exploreDashboardSource, /recommendations\.genreTiles/);
    assert.match(exploreDashboardSource, /recommendations\.todayItems/);
    assert.match(exploreDashboardSource, /handleRecommendationSelect/);
    assert.match(exploreDashboardSource, /selectMedia\(item\)/);
    assert.match(exploreDashboardSource, /getMediaDetail\(media\.id\)/);
    assert.match(todayRecommendationSource, /items\?: MediaRecommendationItem\[\]/);
    assert.match(todayRecommendationSource, /onSelect\?: \(item: MediaRecommendationItem\) => void/);
    assert.match(todayRecommendationSource, /backdropUrl/);
    assert.match(genreRecommendationSource, /tiles: GenreRecommendationTile\[\]/);
    assert.match(genreRecommendationSource, /onSelect\?: \(item: MediaRecommendationItem\) => void/);
    assert.match(mediaPosterRowSource, /sourceItem\?: MediaSearchResult/);
    assert.match(mediaPosterRowSource, /onSelect\?: \(item: MediaSearchResult\) => void/);
    assert.doesNotMatch(exploreDashboardSource, /const popularWorks/);
  });

  it('uses three today recommendation items as a real carousel instead of a static hero', () => {
    assert.match(recommendationsApiSource, /items: MediaRecommendationItem\[\]/);
    assert.match(recommendationsApiSource, /limit\?: number/);
    assert.match(recommendationsApiSource, /params\.set\('limit', String\(limit\)\)/);
    assert.match(useExploreRecommendationsSource, /todayItems: MediaRecommendationItem\[\]/);
    assert.match(useExploreRecommendationsSource, /getTodayRecommendation\(\{ limit: 3/);
    assert.match(todayRecommendationSource, /items\?: MediaRecommendationItem\[\]/);
    assert.match(todayRecommendationSource, /useState\(0\)/);
    assert.match(todayRecommendationSource, /activeIndex/);
    assert.match(todayRecommendationSource, /setActiveIndex/);
    assert.match(todayRecommendationSource, /carousel-indicator/);
    assert.match(todayRecommendationSource, /items\.map/);
    assert.doesNotMatch(todayRecommendationSource, /item\?: MediaRecommendationItem/);
  });

  it('randomizes genre recommendation presets and renders multiple works per genre', () => {
    assert.match(recommendationsApiSource, /getRandomGenreRecommendations/);
    assert.match(recommendationsApiSource, /\/recommendations\/genres\/random/);
    assert.match(useExploreRecommendationsSource, /pickRandomGenrePresets/);
    assert.match(useExploreRecommendationsSource, /Math\.random/);
    assert.doesNotMatch(useExploreRecommendationsSource, /presets\.items\.slice\(0, 2\)/);
    assert.match(useExploreRecommendationsSource, /getGenreRecommendations\(preset\.id, \{ limit: 4/);
    assert.match(genreRecommendationSource, /tile\.items\.map/);
    assert.doesNotMatch(genreRecommendationSource, /const featuredItem = tile\.items\[0\]/);
  });

  it('provides an expand/collapse 전체 보기 interaction for popular trending works', () => {
    assert.match(recommendationsApiSource, /getTrendingRecommendations\(\{ limit = 10/);
    assert.match(exploreDashboardSource, /showAllTrending/);
    assert.match(exploreDashboardSource, /setShowAllTrending/);
    assert.match(exploreDashboardSource, /visibleTrendingItems/);
    assert.match(exploreDashboardSource, /전체 보기/);
    assert.match(exploreDashboardSource, /접기/);
    assert.match(mediaPosterRowSource, /actionLabel\?: string/);
    assert.match(mediaPosterRowSource, /onAction\?: \(\) => void/);
  });

  it('renders popular works, genre recommendation tiles, and quick shortcuts through reusable sections', () => {
    assert.match(exploreDashboardSource, /지금 많이 찾는 작품/);
    assert.match(genreRecommendationSource, /export function GenreRecommendationSection/);
    assert.match(genreRecommendationSource, /장르별 추천/);
    assert.match(genreRecommendationSource, /genreTiles\.map/);
    assert.match(genreRecommendationSource, /비 오는 날 보기 좋은 영화/);
    assert.match(genreRecommendationSource, /몰입감 높은 스릴러/);
    assert.match(exploreShortcutGridSource, /export function ExploreShortcutGrid/);
    assert.match(exploreShortcutGridSource, /탐색 바로가기/);
    assert.match(exploreShortcutGridSource, /quick-explore-grid/);
    assert.match(exploreShortcutGridSource, /shortcuts\.map/);
    for (const shortcut of ['인기작', '신작', '평점순', '배우', '감독', '장르']) {
      assert.match(exploreShortcutGridSource, new RegExp(shortcut));
    }
    assert.match(exploreDashboardSource, /GenreRecommendationSection/);
    assert.match(exploreDashboardSource, /ExploreShortcutGrid/);
    assert.doesNotMatch(exploreDashboardSource, /genreTiles\.map/);
    assert.doesNotMatch(exploreDashboardSource, /shortcuts\.map/);
    assert.doesNotMatch(exploreDashboardSource, /function ShortcutIcon/);
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
