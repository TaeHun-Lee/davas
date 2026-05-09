"use client";

import { ReactNode, PointerEvent, useEffect, useRef, useState } from 'react';

function ChevronIcon({ direction }: { direction: 'left' | 'right' }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" className={direction === 'left' ? 'rotate-180' : ''}>
      <path d="m6.2 3.6 4.1 4.4-4.1 4.4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export type MediaHeroCarouselItem = {
  id: string;
  diaryId?: string;
  mediaId?: string;
  title: string;
  meta?: string;
  description?: string;
  eyebrow?: string;
  imageUrl?: string | null;
  imageAlt?: string;
  imageVariant: 'poster' | 'backdrop';
};

export type MediaHeroCarouselAction = {
  label: string;
  kind: 'primary' | 'secondary';
  icon?: ReactNode;
  onClick?: (item: MediaHeroCarouselItem) => void;
  dataDesign?: string;
};

type MediaHeroCarouselProps = {
  items: MediaHeroCarouselItem[];
  cardLabel?: ReactNode;
  actions?: (item: MediaHeroCarouselItem) => MediaHeroCarouselAction[];
  placeholder?: ReactNode;
  autoPlay?: boolean;
  autoPlayMs?: number;
  className?: string;
};

function HeroImage({ item }: { item: MediaHeroCarouselItem }) {
  if (item.imageVariant === 'poster') {
    return (
      <div data-design="archive-poster" className="relative h-[154px] w-[126px] shrink-0 overflow-hidden rounded-[14px] shadow-[0_12px_20px_rgba(22,43,75,0.18)] max-[374px]:h-[142px] max-[374px]:w-[112px]">
        {item.imageUrl ? <img src={item.imageUrl} alt={item.imageAlt ?? `${item.title} 포스터`} className="h-full w-full object-cover object-center" /> : <div className="h-full w-full rounded-[14px] bg-gradient-to-br from-[#e9eef7] via-[#f6f8fc] to-[#dfe8f5]" />}
      </div>
    );
  }

  return (
    <div data-design={item.imageUrl ? 'recommendation-still' : 'recommendation-still-placeholder'} className="relative h-full min-h-[168px] overflow-hidden rounded-[18px] bg-gradient-to-br from-[#0b1630] via-[#1e4f82] to-[#d99a66] shadow-[0_14px_28px_rgba(20,45,83,0.16)]">
      {item.imageUrl ? <img src={item.imageUrl} alt={item.imageAlt ?? ''} className="absolute inset-0 h-full w-full object-cover object-center" /> : null}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.34),transparent_18%),radial-gradient(circle_at_70%_8%,rgba(255,255,255,0.55),transparent_8%),linear-gradient(to_top,rgba(7,15,31,0.72),transparent_58%)]" />
    </div>
  );
}

function actionClass(kind: MediaHeroCarouselAction['kind']) {
  if (kind === 'primary') {
    return 'archive-primary-action flex h-[34px] flex-[1.2] items-center justify-center gap-1.5 whitespace-nowrap rounded-full bg-[#2f7eea] px-3 text-[11px] font-extrabold leading-[34px] text-white shadow-[0_9px_18px_rgba(47,126,234,0.28)]';
  }
  return 'archive-secondary-action today-detail-button flex h-[36px] min-w-0 items-center justify-center whitespace-nowrap rounded-full border border-[#e8eef6] bg-white px-3 text-[11px] font-extrabold leading-[14px] text-[#536179] shadow-[0_5px_12px_rgba(31,65,114,0.05)]';
}

function isInteractivePointerTarget(target: EventTarget | null) {
  return target instanceof Element && Boolean(target.closest('button, a, input, textarea, select, [role="button"]'));
}

export function MediaHeroCarousel({ items, cardLabel, actions, placeholder, autoPlay = false, autoPlayMs = 3000, className = '' }: MediaHeroCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const pointerStartX = useRef<number | null>(null);
  const carouselItems = items;
  const dragThreshold = 42;

  useEffect(() => {
    if (!autoPlay || carouselItems.length <= 1) return;
    const timer = setInterval(() => {
      setActiveIndex((index) => (index + 1) % carouselItems.length);
    }, autoPlayMs);
    return () => clearInterval(timer);
  }, [autoPlay, autoPlayMs, carouselItems.length]);

  function goPrevious() {
    setActiveIndex((index) => (index - 1 + carouselItems.length) % carouselItems.length);
  }

  function goNext() {
    setActiveIndex((index) => (index + 1) % carouselItems.length);
  }

  function handlePointerDown(event: PointerEvent<HTMLDivElement>) {
    if (isInteractivePointerTarget(event.target)) {
      pointerStartX.current = null;
      return;
    }

    pointerStartX.current = event.clientX;
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function handlePointerUp(event: PointerEvent<HTMLDivElement>) {
    if (pointerStartX.current === null || carouselItems.length <= 1) return;
    const deltaX = event.clientX - pointerStartX.current;
    pointerStartX.current = null;
    if (Math.abs(deltaX) < dragThreshold) return;
    if (deltaX < 0) goNext();
    else goPrevious();
  }

  return (
    <section data-design="media-hero-carousel" className={`today-recommendation-card archive-gradient-card card-surface relative rounded-[24px] p-4 shadow-[0_14px_32px_rgba(31,65,114,0.09)] ${className}`}>
      {cardLabel ? <p className="mb-3 flex items-center gap-1.5 text-[13px] font-extrabold leading-[18px] text-[#236fd7]">{cardLabel}</p> : null}
      <div className="today-carousel-viewport overflow-hidden rounded-[20px]" onPointerDown={handlePointerDown} onPointerUp={handlePointerUp}>
        {carouselItems.length === 0 ? (
          placeholder ?? null
        ) : (
          <div className="today-carousel-track flex transition-transform duration-500 ease-out" style={{ transform: `translateX(-${activeIndex * 100}%)` }}>
            {carouselItems.map((item) => {
              const itemActions = actions?.(item) ?? [];
              return (
                <div key={item.id} className="w-full shrink-0">
                  <div className={item.imageVariant === 'poster' ? 'flex gap-4 max-[374px]:gap-3' : 'grid grid-cols-2 items-stretch gap-3 max-[430px]:grid-cols-1 max-[430px]:gap-4'}>
                    <HeroImage item={item} />
                    <div className={item.imageVariant === 'poster' ? 'flex min-w-0 flex-1 flex-col py-0.5' : 'flex min-w-0 flex-col py-1 max-[430px]:py-0'}>
                      <div>
                        {item.eyebrow ? <span className="inline-flex rounded-full bg-[#eef5ff] px-3 py-1 text-[11px] font-extrabold text-[#2f7eea]">{item.eyebrow}</span> : null}
                        <h1 className={item.imageVariant === 'poster' ? 'mt-2.5 text-[25px] font-black leading-[29px] tracking-[-0.04em] text-[#132b55] max-[374px]:text-[22px]' : 'line-clamp-2 text-[20px] font-black leading-[25px] tracking-[-0.035em] text-[#172947]'}>{item.title}</h1>
                        {item.meta ? <p className="mt-1.5 text-[12px] font-bold leading-[16px] text-[#8b96a8]">{item.meta}</p> : null}
                        {item.description ? <p className="mt-3 line-clamp-3 text-[12px] font-semibold leading-[18px] text-[#747f91]">{item.description}</p> : null}
                      </div>
                      {itemActions.length > 0 ? (
                        <div className={item.imageVariant === 'poster' ? 'archive-action-row mt-auto flex items-center gap-2 pt-3.5' : 'today-recommendation-actions mt-3 grid grid-cols-1 gap-0 pt-2 pr-2 pb-2'}>
                          {itemActions.map((action) => (
                            <button key={action.label} data-design={action.dataDesign} type="button" onClick={() => action.onClick?.(item)} className={actionClass(action.kind)}>
                              {action.icon}{action.label}
                            </button>
                          ))}
                        </div>
                      ) : null}
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
          <button type="button" aria-label="이전 추천 보기" onClick={goPrevious} className="today-carousel-control today-carousel-arrow-only absolute left-0 top-1/2 flex h-10 w-6 -translate-y-1/2 items-center justify-center text-white/90 drop-shadow-[0_2px_5px_rgba(7,15,31,0.45)] transition hover:text-white"><ChevronIcon direction="left" /></button>
          <button type="button" aria-label="다음 추천 보기" onClick={goNext} className="today-carousel-control today-carousel-arrow-only absolute right-0 top-1/2 flex h-10 w-6 -translate-y-1/2 items-center justify-center text-white/90 drop-shadow-[0_2px_5px_rgba(7,15,31,0.45)] transition hover:text-white"><ChevronIcon direction="right" /></button>
        </>
      ) : null}

      {carouselItems.length > 1 ? (
        <div className="carousel-indicator mt-2 flex justify-center gap-[5px]">
          {carouselItems.map((item, index) => (
            <button key={`${item.id}-indicator`} type="button" aria-label={`${index + 1}번째 추천 보기`} onClick={() => setActiveIndex(index)} className={index === activeIndex ? 'h-[5px] w-[22px] rounded-full bg-[#2f7eea] transition-all duration-300' : 'h-[5px] w-[5px] rounded-full bg-[#dbe5f3] transition-all duration-300'} />
          ))}
        </div>
      ) : null}
    </section>
  );
}
