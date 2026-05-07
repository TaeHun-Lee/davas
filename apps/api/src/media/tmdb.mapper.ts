import type { MediaType } from '@davas/shared';

export type TmdbSearchResult = {
  id: number;
  media_type?: 'movie' | 'tv' | 'person';
  title?: string;
  name?: string;
  original_title?: string;
  original_name?: string;
  overview?: string;
  poster_path?: string | null;
  backdrop_path?: string | null;
  release_date?: string;
  first_air_date?: string;
  genre_ids?: number[];
  origin_country?: string[];
  vote_average?: number | null;
  vote_count?: number | null;
  popularity?: number | null;
};

export type DavasMediaSearchItem = {
  externalProvider: 'TMDB';
  externalId: string;
  mediaType: MediaType;
  title: string;
  originalTitle: string;
  overview: string;
  posterUrl: string | null;
  backdropUrl: string | null;
  releaseDate: string | null;
  genreIds: number[];
  country: string | null;
};

export type MediaRecommendationItem = DavasMediaSearchItem & {
  voteAverage: number | null;
  voteCount: number | null;
  popularity: number | null;
  reason: string;
};

const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

function imageUrl(size: 'w500' | 'w780', path?: string | null): string | null {
  return path ? `${TMDB_IMAGE_BASE_URL}/${size}${path}` : null;
}

export function mapTmdbSearchResult(result: TmdbSearchResult): DavasMediaSearchItem {
  const mediaType: MediaType = result.media_type === 'tv' ? 'TV' : 'MOVIE';
  const title = mediaType === 'TV' ? result.name : result.title;
  const originalTitle = mediaType === 'TV' ? result.original_name : result.original_title;
  const releaseDate = mediaType === 'TV' ? result.first_air_date : result.release_date;

  return {
    externalProvider: 'TMDB',
    externalId: String(result.id),
    mediaType,
    title: title ?? '',
    originalTitle: originalTitle ?? title ?? '',
    overview: result.overview ?? '',
    posterUrl: imageUrl('w500', result.poster_path),
    backdropUrl: imageUrl('w780', result.backdrop_path),
    releaseDate: releaseDate || null,
    genreIds: result.genre_ids ?? [],
    country: result.origin_country?.[0] ?? null,
  };
}

export function mapTmdbRecommendationResult(result: TmdbSearchResult, reason: string): MediaRecommendationItem {
  return {
    ...mapTmdbSearchResult(result),
    voteAverage: typeof result.vote_average === 'number' ? result.vote_average : null,
    voteCount: typeof result.vote_count === 'number' ? result.vote_count : null,
    popularity: typeof result.popularity === 'number' ? result.popularity : null,
    reason,
  };
}
