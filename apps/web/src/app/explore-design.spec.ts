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
const mediaDetailLoadingIndicatorSource = source('../components/media/MediaDetailLoadingIndicator.tsx');
const mediaHeroCarouselSource = source('../components/media/MediaHeroCarousel.tsx');

describe('Davas explore screen design', () => {
  it('routes /explore to the designed explore dashboard instead of a placeholder', () => {
    assert.match(explorePageSource, /ExploreDashboard/);
    assert.match(explorePageSource, /Suspense/);
    assert.match(explorePageSource, /<Suspense fallback=\{null\}>/);
    assert.doesNotMatch(explorePageSource, /PlaceholderPage/);
    assert.match(exploreDashboardSource, /AppShell/);
  });

  it('matches the supplied explore search and category filter design', () => {
    assert.match(exploreDashboardSource, /use client/);
    assert.match(exploreDashboardSource, /useMediaSearch/);
    assert.match(exploreDashboardSource, /value=\{searchQuery\}/);
    assert.match(exploreDashboardSource, /onChange=\{/);
    assert.match(exploreSearchBarSource, /영화, 드라마, 배우를 검색해보세요/);
    for (const chip of ['전체', '영화', '드라마', '인물']) {
      assert.match(exploreFilterChipsSource, new RegExp(chip));
    }
    assert.doesNotMatch(exploreFilterChipsSource, /배우/);
    assert.doesNotMatch(exploreFilterChipsSource, /감독/);
    assert.doesNotMatch(exploreFilterChipsSource, /장르/);
    assert.doesNotMatch(exploreFilterChipsSource, /평점순/);
    assert.match(exploreFilterChipsSource, /explore-filter-row/);
    assert.match(exploreFilterChipsSource, /bg-\[#216bd8\]/);
    assert.match(exploreFilterChipsSource, /rounded-full/);
    assert.match(exploreDashboardSource, /isSearchMode \? <ExploreFilterChips activeFilter=\{activeExploreFilter\} onChange=\{setActiveExploreFilter\} \/> : null/);
    assert.doesNotMatch(exploreDashboardSource, /\n\s*<ExploreFilterChips \/>\n\s*\{isSearchMode \?/);
    assert.match(exploreFilterChipsSource, /export type ExploreFilter/);
    assert.match(exploreFilterChipsSource, /activeFilter: ExploreFilter/);
    assert.match(exploreFilterChipsSource, /onChange: \(filter: ExploreFilter\) => void/);
    assert.match(exploreFilterChipsSource, /aria-pressed=\{filter === activeFilter\}/);
    assert.match(exploreFilterChipsSource, /aria-label=\{`\$\{filter\} 필터`\}/);
    assert.match(exploreFilterChipsSource, /data-active=\{filter === activeFilter\}/);
    assert.match(exploreFilterChipsSource, /onClick=\{\(\) => onChange\(filter\)\}/);
    assert.match(exploreFilterChipsSource, /ring-\[3px\] ring-\[#d8e8ff\]/);
    assert.match(exploreDashboardSource, /setActiveExploreFilter\('전체'\)/);
  });

  it('filters explore search result sections with the active tag chip', () => {
    assert.match(exploreDashboardSource, /const \[activeExploreFilter, setActiveExploreFilter\] = useState<ExploreFilter>\('전체'\)/);
    assert.match(exploreDashboardSource, /const filteredMediaSearchItems = search\.items/);
    assert.match(exploreDashboardSource, /activeExploreFilter === '영화'/);
    assert.match(exploreDashboardSource, /item\.mediaType === 'MOVIE'/);
    assert.match(exploreDashboardSource, /activeExploreFilter === '드라마'/);
    assert.match(exploreDashboardSource, /item\.mediaType === 'TV'/);
    assert.doesNotMatch(exploreDashboardSource, /activeExploreFilter === '장르'/);
    assert.doesNotMatch(exploreDashboardSource, /item\.genreIds\.length > 0/);
    assert.match(exploreDashboardSource, /const showMediaSearchResults = \['전체', '영화', '드라마'\]\.includes\(activeExploreFilter\)/);
    assert.match(exploreDashboardSource, /const showPeopleSearchResults = \['전체', '인물'\]\.includes\(activeExploreFilter\)/);
    assert.doesNotMatch(exploreDashboardSource, /'배우'/);
    assert.doesNotMatch(exploreDashboardSource, /'감독'/);
    assert.match(exploreDashboardSource, /filteredMediaSearchStatus/);
    assert.match(exploreDashboardSource, /items=\{filteredMediaSearchItems\}/);
    assert.match(exploreDashboardSource, /status=\{filteredMediaSearchStatus\}/);
    assert.match(exploreDashboardSource, /showPeopleSearchResults \? \(/);
    assert.match(exploreDashboardSource, /showCreditResults \? \(/);
  });

  it('improves search result card metadata and people labels', () => {
    assert.match(mediaSearchResultsSource, /getTmdbGenreNames/);
    assert.match(mediaSearchResultsSource, /const genreNames = getTmdbGenreNames\(\{ genreIds: item\.genreIds, mediaType: item\.mediaType \}\)/);
    assert.match(mediaSearchResultsSource, /const mediaMeta = \[item\.mediaType === 'TV' \? '드라마' : '영화', releaseYear, genreText\]/);
    assert.match(mediaSearchResultsSource, /genreNames\.slice\(0, 2\)\.join\(' · '\)/);
    assert.match(personSearchResultsSource, /function getDepartmentLabel/);
    assert.match(personSearchResultsSource, /Acting: '배우'/);
    assert.match(personSearchResultsSource, /Directing: '감독'/);
    assert.match(personSearchResultsSource, /Writing: '작가'/);
    assert.match(personSearchResultsSource, /대표작 ·/);
    assert.doesNotMatch(personSearchResultsSource, /knownFor ·/);
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
    assert.match(mediaSearchResultsSource, /MediaDetailLoadingIndicator/);
    assert.match(mediaSearchResultsSource, /fullScreen=\{false\}/);
    assert.doesNotMatch(mediaSearchResultsSource, /검색 중\.\.\./);
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
    assert.match(personSearchResultsSource, /인물 검색 결과/);
    assert.match(personSearchResultsSource, /작품 보기/);
    assert.doesNotMatch(personSearchResultsSource, /배우 검색 결과/);
    assert.match(personSearchResultsSource, /MediaDetailLoadingIndicator/);
    assert.match(personSearchResultsSource, /label="인물 검색 중"/);
    assert.doesNotMatch(personSearchResultsSource, /인물을 검색 중이에요/);
    assert.doesNotMatch(personSearchResultsSource, /배우를 검색 중이에요/);
    assert.doesNotMatch(personSearchResultsSource, /일치하는 배우가 없어요/);
    assert.match(personSearchResultsSource, /knownFor/);
    assert.match(personCreditResultsSource, /export function PersonCreditResults/);
    assert.match(personCreditResultsSource, /출연 작품/);
    assert.match(personCreditResultsSource, /MediaDetailLoadingIndicator/);
    assert.match(personCreditResultsSource, /label="출연 작품을 불러오는 중"/);
    assert.doesNotMatch(personCreditResultsSource, /출연 작품을 불러오고 있어요/);
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
    assert.match(mediaApiSource, /JSON\.stringify\(toMediaSelectionPayload\(selection\)\)/);
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

  it('keeps the media detail modal addressable in the URL and restores explore when closed or back is pressed', () => {
    assert.match(exploreDashboardSource, /useSearchParams/);
    assert.match(exploreDashboardSource, /const detailMediaId = searchParams\.get\('detail'\)/);
    assert.match(exploreDashboardSource, /openMediaDetail\(detail\)/);
    assert.match(exploreDashboardSource, /params\.set\('detail', detail\.id\)/);
    assert.match(exploreDashboardSource, /router\.push\(`\/explore\?\$\{params\.toString\(\)\}`\)/);
    assert.match(exploreDashboardSource, /params\.delete\('detail'\)/);
    assert.match(exploreDashboardSource, /router\.replace\(nextUrl\)/);
    assert.match(exploreDashboardSource, /getMediaDetail\(detailMediaId\)/);
    assert.match(exploreDashboardSource, /setIsDetailModalOpen\(Boolean\(detailMediaId\)\)/);
  });

  it('passes the current detail route as returnTo when starting a diary from the modal', () => {
    assert.match(mediaDetailModalSource, /returnTo\?: string/);
    assert.match(mediaDetailModalSource, /const diaryUrl = `\/diary\/new\?mediaId=\$\{encodeURIComponent\(media\.id\)\}&returnTo=\$\{encodeURIComponent\(returnTo \?\? `\/explore\?detail=\$\{media\.id\}`\)\}`/);
    assert.match(mediaDetailModalSource, /router\.push\(diaryUrl\)/);
    assert.match(exploreDashboardSource, /returnTo=\{`\/explore\?detail=\$\{selectedMedia\.id\}`\}/);
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
    assert.match(exploreSearchBarSource, /SearchField/);
    assert.match(exploreSearchBarSource, /영화, 드라마, 배우를 검색해보세요/);
    assert.match(exploreFilterChipsSource, /export function ExploreFilterChips/);
    assert.match(exploreFilterChipsSource, /explore-filter-row/);
    assert.match(exploreFilterChipsSource, /filters\.map/);
    assert.match(exploreDashboardSource, /ExploreSearchBar/);
    assert.match(exploreDashboardSource, /ExploreFilterChips/);
    assert.doesNotMatch(exploreDashboardSource, /function SearchIcon/);
    assert.doesNotMatch(exploreDashboardSource, /filters\.map/);
  });

  it('renders the today recommendation hero card from a reusable component without a diary CTA', () => {
    assert.match(todayRecommendationSource, /export function TodayRecommendationSection/);
    assert.match(todayRecommendationSource, /오늘의 추천/);
    assert.doesNotMatch(todayRecommendationSource, /푸른 밤의 기록/);
    assert.doesNotMatch(todayRecommendationSource, /드라마 · 2023/);
    assert.doesNotMatch(todayRecommendationSource, /잊고 있던 꿈을 다시 마주하게 된 한 사람의 이야기\./);
    assert.match(todayRecommendationSource, /상세 보기/);
    assert.doesNotMatch(todayRecommendationSource, /다이어리 쓰기/);
    assert.match(todayRecommendationSource, /today-recommendation-card/);
    assert.match(mediaHeroCarouselSource, /today-recommendation-actions/);
    assert.match(mediaHeroCarouselSource, /whitespace-nowrap/);
    assert.match(mediaHeroCarouselSource, /HeroImage/);
    assert.doesNotMatch(todayRecommendationSource, /PencilIcon/);
    assert.doesNotMatch(todayRecommendationSource, /today-diary-button/);
    assert.match(mediaHeroCarouselSource, /carousel-indicator/);
    assert.match(exploreDashboardSource, /TodayRecommendationSection/);
    assert.doesNotMatch(exploreDashboardSource, /function RecommendationStill/);
    assert.doesNotMatch(exploreDashboardSource, /function PencilIcon/);
  });

  it('keeps explore recommendation loading placeholders text-free and shape-free until live data is ready', () => {
    for (const mockedText of ['푸른 밤의 기록', '비 오는 날 보기 좋은 영화', '몰입감 높은 스릴러', '차분한 밤에 어울리는 작품', '긴장감 있는 이야기']) {
      assert.doesNotMatch(todayRecommendationSource, new RegExp(mockedText));
      assert.doesNotMatch(genreRecommendationSource, new RegExp(mockedText));
    }
    assert.match(todayRecommendationSource, /data-design="today-recommendation-placeholder"/);
    assert.match(todayRecommendationSource, /aria-label="오늘의 추천을 불러오는 중"/);
    assert.match(mediaHeroCarouselSource, /carouselItems\.length === 0/);
    assert.match(todayRecommendationSource, /data-design="recommendation-still-placeholder"/);
    assert.doesNotMatch(todayRecommendationSource, /h-5 w-2 rounded-t/);
    assert.doesNotMatch(todayRecommendationSource, /h-8 w-2\.5 rounded-t/);
    assert.doesNotMatch(todayRecommendationSource, /bottom-5 right-8 h-12 w-8 rounded-full/);
    assert.match(genreRecommendationSource, /data-design="genre-recommendation-placeholder"/);
    assert.match(genreRecommendationSource, /aria-label="장르 추천을 불러오는 중"/);
    assert.match(genreRecommendationSource, /placeholderGenreTiles/);
    assert.doesNotMatch(genreRecommendationSource, /defaultGenreTiles/);

    const genrePlaceholderSource = genreRecommendationSource.slice(
      genreRecommendationSource.indexOf('placeholderGenreTiles.map'),
      genreRecommendationSource.indexOf(': genreTiles.map'),
    );
    assert.doesNotMatch(genrePlaceholderSource, /h-4 w-2\/3 rounded-full/);
    assert.doesNotMatch(genrePlaceholderSource, /h-\[92px\] w-\[62px\]/);
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
    assert.match(genreRecommendationSource, /tiles\?: GenreRecommendationTile\[\]/);
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
    assert.match(mediaHeroCarouselSource, /useState\(0\)/);
    assert.match(mediaHeroCarouselSource, /activeIndex/);
    assert.match(mediaHeroCarouselSource, /setActiveIndex/);
    assert.match(mediaHeroCarouselSource, /carousel-indicator/);
    assert.match(todayRecommendationSource, /items\.map/);
    assert.doesNotMatch(todayRecommendationSource, /item\?: MediaRecommendationItem/);
  });

  it('adds arrow-only carousel controls, smooth slide animation, and a functional today 전체 보기 action', () => {
    assert.match(todayRecommendationSource, /MediaHeroCarousel/);
    assert.match(todayRecommendationSource, /buildTodayHeroItems/);
    assert.match(mediaHeroCarouselSource, /useEffect/);
    assert.match(mediaHeroCarouselSource, /setInterval/);
    assert.match(mediaHeroCarouselSource, /3000/);
    assert.match(mediaHeroCarouselSource, /onPointerDown/);
    assert.match(mediaHeroCarouselSource, /onPointerUp/);
    assert.match(mediaHeroCarouselSource, /dragThreshold/);
    assert.match(mediaHeroCarouselSource, /setPointerCapture/);
    assert.match(mediaHeroCarouselSource, /today-carousel-track/);
    assert.match(mediaHeroCarouselSource, /translateX\(-\$\{activeIndex \* 100\}%\)/);
    assert.match(todayRecommendationSource, /actionLabel="전체 보기 ›"/);
    assert.match(todayRecommendationSource, /onAction=\{onViewAll\}/);
    assert.match(mediaHeroCarouselSource, /today-carousel-viewport/);
    assert.match(mediaHeroCarouselSource, /today-carousel-track/);
    assert.match(mediaHeroCarouselSource, /transition-transform/);
    assert.match(mediaHeroCarouselSource, /duration-500/);
    assert.match(mediaHeroCarouselSource, /translateX\(-\$\{activeIndex \* 100\}%\)/);
    assert.match(mediaHeroCarouselSource, /today-carousel-control/);
    assert.match(mediaHeroCarouselSource, /today-carousel-arrow-only/);
    assert.doesNotMatch(mediaHeroCarouselSource, /today-carousel-control[^\n]*rounded-full/);
    assert.doesNotMatch(mediaHeroCarouselSource, /today-carousel-control[^\n]*bg-white\/70/);
    assert.doesNotMatch(mediaHeroCarouselSource, /today-carousel-control[^\n]*backdrop-blur/);
    assert.match(mediaHeroCarouselSource, /aria-label="이전 추천 보기"/);
    assert.match(mediaHeroCarouselSource, /aria-label="다음 추천 보기"/);
    assert.match(mediaHeroCarouselSource, /setActiveIndex\(\(index\) => \(index - 1 \+ carouselItems\.length\) % carouselItems\.length\)/);
    assert.match(mediaHeroCarouselSource, /setActiveIndex\(\(index\) => \(index \+ 1\) % carouselItems\.length\)/);
    assert.match(exploreDashboardSource, /showAllToday/);
    assert.match(exploreDashboardSource, /setShowAllToday/);
    assert.match(exploreDashboardSource, /today-overview-list/);
    assert.match(exploreDashboardSource, /onViewAll=\{\(\) => setShowAllToday\(\(value\) => !value\)\}/);
  });

  it('keeps today recommendation CTA as a single detail action on mobile', () => {
    assert.match(mediaHeroCarouselSource, /recommendation-still[^\n]*h-full/);
    assert.match(mediaHeroCarouselSource, /recommendation-still[^\n]*min-h-\[168px\]/);
    assert.match(mediaHeroCarouselSource, /items-stretch/);
    assert.match(mediaHeroCarouselSource, /today-recommendation-actions[^\n]*grid-cols-1/);
    assert.doesNotMatch(mediaHeroCarouselSource, /today-recommendation-actions[^\n]*grid-cols-\[0\.9fr_1\.1fr\]/);
    assert.match(mediaHeroCarouselSource, /today-recommendation-actions[^\n]*gap-0/);
    assert.doesNotMatch(todayRecommendationSource, /<button[^\n]*다이어리 쓰기/);
    assert.doesNotMatch(todayRecommendationSource, /today-diary-button[^\n]*bg-\[#2f7eea\]/);
    assert.match(mediaHeroCarouselSource, /carousel-indicator mt-2/);
    assert.doesNotMatch(mediaHeroCarouselSource, /carousel-indicator mt-3\.5/);
  });

  it('aligns the remaining today recommendation detail CTA without a diary button', () => {
    assert.match(mediaHeroCarouselSource, /max-\[430px\]:grid-cols-1/);
    assert.match(mediaHeroCarouselSource, /today-recommendation-actions[^\n]*mt-3[^\n]*pb-2/);
    assert.match(mediaHeroCarouselSource, /today-recommendation-actions[^\n]*pr-2/);
    assert.doesNotMatch(mediaHeroCarouselSource, /today-recommendation-actions[^\n]*max-\[430px\]:grid-cols-2/);
    assert.match(mediaHeroCarouselSource, /dataDesign\?: string/);
    assert.match(todayRecommendationSource, /dataDesign: 'today-detail-button'/);
    assert.doesNotMatch(todayRecommendationSource, /data-design="today-diary-button"/);
    assert.match(mediaHeroCarouselSource, /today-detail-button[^\n]*h-\[36px\][^\n]*items-center/);
    assert.doesNotMatch(todayRecommendationSource, /today-diary-button/);
    assert.doesNotMatch(todayRecommendationSource, /today-diary-button-icon/);
    assert.doesNotMatch(todayRecommendationSource, /<PencilIcon/);
    assert.doesNotMatch(todayRecommendationSource, /다이어리 쓰기/);
    assert.doesNotMatch(mediaHeroCarouselSource, /today-recommendation-actions[^\n]*pt-4"/);
  });

  it('shows selected media loading as an animated indicator instead of bottom-page text', () => {
    assert.match(mediaDetailLoadingIndicatorSource, /export function MediaDetailLoadingIndicator/);
    assert.match(mediaDetailLoadingIndicatorSource, /role="status"/);
    assert.match(mediaDetailLoadingIndicatorSource, /label = '상세 정보를 불러오는 중'/);
    assert.match(mediaDetailLoadingIndicatorSource, /animate-spin/);
    assert.match(mediaDetailLoadingIndicatorSource, /fixed inset-0/);
    assert.doesNotMatch(mediaDetailLoadingIndicatorSource, /불러오고 있어요/);
    assert.match(exploreDashboardSource, /MediaDetailLoadingIndicator/);
    assert.match(exploreDashboardSource, /isSelectingMedia \? <MediaDetailLoadingIndicator \/> : null/);
    assert.doesNotMatch(exploreDashboardSource, /선택한 작품의 상세 정보를 불러오고 있어요/);
  });

  it('opens the detail modal from every explore recommendation movie and drama card', () => {
    assert.match(mediaApiSource, /function toMediaSelectionPayload/);
    assert.match(mediaApiSource, /body: JSON\.stringify\(toMediaSelectionPayload\(selection\)\)/);
    assert.doesNotMatch(mediaApiSource, /body: JSON\.stringify\(selection\)/);
    assert.match(todayRecommendationSource, /if \(source\) void onSelect\?\.\(source\)/);
    assert.match(mediaPosterRowSource, /aria-label=\{`\$\{item\.title\} 상세 보기`\}/);
    assert.match(mediaPosterRowSource, /onClick=\{\(\) => onSelect\(item\.sourceItem!\)\}/);
    assert.match(genreRecommendationSource, /aria-label=\{`\$\{item\.title\} 상세 보기`\}/);
    assert.match(genreRecommendationSource, /onClick=\{\(\) => onSelect\?\.\(item\)\}/);
    assert.match(exploreDashboardSource, /onSelect=\{handleRecommendationSelect\}/);
    assert.match(exploreDashboardSource, /onSelect=\{\(item\) => void handleRecommendationSelect\(item as MediaRecommendationItem\)\}/);
    assert.match(exploreDashboardSource, /setIsDetailModalOpen\(true\)/);
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
    assert.doesNotMatch(genreRecommendationSource, /랜덤/);
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
    assert.match(genreRecommendationSource, /placeholderGenreTiles/);
    assert.doesNotMatch(genreRecommendationSource, /비 오는 날 보기 좋은 영화/);
    assert.doesNotMatch(genreRecommendationSource, /몰입감 높은 스릴러/);
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
