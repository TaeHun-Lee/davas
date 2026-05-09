"use client";

import type { MediaRecommendationItem } from '../../lib/api/recommendations';
import { MediaHeroCarousel, type MediaHeroCarouselItem } from '../media/MediaHeroCarousel';
import { SectionTitle } from '../home/SectionTitle';

function TodayRecommendationPlaceholder() {
  return (
    <div data-design="today-recommendation-placeholder" aria-label="오늘의 추천을 불러오는 중" className="grid grid-cols-2 items-stretch gap-3 max-[430px]:grid-cols-1 max-[430px]:gap-4">
      <div data-design="recommendation-still-placeholder" className="relative h-full min-h-[168px] overflow-hidden rounded-[18px] bg-gradient-to-br from-[#0b1630] via-[#1e4f82] to-[#d99a66] shadow-[0_14px_28px_rgba(20,45,83,0.16)]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.34),transparent_18%),radial-gradient(circle_at_70%_8%,rgba(255,255,255,0.55),transparent_8%),linear-gradient(to_top,rgba(7,15,31,0.72),transparent_58%)]" />
      </div>
      <div className="flex min-w-0 flex-col justify-center py-1 max-[430px]:py-0" aria-hidden="true">
        <div className="h-6 w-3/4 rounded-full bg-[#edf3fb]" />
        <div className="mt-3 h-3 w-1/2 rounded-full bg-[#edf3fb]" />
        <div className="mt-5 space-y-2">
          <div className="h-3 w-full rounded-full bg-[#f2f6fb]" />
          <div className="h-3 w-5/6 rounded-full bg-[#f2f6fb]" />
          <div className="h-3 w-2/3 rounded-full bg-[#f2f6fb]" />
        </div>
        <div className="mt-5 h-9 w-full rounded-full bg-[#f4f7fb]" />
      </div>
    </div>
  );
}

function getRecommendationMeta(item: MediaRecommendationItem) {
  const releaseYear = item.releaseDate?.slice(0, 4) ?? '연도 미상';
  const mediaType = item.mediaType === 'TV' ? 'TV' : '영화';
  return `${mediaType} · ${releaseYear}`;
}

export function buildTodayHeroItems(items: MediaRecommendationItem[]): MediaHeroCarouselItem[] {
  return items.map((entry, index) => ({
    id: `${entry.externalId ?? entry.title}-${index}`,
    title: entry.title,
    meta: getRecommendationMeta(entry),
    description: entry.overview || '작품 소개를 준비하고 있어요.',
    imageUrl: entry.backdropUrl,
    imageAlt: '',
    imageVariant: 'backdrop',
  }));
}

export type TodayRecommendationSectionProps = {
  items?: MediaRecommendationItem[];
  onSelect?: (item: MediaRecommendationItem) => void;
  onViewAll?: () => void;
};

export function TodayRecommendationSection({ items = [], onSelect, onViewAll }: TodayRecommendationSectionProps) {
  const heroItems = buildTodayHeroItems(items);
  const sourceById = new Map(heroItems.map((heroItem, index) => [heroItem.id, items[index]]));

  return (
    <>
      <SectionTitle title="오늘의 추천" actionLabel="전체 보기 ›" onAction={onViewAll} />
      <MediaHeroCarousel
        items={heroItems}
        placeholder={<TodayRecommendationPlaceholder />}
        autoPlay
        className="today-recommendation-card"
        actions={(item) => [
          {
            label: '상세 보기 ›',
            kind: 'secondary',
            dataDesign: 'today-detail-button',
            onClick: () => {
              const source = sourceById.get(item.id);
              if (source) void onSelect?.(source);
            },
          },
        ]}
      />
    </>
  );
}
