"use client";

import { useState } from 'react';
import type { MediaRecommendationItem } from '../../lib/api/recommendations';
import { SectionTitle } from '../home/SectionTitle';

function PencilIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M3.1 11.6 2.6 14l2.4-.5 7.2-7.2-1.9-1.9-7.2 7.2Z" stroke="white" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="m9.5 5.2 1.9 1.9" stroke="white" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function ChevronIcon({ direction }: { direction: 'left' | 'right' }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" className={direction === 'left' ? 'rotate-180' : ''}>
      <path d="m6.2 3.6 4.1 4.4-4.1 4.4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function RecommendationStill({ backdropUrl }: { backdropUrl?: string | null }) {
  return (
    <div data-design="recommendation-still" className="relative h-[132px] overflow-hidden rounded-[18px] bg-gradient-to-br from-[#0b1630] via-[#1e4f82] to-[#d99a66] shadow-[0_14px_28px_rgba(20,45,83,0.16)]">
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

const fallbackRecommendation = {
  title: '푸른 밤의 기록',
  releaseDate: '2023-01-01',
  mediaType: 'MOVIE',
  overview: '잊고 있던 꿈을 다시 마주하게 된 한 사람의 이야기.',
  backdropUrl: null,
} as MediaRecommendationItem;

function getRecommendationMeta(item: MediaRecommendationItem) {
  if (item === fallbackRecommendation) {
    return '드라마 · 2023';
  }

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
  const carouselItems = liveItems.length > 0 ? liveItems : [fallbackRecommendation];
  const activeItem = carouselItems[Math.min(activeIndex, carouselItems.length - 1)] ?? fallbackRecommendation;

  return (
    <>
      <SectionTitle title="오늘의 추천" actionLabel="전체 보기 ›" onAction={onViewAll} />
      <section data-design="today-recommendation-card" className="today-recommendation-card card-surface relative rounded-[24px] p-4 shadow-[0_14px_32px_rgba(31,65,114,0.09)]">
        <div className="today-carousel-viewport overflow-hidden rounded-[20px]">
          <div className="today-carousel-track flex transition-transform duration-500 ease-out" style={{ transform: `translateX(-${activeIndex * 100}%)` }}>
            {carouselItems.map((entry, index) => {
              const overview = entry.overview || '작품 소개를 준비하고 있어요.';
              return (
                <div key={`${entry.externalId ?? entry.title}-${index}`} className="w-full shrink-0">
                  <div className="grid grid-cols-2 gap-3 max-[374px]:grid-cols-1">
                    <RecommendationStill backdropUrl={entry.backdropUrl} />
                    <div className="flex min-w-0 flex-col py-1 max-[374px]:py-0">
                      <h1 className="line-clamp-2 text-[20px] font-black leading-[25px] tracking-[-0.035em] text-[#172947]">{entry.title}</h1>
                      <p className="mt-1.5 text-[12px] font-bold leading-[16px] text-[#8b96a8]">{getRecommendationMeta(entry)}</p>
                      <p className="mt-3 line-clamp-3 text-[12px] font-semibold leading-[18px] text-[#747f91]">{overview}</p>
                      <div className="today-recommendation-actions mt-auto grid grid-cols-2 gap-2 pt-4">
                        <button type="button" onClick={() => onSelect?.(entry)} className="flex h-[34px] min-w-0 items-center justify-center whitespace-nowrap rounded-full border border-[#e8eef6] bg-white px-2.5 text-[11px] font-extrabold text-[#536179] shadow-[0_5px_12px_rgba(31,65,114,0.05)]">상세 보기 ›</button>
                        <button type="button" onClick={() => onSelect?.(entry)} className="flex h-[34px] min-w-0 items-center justify-center gap-0.5 whitespace-nowrap rounded-full bg-[#2f7eea] px-1.5 text-[10px] font-extrabold text-white shadow-[0_8px_18px_rgba(47,126,234,0.26)]"><span className="shrink-0"><PencilIcon /></span><span className="whitespace-nowrap">다이어리 쓰기</span></button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
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

        <div className="carousel-indicator mt-3.5 flex justify-center gap-[5px]">
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
