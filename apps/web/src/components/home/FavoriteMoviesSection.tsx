import { MediaPosterItem, MediaPosterRowSection } from './MediaPosterRowSection';

export type FavoriteMovie = MediaPosterItem;

export type FavoriteMoviesSectionProps = {
  movies: FavoriteMovie[];
};

export function FavoriteMoviesSection({ movies }: FavoriteMoviesSectionProps) {
  return <MediaPosterRowSection title="내가 가장 사랑한 영화" items={movies} />;
}
