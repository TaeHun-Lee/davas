"use client";

import { useState } from 'react';
import { ExploreFilterChips, type ExploreFilter } from './ExploreFilterChips';
import { ExploreSearchBar } from './ExploreSearchBar';
import { ExploreShortcutGrid } from './ExploreShortcutGrid';
import { GenreRecommendationSection } from './GenreRecommendationSection';
import { TodayRecommendationSection } from './TodayRecommendationSection';
import { MediaPosterItem, MediaPosterRowSection } from '../home/MediaPosterRowSection';
import { AppShell } from '../layout/AppShell';
import { MediaDetailLoadingIndicator } from '../media/MediaDetailLoadingIndicator';
import { MediaDetailModal } from '../media/MediaDetailModal';
import { MediaSearchResults } from '../media/MediaSearchResults';
import { PersonCreditResults } from '../media/PersonCreditResults';
import { PersonSearchResults } from '../media/PersonSearchResults';
import { getTmdbGenreNames } from '../media/media-genres';
import { getMediaDetail, selectMedia, type MediaDetail, type MediaSearchResult, type PersonSearchResult } from '../../lib/api/media';
import type { MediaRecommendationItem } from '../../lib/api/recommendations';
import { useExploreRecommendations } from '../../hooks/useExploreRecommendations';
import { useMediaSearch } from '../../hooks/useMediaSearch';
import { usePeopleSearch } from '../../hooks/usePeopleSearch';

function recommendationToPosterItem(item: MediaRecommendationItem): MediaPosterItem {
  const genre = getTmdbGenreNames({ genreIds: item.genreIds, mediaType: item.mediaType })[0] ?? (item.mediaType === 'TV' ? 'TV' : '영화');
  const year = item.releaseDate?.slice(0, 4) ?? '연도 미상';
  const rating = typeof item.voteAverage === 'number' && item.voteAverage > 0 ? (item.voteAverage / 2).toFixed(1) : '—';

  return {
    title: item.title,
    meta: `${genre} · ${year}`,
    rating,
    gradient: item.mediaType === 'TV' ? 'from-[#1f2937] via-[#2f6c91] to-[#b7d7ee]' : 'from-[#07111f] via-[#15528e] to-[#b9d9ff]',
    posterUrl: item.posterUrl,
    sourceItem: item,
  };
}

export function ExploreDashboard() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMedia, setSelectedMedia] = useState<MediaDetail | null>(null);
  const [isSelectingMedia, setIsSelectingMedia] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const search = useMediaSearch(searchQuery);
  const peopleSearch = usePeopleSearch(searchQuery);
  const recommendations = useExploreRecommendations();
  const [showAllTrending, setShowAllTrending] = useState(false);
  const [showAllToday, setShowAllToday] = useState(false);
  const [activeExploreFilter, setActiveExploreFilter] = useState<ExploreFilter>('전체');
  const isSearchMode = searchQuery.trim().length >= 2;
  const filteredMediaSearchItems = search.items
    .filter((item) => {
      if (activeExploreFilter === '영화') return item.mediaType === 'MOVIE';
      if (activeExploreFilter === '드라마') return item.mediaType === 'TV';
      if (activeExploreFilter === '장르') return item.genreIds.length > 0;
      return true;
    });
  const filteredMediaSearchStatus = search.status === 'results' && filteredMediaSearchItems.length === 0 ? 'empty' : search.status;
  const showMediaSearchResults = ['전체', '영화', '드라마', '장르', '평점순'].includes(activeExploreFilter);
  const showPeopleSearchResults = ['전체', '배우', '감독'].includes(activeExploreFilter);
  const showCreditResults = showPeopleSearchResults;
  const trendingPosterItems = recommendations.trendingItems.map(recommendationToPosterItem);
  const visibleTrendingItems = showAllTrending ? trendingPosterItems : trendingPosterItems.slice(0, 5);

  async function handleSelectMedia(item: MediaSearchResult) {
    setIsSelectingMedia(true);
    try {
      const media = await selectMedia(item);
      const detail = await getMediaDetail(media.id);
      setSelectedMedia(detail);
      setIsDetailModalOpen(true);
    } finally {
      setIsSelectingMedia(false);
    }
  }

  async function handleRecommendationSelect(item: MediaRecommendationItem) {
    setIsSelectingMedia(true);
    try {
      const media = await selectMedia(item);
      const detail = await getMediaDetail(media.id);
      setSelectedMedia(detail);
      setIsDetailModalOpen(true);
    } finally {
      setIsSelectingMedia(false);
    }
  }

  async function handlePersonSelect(person: PersonSearchResult) {
    await peopleSearch.selectPerson(person);
  }

  async function handleCreditSelect(item: MediaSearchResult) {
    setIsSelectingMedia(true);
    try {
      const media = await selectMedia(item);
      const detail = await getMediaDetail(media.id);
      setSelectedMedia(detail);
      setIsDetailModalOpen(true);
    } finally {
      setIsSelectingMedia(false);
    }
  }

  return (
    <AppShell>
      <ExploreSearchBar
        value={searchQuery}
        onChange={(value) => {
          setSearchQuery(value);
          setSelectedMedia(null);
          setIsDetailModalOpen(false);
        }}
      />

      {isSearchMode ? <ExploreFilterChips activeFilter={activeExploreFilter} onChange={setActiveExploreFilter} /> : null}

      {isSearchMode && showMediaSearchResults ? <MediaSearchResults items={filteredMediaSearchItems} status={filteredMediaSearchStatus} query={searchQuery} onSelect={handleSelectMedia} /> : null}
      {isSearchMode && showPeopleSearchResults ? (
        <PersonSearchResults
          items={peopleSearch.items}
          status={peopleSearch.status}
          query={searchQuery}
          selectedPersonId={peopleSearch.selectedPerson?.id}
          onSelect={handlePersonSelect}
        />
      ) : null}
      {isSearchMode && showCreditResults ? (
        <PersonCreditResults
          personName={peopleSearch.selectedPerson?.name}
          items={peopleSearch.creditItems}
          status={peopleSearch.creditsStatus}
          onSelect={handleCreditSelect}
        />
      ) : null}
      {isSelectingMedia ? <MediaDetailLoadingIndicator /> : null}
      <MediaDetailModal media={selectedMedia} isOpen={isDetailModalOpen} onClose={() => setIsDetailModalOpen(false)} />

      {!isSearchMode ? (
        <>
          {recommendations.status === 'error' ? <div className="card-surface rounded-[20px] p-4 text-[13px] font-bold text-[#8b96a8]">추천을 불러오지 못했어요. 잠시 후 다시 시도해주세요.</div> : null}

          <TodayRecommendationSection items={recommendations.todayItems} onSelect={handleRecommendationSelect} onViewAll={() => setShowAllToday((value) => !value)} />

          {showAllToday ? (
            <div className="today-overview-list card-surface mt-3 rounded-[20px] p-3 shadow-[0_10px_24px_rgba(31,65,114,0.07)]">
              <div className="mb-2 flex items-center justify-between">
                <p className="text-[13px] font-extrabold text-[#1f2a44]">오늘의 추천 전체</p>
                <button type="button" onClick={() => setShowAllToday(false)} className="text-[11px] font-bold text-[#8d98aa]">접기</button>
              </div>
              <div className="space-y-2">
                {recommendations.todayItems.map((item) => (
                  <button
                    key={`${item.externalId}-${item.title}`}
                    type="button"
                    onClick={() => void handleRecommendationSelect(item)}
                    className="flex w-full items-center justify-between gap-3 rounded-[16px] bg-[#f7faff] px-3 py-2 text-left transition hover:bg-[#eef5ff]"
                  >
                    <span className="min-w-0">
                      <span className="block truncate text-[12px] font-extrabold text-[#172947]">{item.title}</span>
                      <span className="mt-0.5 block text-[10px] font-bold text-[#8b96a8]">{item.mediaType === 'TV' ? 'TV' : '영화'} · {item.releaseDate?.slice(0, 4) ?? '연도 미상'}</span>
                    </span>
                    <span className="shrink-0 text-[11px] font-extrabold text-[#2f7eea]">상세 보기 ›</span>
                  </button>
                ))}
              </div>
            </div>
          ) : null}

          <MediaPosterRowSection
            title="지금 많이 찾는 작품"
            items={visibleTrendingItems}
            itemClassName="w-[72px]"
            posterClassName="h-[108px] w-[72px] rounded-[15px]"
            actionLabel={showAllTrending ? '접기' : '전체 보기'}
            onAction={() => setShowAllTrending((value) => !value)}
            onSelect={(item) => void handleRecommendationSelect(item as MediaRecommendationItem)}
          />

          <GenreRecommendationSection tiles={recommendations.genreTiles} onSelect={handleRecommendationSelect} />

          <ExploreShortcutGrid />
        </>
      ) : null}
    </AppShell>
  );
}
