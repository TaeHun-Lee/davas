"use client";

import { useRef } from 'react';
import { clampRating, ratingFromPointer } from './diary-compose-utils';

function Star({ fillPercent }: { fillPercent: number }) {
  return (
    <span className="relative inline-grid size-8 place-items-center text-[30px] leading-none text-[#dde4ee]">
      <span aria-hidden="true">★</span>
      <span className="absolute inset-0 overflow-hidden text-[#ff5a52]" style={{ width: `${fillPercent}%` }} aria-hidden="true">
        ★
      </span>
    </span>
  );
}

export function RatingInputCard({ value, onChange }: { value: number; onChange: (value: number) => void }) {
  const ratingTrackRef = useRef<HTMLDivElement | null>(null);
  const clampedValue = clampRating(value);

  function updateRatingFromPointer(clientX: number) {
    const rect = ratingTrackRef.current?.getBoundingClientRect();
    if (!rect) return;
    onChange(ratingFromPointer({ clientX, left: rect.left, width: rect.width }));
  }

  return (
    <section className="card-surface rounded-[22px] p-4 shadow-[0_12px_28px_rgba(31,65,114,0.07)]">
      <div className="flex items-center justify-between gap-4">
        <div className="min-w-0 flex-1">
          <p className="mb-3 text-[14px] font-black text-[#1f2a44]">나의 별점</p>
          <div
            ref={ratingTrackRef}
            role="slider"
            aria-label="나의 별점"
            aria-valuemin={0}
            aria-valuemax={5}
            aria-valuenow={clampedValue}
            tabIndex={0}
            onKeyDown={(event) => {
              if (!['ArrowLeft', 'ArrowDown', 'ArrowRight', 'ArrowUp', 'Home', 'End'].includes(event.key)) return;
              event.preventDefault();
              if (event.key === 'Home') onChange(0);
              else if (event.key === 'End') onChange(5);
              else onChange(clampRating(clampedValue + (event.key === 'ArrowRight' || event.key === 'ArrowUp' ? 0.5 : -0.5)));
            }}
            onPointerDown={(event) => {
              event.currentTarget.setPointerCapture(event.pointerId);
              updateRatingFromPointer(event.clientX);
            }}
            onPointerMove={(event) => {
              if (event.buttons !== 1) return;
              updateRatingFromPointer(event.clientX);
            }}
            className="flex min-h-11 touch-none select-none items-center gap-1 rounded-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#216bd8]"
          >
            {Array.from({ length: 5 }).map((_, index) => {
              const fillPercent = Math.min(100, Math.max(0, (clampedValue - index) * 100));
              return <Star key={index} fillPercent={fillPercent} />;
            })}
          </div>
        </div>
        <div className="h-12 w-px bg-[#e8eef6]" />
        <output className="min-w-[52px] text-right text-[28px] font-black tracking-[-0.04em] text-[#2f6fb4]">{clampedValue.toFixed(1)}</output>
      </div>
    </section>
  );
}
