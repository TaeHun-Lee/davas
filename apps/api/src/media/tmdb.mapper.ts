import type { MediaType } from '@davas/shared';

export type TmdbSearchResult = {
  id: number;
  media_type?: 'movie' | 'tv';
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
