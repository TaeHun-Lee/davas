import type { MediaType } from '@davas/shared';

export type TmdbImageItem = {
  file_path?: string | null;
};

export type TmdbCreditPerson = {
  name?: string;
  job?: string;
  order?: number;
};

export type TmdbReleaseDateItem = {
  certification?: string;
};

export type TmdbDetailPayload = {
  id: number;
  title?: string;
  name?: string;
  original_title?: string;
  original_name?: string;
  overview?: string;
  poster_path?: string | null;
  backdrop_path?: string | null;
  release_date?: string;
  first_air_date?: string;
  runtime?: number | null;
  episode_run_time?: number[];
  genres?: Array<{ id: number; name: string }>;
  production_countries?: Array<{ iso_3166_1: string; name: string }>;
  origin_country?: string[];
  vote_average?: number;
  vote_count?: number;
  tagline?: string;
  credits?: {
    cast?: TmdbCreditPerson[];
    crew?: TmdbCreditPerson[];
  };
  images?: {
    backdrops?: TmdbImageItem[];
    posters?: TmdbImageItem[];
  };
  release_dates?: {
    results?: Array<{ iso_3166_1: string; release_dates?: TmdbReleaseDateItem[] }>;
  };
  content_ratings?: {
    results?: Array<{ iso_3166_1: string; rating?: string }>;
  };
};

export type TmdbMediaDetail = {
  externalProvider: 'TMDB';
  externalId: string;
  mediaType: MediaType;
  title: string;
  originalTitle: string;
  overview: string;
  tagline: string | null;
  posterUrl: string | null;
  backdropUrl: string | null;
  releaseDate: string | null;
  runtime: number | null;
  genres: string[];
  country: string | null;
  countries: string[];
  tmdbRating: number | null;
  tmdbVoteCount: number | null;
  director: string | null;
  cast: string[];
  stillCuts: string[];
  certification: string | null;
};

const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

function imageUrl(size: 'w500' | 'w780', path?: string | null): string | null {
  return path ? `${TMDB_IMAGE_BASE_URL}/${size}${path}` : null;
}

function firstRuntime(payload: TmdbDetailPayload, mediaType: MediaType) {
  return mediaType === 'TV' ? payload.episode_run_time?.[0] ?? null : payload.runtime ?? null;
}

function koreanCertification(payload: TmdbDetailPayload, mediaType: MediaType) {
  if (mediaType === 'TV') {
    return payload.content_ratings?.results?.find((result) => result.iso_3166_1 === 'KR')?.rating || null;
  }

  const korea = payload.release_dates?.results?.find((result) => result.iso_3166_1 === 'KR');
  return korea?.release_dates?.find((release) => release.certification)?.certification || null;
}

export function mapTmdbDetail(payload: TmdbDetailPayload, mediaType: MediaType): TmdbMediaDetail {
  const isTv = mediaType === 'TV';
  const title = isTv ? payload.name : payload.title;
  const originalTitle = isTv ? payload.original_name : payload.original_title;
  const releaseDate = isTv ? payload.first_air_date : payload.release_date;
  const countries = payload.production_countries?.map((country) => country.name).filter(Boolean) ?? payload.origin_country ?? [];
  const director = payload.credits?.crew?.find((person) => person.job === 'Director')?.name ?? null;
  const cast = (payload.credits?.cast ?? [])
    .slice()
    .sort((a, b) => (a.order ?? 999) - (b.order ?? 999))
    .map((person) => person.name)
    .filter((name): name is string => Boolean(name))
    .slice(0, 8);
  const stillCuts = (payload.images?.backdrops ?? [])
    .map((image) => imageUrl('w780', image.file_path))
    .filter((url): url is string => Boolean(url))
    .slice(0, 10);

  return {
    externalProvider: 'TMDB',
    externalId: String(payload.id),
    mediaType,
    title: title ?? '',
    originalTitle: originalTitle ?? title ?? '',
    overview: payload.overview ?? '',
    tagline: payload.tagline || null,
    posterUrl: imageUrl('w500', payload.poster_path),
    backdropUrl: imageUrl('w780', payload.backdrop_path),
    releaseDate: releaseDate || null,
    runtime: firstRuntime(payload, mediaType),
    genres: payload.genres?.map((genre) => genre.name).filter(Boolean) ?? [],
    country: countries[0] ?? null,
    countries,
    tmdbRating: typeof payload.vote_average === 'number' ? payload.vote_average : null,
    tmdbVoteCount: typeof payload.vote_count === 'number' ? payload.vote_count : null,
    director,
    cast,
    stillCuts,
    certification: koreanCertification(payload, mediaType),
  };
}
