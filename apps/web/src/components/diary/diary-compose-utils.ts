import type { MediaDetail } from '../../lib/api/media';
import type { DiaryComposeMedia } from './SelectedMediaCard';

export function clampRating(value: number) {
  if (Number.isNaN(value)) return 0;
  return Math.min(5, Math.max(0, Math.round(value * 10) / 10));
}

export function ratingFromPointer({ clientX, left, width }: { clientX: number; left: number; width: number }) {
  if (width <= 0) return 0;
  const ratio = Math.min(1, Math.max(0, (clientX - left) / width));
  return clampRating(ratio * 5);
}

export function formatDisplayDate(value: string) {
  return value.replaceAll('-', '.');
}

export function todayIsoDate() {
  return new Date().toISOString().slice(0, 10);
}

export function isValidDateInput(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00.000Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

type ValidateDiaryComposeInput = {
  rating: number;
  watchedDate: string;
  effectiveTitle: string;
  content: string;
};

export function validateDiaryCompose({ rating, watchedDate, effectiveTitle, content }: ValidateDiaryComposeInput) {
  return (
    rating >= 0 &&
    rating <= 5 &&
    Number.isFinite(rating) &&
    isValidDateInput(watchedDate) &&
    effectiveTitle.trim().length > 0 &&
    content.length <= 3000
  );
}

export function mapMediaDetailToDiaryMedia(media: MediaDetail): DiaryComposeMedia {
  const { genres, releaseDate } = media;
  const genreLabel = genres.slice(0, 2).join(' · ');
  const year = releaseDate?.slice(0, 4);
  const meta = [genreLabel, year].filter(Boolean).join(' · ');

  return {
    id: media.id,
    title: media.title,
    originalTitle: media.originalTitle,
    posterUrl: media.posterUrl,
    meta: meta || (media.mediaType === 'TV' ? '드라마' : '영화'),
  };
}
