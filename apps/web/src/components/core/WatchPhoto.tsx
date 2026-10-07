'use client';

import { useState } from 'react';
import { photoSrc, type WatchPhotoView } from '../../lib/api/watch-events';

/**
 * Shows the inlined blurred preview at the photo's real aspect ratio straight away (so the
 * layout never jumps), then fades in the real image once it has loaded. `original` falls
 * back to the display image for anyone but the uploader, who alone gets an original URL.
 */
export function WatchPhoto({
  photo,
  variant,
  alt,
  className = '',
  fit = 'cover',
  loadingLabel,
}: {
  photo: WatchPhotoView;
  variant: 'thumb' | 'display' | 'original';
  alt: string;
  className?: string;
  fit?: 'cover' | 'contain';
  /** Said on a pill over the blurred preview until the sharp image arrives. */
  loadingLabel?: string;
}) {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  const path =
    variant === 'thumb'
      ? photo.thumbUrl
      : variant === 'original'
        ? (photo.originalUrl ?? photo.displayUrl)
        : photo.displayUrl;
  const loading = !loaded && !failed;
  return (
    <span
      className={`watch-photo ${className}`}
      data-loaded={loaded || undefined}
      data-fit={fit}
      aria-busy={loadingLabel ? loading : undefined}
      style={{
        aspectRatio: `${photo.width} / ${photo.height}`,
        backgroundImage: photo.placeholder ? `url("${photo.placeholder}")` : undefined,
      }}
    >
      {failed ? (
        <span className="watch-photo-failed">사진을 불러오지 못했어요</span>
      ) : (
        <img
          src={photoSrc(path)}
          alt={alt}
          width={photo.width}
          height={photo.height}
          loading={variant === 'thumb' ? 'lazy' : 'eager'}
          decoding="async"
          onLoad={() => setLoaded(true)}
          onError={() => setFailed(true)}
        />
      )}
      {loadingLabel && loading ? (
        <span className="watch-photo-loading">
          <span className="watch-photo-spinner" aria-hidden="true" />
          {loadingLabel}
        </span>
      ) : null}
    </span>
  );
}
