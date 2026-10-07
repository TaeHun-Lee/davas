'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useFocusTrap } from '../../hooks/useFocusTrap';
import { photoSrc, type WatchPhotoView } from '../../lib/api/watch-events';
import { watchedDayLabel } from '../spaces/space-watch-model';
import { WatchPhoto } from './WatchPhoto';

type GalleryProps = {
  photos: WatchPhotoView[];
  title: string;
  /** The day it was watched, for the viewer's caption ("서울의 봄 · 10월 4일"). */
  watchedDate?: string;
  /** Who added a photo, such as "내가 올림" or "민호님이 올림". */
  uploaderLabel?: (accountId: string) => string | null;
};

export function WatchPhotoGallery({ photos, title, watchedDate, uploaderLabel }: GalleryProps) {
  const [current, setCurrent] = useState(0);
  const [viewerOpen, setViewerOpen] = useState(false);
  if (!photos.length) return null;
  const photo = photos[Math.min(current, photos.length - 1)];

  return (
    <section className="watch-gallery" aria-label={`사진 ${photos.length}장`}>
      <div className="watch-gallery-hero">
        <WatchPhoto
          key={photo.id}
          photo={photo}
          variant="display"
          alt={`${title} 사진 ${current + 1}`}
          fit="contain"
        />
        <span className="watch-gallery-counter" aria-hidden="true">
          {current + 1} / {photos.length}
        </span>
        <button
          type="button"
          className="watch-gallery-expand"
          aria-label="사진 전체 화면으로 보기"
          onClick={() => setViewerOpen(true)}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" />
          </svg>
        </button>
      </div>
      {photos.length > 1 ? (
        <div className="watch-gallery-thumbs">
          {photos.map((item, index) => (
            <button
              key={item.id}
              type="button"
              aria-label={`사진 ${index + 1} 보기${index === current ? ', 지금 보는 중' : ''}`}
              aria-current={index === current || undefined}
              onClick={() => setCurrent(index)}
            >
              <WatchPhoto photo={item} variant="thumb" alt="" />
            </button>
          ))}
        </div>
      ) : null}
      <PhotoViewer
        open={viewerOpen}
        photos={photos}
        index={current}
        title={title}
        watchedDate={watchedDate}
        uploaderLabel={uploaderLabel}
        onIndex={setCurrent}
        onClose={() => setViewerOpen(false)}
      />
    </section>
  );
}

/**
 * The full-screen viewer, as on the C안 board: close, "n / total" and save on top, the photo
 * with its arrows in the middle, then the caption, who added it and a strip of thumbnails.
 */
function PhotoViewer({
  open,
  photos,
  index,
  title,
  watchedDate,
  uploaderLabel,
  onIndex,
  onClose,
}: Omit<GalleryProps, 'photos'> & {
  open: boolean;
  photos: WatchPhotoView[];
  index: number;
  onIndex: (index: number) => void;
  onClose: () => void;
}) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const stripRef = useRef<HTMLDivElement>(null);
  const close = useCallback(() => onClose(), [onClose]);
  useFocusTrap(open, dialogRef, close);
  const photo = photos[index];
  // The original is opened per photo and only for its uploader; moving on shows the display copy.
  const [originalFor, setOriginalFor] = useState<string | null>(null);
  const showOriginal = Boolean(photo.originalUrl) && originalFor === photo.id;
  const go = useCallback(
    (offset: number) => onIndex((index + offset + photos.length) % photos.length),
    [index, onIndex, photos.length],
  );
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft') go(-1);
      if (event.key === 'ArrowRight') go(1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [go, open]);
  // Keeps the current thumbnail in sight when there are more than fit on one line.
  useEffect(() => {
    if (!open) return;
    stripRef.current
      ?.querySelector<HTMLElement>('[aria-current="true"]')
      ?.scrollIntoView({ block: 'nearest', inline: 'nearest' });
  }, [index, open]);
  const touchStart = useRef<number | null>(null);
  const uploader = uploaderLabel?.(photo.uploaderAccountId) ?? null;
  const meta = [uploader, photos.length > 1 ? '좌우로 넘겨 보세요' : null]
    .filter(Boolean)
    .join(' · ');

  return (
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label={`${title} 사진 ${index + 1} / ${photos.length}`}
      className="photo-viewer"
      hidden={!open}
      onTouchStart={(event) => {
        // Scrolling the thumbnail strip is not a swipe to the next photo.
        const inStrip = (event.target as HTMLElement).closest('.photo-viewer-thumbs');
        touchStart.current = inStrip ? null : (event.touches[0]?.clientX ?? null);
      }}
      onTouchEnd={(event) => {
        const start = touchStart.current;
        const end = event.changedTouches[0]?.clientX;
        touchStart.current = null;
        if (start === null || end === undefined || Math.abs(end - start) < 50) return;
        go(end < start ? 1 : -1);
      }}
    >
      <div className="photo-viewer-bar">
        <button type="button" onClick={close} aria-label="사진 보기 닫기">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M6 6l12 12M18 6 6 18" />
          </svg>
        </button>
        <span aria-live="polite" aria-atomic="true">
          <span className="sr-only">사진 </span>
          {index + 1} / {photos.length}
        </span>
        <div className="photo-viewer-tools">
          {photo.originalUrl ? (
            <button
              type="button"
              className="photo-viewer-original"
              aria-pressed={showOriginal}
              onClick={() => setOriginalFor(showOriginal ? null : photo.id)}
            >
              원본 보기
            </button>
          ) : null}
          <a
            href={photoSrc(photo.originalUrl ?? photo.displayUrl)}
            download
            className="photo-viewer-save"
            aria-label={photo.originalUrl ? '원본 사진 저장' : '사진 저장'}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 4v11M7 10l5 5 5-5M5 20h14" />
            </svg>
          </a>
        </div>
      </div>
      {open ? (
        <div className="photo-viewer-stage">
          <WatchPhoto
            key={`${photo.id}:${showOriginal ? 'original' : 'display'}`}
            photo={photo}
            variant={showOriginal ? 'original' : 'display'}
            alt={`${title} 사진 ${index + 1}`}
            fit="contain"
            loadingLabel={showOriginal ? '원본 사진 불러오는 중' : '선명한 사진 불러오는 중'}
          />
          {photos.length > 1 ? (
            <>
              <button
                type="button"
                className="photo-viewer-arrow"
                data-side="prev"
                onClick={() => go(-1)}
                aria-label="이전 사진"
              >
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="m15 5-7 7 7 7" />
                </svg>
              </button>
              <button
                type="button"
                className="photo-viewer-arrow"
                data-side="next"
                onClick={() => go(1)}
                aria-label="다음 사진"
              >
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="m9 5 7 7-7 7" />
                </svg>
              </button>
            </>
          ) : null}
        </div>
      ) : null}
      <div className="photo-viewer-caption">
        <p className="photo-viewer-title">
          {title}
          {watchedDate ? ` · ${watchedDayLabel(watchedDate)}` : ''}
        </p>
        {meta ? <p className="photo-viewer-meta">{meta}</p> : null}
        {open && photos.length > 1 ? (
          <div ref={stripRef} className="photo-viewer-thumbs">
            {photos.map((item, itemIndex) => (
              <button
                key={item.id}
                type="button"
                aria-label={`사진 ${itemIndex + 1} 보기${itemIndex === index ? ', 지금 보는 중' : ''}`}
                aria-current={itemIndex === index || undefined}
                onClick={() => onIndex(itemIndex)}
              >
                <WatchPhoto photo={item} variant="thumb" alt="" />
              </button>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}
