import { MediaPosterItem, MediaPosterRowSection } from './MediaPosterRowSection';

export type FavoriteMovie = MediaPosterItem;

export type FavoriteMoviesSectionProps = {
  movies: FavoriteMovie[];
  onDetailSelect: (mediaId?: string) => void;
};

export function FavoriteMoviesSection({ movies, onDetailSelect }: FavoriteMoviesSectionProps) {
  return <MediaPosterRowSection title="내가 가장 사랑한 컨텐츠" items={movies} onItemClick={(item) => onDetailSelect(item.mediaId)} />;
}
