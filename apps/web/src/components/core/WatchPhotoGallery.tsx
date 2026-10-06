'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useFocusTrap } from '../../hooks/useFocusTrap';
import { photoSrc, type WatchPhotoView } from '../../lib/api/watch-events';
import { WatchPhoto } from './WatchPhoto';

export function WatchPhotoGallery({ photos, title }: { photos: WatchPhotoView[]; title: string }) {
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
        onIndex={setCurrent}
        onClose={() => setViewerOpen(false)}
      />
    </section>
  );
}

function PhotoViewer({
  open,
  photos,
  index,
  title,
  onIndex,
  onClose,
}: {
  open: boolean;
  photos: WatchPhotoView[];
  index: number;
  title: string;
  onIndex: (index: number) => void;
  onClose: () => void;
}) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const close = useCallback(() => onClose(), [onClose]);
  useFocusTrap(open, dialogRef, close);
  const photo = photos[index];
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
  const touchStart = useRef<number | null>(null);

  return (
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label={`${title} 사진 ${index + 1} / ${photos.length}`}
      className="photo-viewer"
      hidden={!open}
      onTouchStart={(event) => (touchStart.current = event.touches[0]?.clientX ?? null)}
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
          <span aria-hidden="true">×</span>
        </button>
        <span aria-hidden="true">
          {index + 1} / {photos.length}
        </span>
        <a
          href={photoSrc(photo.originalUrl ?? photo.displayUrl)}
          download
          className="photo-viewer-save"
          aria-label={photo.originalUrl ? '원본 사진 저장' : '사진 저장'}
        >
          {photo.originalUrl ? '원본 저장' : '저장'}
        </a>
      </div>
      {open ? (
        <div className="photo-viewer-stage">
          <WatchPhoto
            key={photo.id}
            photo={photo}
            variant="display"
            alt={`${title} 사진 ${index + 1}`}
            fit="contain"
          />
        </div>
      ) : null}
      {photos.length > 1 ? (
        <div className="photo-viewer-nav">
          <button type="button" onClick={() => go(-1)} aria-label="이전 사진">
            <span aria-hidden="true">‹</span>
          </button>
          <button type="button" onClick={() => go(1)} aria-label="다음 사진">
            <span aria-hidden="true">›</span>
          </button>
        </div>
      ) : null}
    </div>
  );
}
