"use client";

import { useState } from 'react';
import { ExploreFilterChips } from './ExploreFilterChips';
import { ExploreSearchBar } from './ExploreSearchBar';
import { ExploreShortcutGrid } from './ExploreShortcutGrid';
import { GenreRecommendationSection } from './GenreRecommendationSection';
import { TodayRecommendationSection } from './TodayRecommendationSection';
import { MediaPosterItem, MediaPosterRowSection } from '../home/MediaPosterRowSection';
import { AppShell } from '../layout/AppShell';
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
  const isSearchMode = searchQuery.trim().length >= 2;
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

      <ExploreFilterChips />

      {isSearchMode ? <MediaSearchResults items={search.items} status={search.status} query={searchQuery} onSelect={handleSelectMedia} /> : null}
      {isSearchMode ? (
        <PersonSearchResults
          items={peopleSearch.items}
          status={peopleSearch.status}
          query={searchQuery}
          selectedPersonId={peopleSearch.selectedPerson?.id}
          onSelect={handlePersonSelect}
        />
      ) : null}
      {isSearchMode ? (
        <PersonCreditResults
          personName={peopleSearch.selectedPerson?.name}
          items={peopleSearch.creditItems}
          status={peopleSearch.creditsStatus}
          onSelect={handleCreditSelect}
        />
      ) : null}
      {isSelectingMedia ? <div className="card-surface mt-4 rounded-[20px] p-4 text-[13px] font-bold text-[#8b96a8]">선택한 작품의 상세 정보를 불러오고 있어요...</div> : null}
      <MediaDetailModal media={selectedMedia} isOpen={isDetailModalOpen} onClose={() => setIsDetailModalOpen(false)} />

      {!isSearchMode ? (
        <>
          {recommendations.status === 'error' ? <div className="card-surface rounded-[20px] p-4 text-[13px] font-bold text-[#8b96a8]">추천을 불러오지 못했어요. 잠시 후 다시 시도해주세요.</div> : null}

          <TodayRecommendationSection items={recommendations.todayItems} onSelect={handleRecommendationSelect} />

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
