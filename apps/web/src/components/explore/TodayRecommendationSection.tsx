"use client";

import { useState } from 'react';
import type { MediaRecommendationItem } from '../../lib/api/recommendations';
import { SectionTitle } from '../home/SectionTitle';

function ChevronIcon({ direction }: { direction: 'left' | 'right' }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" className={direction === 'left' ? 'rotate-180' : ''}>
      <path d="m6.2 3.6 4.1 4.4-4.1 4.4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function RecommendationStill({ backdropUrl }: { backdropUrl?: string | null }) {
  return (
    <div data-design="recommendation-still" className="relative h-full min-h-[168px] overflow-hidden rounded-[18px] bg-gradient-to-br from-[#0b1630] via-[#1e4f82] to-[#d99a66] shadow-[0_14px_28px_rgba(20,45,83,0.16)]">
      {backdropUrl ? <img src={backdropUrl} alt="" className="absolute inset-0 h-full w-full object-cover object-center" /> : null}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.34),transparent_18%),radial-gradient(circle_at_70%_8%,rgba(255,255,255,0.55),transparent_8%),linear-gradient(to_top,rgba(7,15,31,0.72),transparent_58%)]" />
      {!backdropUrl ? (
        <>
          <div className="absolute bottom-0 left-0 right-0 flex h-12 items-end gap-1.5 px-3 pb-3 opacity-75">
            <span className="h-5 w-2 rounded-t bg-[#f2c77e]" />
            <span className="h-8 w-2.5 rounded-t bg-[#d6e7ff]" />
            <span className="h-6 w-2 rounded-t bg-[#f5b46b]" />
            <span className="h-10 w-3 rounded-t bg-[#a8c5e8]" />
            <span className="h-7 w-2.5 rounded-t bg-[#ffd79c]" />
          </div>
          <div className="absolute bottom-5 right-8 h-12 w-8 rounded-full bg-[#17223c] shadow-[0_0_0_8px_rgba(255,255,255,0.08)]" />
        </>
      ) : null}
    </div>
  );
}

function TodayRecommendationPlaceholder() {
  return (
    <div data-design="today-recommendation-placeholder" aria-label="오늘의 추천을 불러오는 중" className="grid grid-cols-2 items-stretch gap-3 max-[430px]:grid-cols-1 max-[430px]:gap-4">
      <RecommendationStill />
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

export type TodayRecommendationSectionProps = {
  items?: MediaRecommendationItem[];
  onSelect?: (item: MediaRecommendationItem) => void;
  onViewAll?: () => void;
};

export function TodayRecommendationSection({ items = [], onSelect, onViewAll }: TodayRecommendationSectionProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const liveItems = items.map((entry) => entry);
  const carouselItems = liveItems;

  return (
    <>
      <SectionTitle title="오늘의 추천" actionLabel="전체 보기 ›" onAction={onViewAll} />
      <section data-design="today-recommendation-card" className="today-recommendation-card card-surface relative rounded-[24px] p-4 shadow-[0_14px_32px_rgba(31,65,114,0.09)]">
        <div className="today-carousel-viewport overflow-hidden rounded-[20px]">
          {carouselItems.length === 0 ? (
            <TodayRecommendationPlaceholder />
          ) : (
          <div className="today-carousel-track flex transition-transform duration-500 ease-out" style={{ transform: `translateX(-${activeIndex * 100}%)` }}>
            {carouselItems.map((entry, index) => {
              const overview = entry.overview || '작품 소개를 준비하고 있어요.';
              return (
                <div key={`${entry.externalId ?? entry.title}-${index}`} className="w-full shrink-0">
                  <div className="grid grid-cols-2 items-stretch gap-3 max-[430px]:grid-cols-1 max-[430px]:gap-4">
                    <RecommendationStill backdropUrl={entry.backdropUrl} />
                    <div className="flex min-w-0 flex-col py-1 max-[430px]:py-0">
                      <h1 className="line-clamp-2 text-[20px] font-black leading-[25px] tracking-[-0.035em] text-[#172947]">{entry.title}</h1>
                      <p className="mt-1.5 text-[12px] font-bold leading-[16px] text-[#8b96a8]">{getRecommendationMeta(entry)}</p>
                      <p className="mt-3 line-clamp-3 text-[12px] font-semibold leading-[18px] text-[#747f91]">{overview}</p>
                      <div className="today-recommendation-actions mt-3 grid grid-cols-1 gap-0 pt-2 pr-2 pb-2">
                        <button data-design="today-detail-button" type="button" onClick={() => void onSelect?.(entry)} className="today-detail-button flex h-[36px] w-full min-w-0 items-center justify-center whitespace-nowrap rounded-full border border-[#e8eef6] bg-white px-3 text-[11px] font-extrabold leading-[14px] text-[#536179] shadow-[0_5px_12px_rgba(31,65,114,0.05)]">상세 보기 ›</button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          )}
        </div>

        {carouselItems.length > 1 ? (
          <>
            <button
              type="button"
              aria-label="이전 추천 보기"
              onClick={() => setActiveIndex((index) => (index - 1 + carouselItems.length) % carouselItems.length)}
              className="today-carousel-control today-carousel-arrow-only absolute left-0 top-1/2 flex h-10 w-6 -translate-y-1/2 items-center justify-center text-white/90 drop-shadow-[0_2px_5px_rgba(7,15,31,0.45)] transition hover:text-white"
            >
              <ChevronIcon direction="left" />
            </button>
            <button
              type="button"
              aria-label="다음 추천 보기"
              onClick={() => setActiveIndex((index) => (index + 1) % carouselItems.length)}
              className="today-carousel-control today-carousel-arrow-only absolute right-0 top-1/2 flex h-10 w-6 -translate-y-1/2 items-center justify-center text-white/90 drop-shadow-[0_2px_5px_rgba(7,15,31,0.45)] transition hover:text-white"
            >
              <ChevronIcon direction="right" />
            </button>
          </>
        ) : null}

        <div className="carousel-indicator mt-2 flex justify-center gap-[5px]">
          {carouselItems.map((entry, index) => (
            <button
              key={`${entry.externalId ?? entry.title}-${index}`}
              type="button"
              aria-label={`${index + 1}번째 추천 보기`}
              onClick={() => setActiveIndex(index)}
              className={index === activeIndex ? 'h-[5px] w-[22px] rounded-full bg-[#2f7eea] transition-all duration-300' : 'h-[5px] w-[5px] rounded-full bg-[#dbe5f3] transition-all duration-300'}
            />
          ))}
        </div>
      </section>
    </>
  );
}
