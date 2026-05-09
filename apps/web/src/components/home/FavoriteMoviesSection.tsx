'use client';

import { useState } from 'react';
import { MediaDetailModal } from '../media/MediaDetailModal';
import { getMediaDetail, type MediaDetail } from '../../lib/api/media';
import { MediaPosterItem, MediaPosterRowSection } from './MediaPosterRowSection';

export type FavoriteMovie = MediaPosterItem;

export type FavoriteMoviesSectionProps = {
  movies: FavoriteMovie[];
};

export function FavoriteMoviesSection({ movies }: FavoriteMoviesSectionProps) {
  const [selectedMedia, setSelectedMedia] = useState<MediaDetail | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  async function openDetail(item: FavoriteMovie) {
    if (!item.mediaId) return;
    const mediaDetail = await getMediaDetail(item.mediaId);
    setSelectedMedia(mediaDetail);
    setIsDetailOpen(true);
  }

  return (
    <>
      <MediaPosterRowSection title="내가 가장 사랑한 컨텐츠" items={movies} onItemClick={(item) => void openDetail(item)} />
      <MediaDetailModal media={selectedMedia} isOpen={isDetailOpen} onClose={() => setIsDetailOpen(false)} returnTo="/" />
    </>
  );
}
