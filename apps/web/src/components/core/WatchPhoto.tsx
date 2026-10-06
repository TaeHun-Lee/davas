'use client';

import { useState } from 'react';
import { photoSrc, type WatchPhotoView } from '../../lib/api/watch-events';

/**
 * Shows the inlined blurred preview at the photo's real aspect ratio straight away (so the
 * layout never jumps), then fades in the real image once it has loaded.
 */
export function WatchPhoto({
  photo,
  variant,
  alt,
  className = '',
  fit = 'cover',
}: {
  photo: WatchPhotoView;
  variant: 'thumb' | 'display';
  alt: string;
  className?: string;
  fit?: 'cover' | 'contain';
}) {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  return (
    <span
      className={`watch-photo ${className}`}
      data-loaded={loaded || undefined}
      data-fit={fit}
      style={{
        aspectRatio: `${photo.width} / ${photo.height}`,
        backgroundImage: photo.placeholder ? `url("${photo.placeholder}")` : undefined,
      }}
    >
      {failed ? (
        <span className="watch-photo-failed">사진을 불러오지 못했어요</span>
      ) : (
        <img
          src={photoSrc(variant === 'thumb' ? photo.thumbUrl : photo.displayUrl)}
          alt={alt}
          width={photo.width}
          height={photo.height}
          loading={variant === 'thumb' ? 'lazy' : 'eager'}
          decoding="async"
          onLoad={() => setLoaded(true)}
          onError={() => setFailed(true)}
        />
      )}
    </span>
  );
}
