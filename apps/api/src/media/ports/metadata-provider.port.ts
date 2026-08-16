import type { MediaType } from '@davas/shared';

export const METADATA_PROVIDER = Symbol('METADATA_PROVIDER');

export type CatalogSearchInput = {
  query: string;
  type: 'movie' | 'tv' | 'multi';
  page: number;
  language?: string;
  region?: string;
};

export type CatalogSearchItem = {
  externalProvider: string;
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

export type CatalogSearchResponse = {
  query: string;
  page: number;
  totalPages: number;
  items: CatalogSearchItem[];
};

export type CatalogTitleRef = {
  provider: string;
  externalId: string;
  mediaType: MediaType;
};

export type CatalogTitleDetail = Omit<CatalogSearchItem, 'genreIds'> & {
  tagline: string | null;
  runtime: number | null;
  genres: string[];
  countries: string[];
  tmdbRating: number | null;
  tmdbVoteCount: number | null;
  director: string | null;
  creators: string[];
  numberOfEpisodes: number | null;
  numberOfSeasons: number | null;
  cast: string[];
  stillCuts: string[];
  certification: string | null;
};

export interface MetadataProvider {
  search(input: CatalogSearchInput): Promise<CatalogSearchResponse>;
  getTitle(
    contentRef: CatalogTitleRef,
    locale: string,
  ): Promise<CatalogTitleDetail>;
}
