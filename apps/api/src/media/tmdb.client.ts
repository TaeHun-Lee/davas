import { Inject, Injectable, Optional, ServiceUnavailableException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { MediaType } from '@davas/shared';
import { mapTmdbDetail, TmdbDetailPayload, TmdbMediaDetail } from './tmdb-detail.mapper';
import { DavasMediaSearchItem, mapTmdbSearchResult, TmdbSearchResult } from './tmdb.mapper';

export type MediaSearchType = 'movie' | 'tv' | 'multi';

type Fetcher = typeof fetch;

type TmdbClientOptions = {
  apiKey?: string;
  baseUrl?: string;
  fetcher?: Fetcher;
};

export const TMDB_CLIENT_OPTIONS = 'TMDB_CLIENT_OPTIONS';

export type MediaSearchInput = {
  query: string;
  type: MediaSearchType;
  page: number;
  language?: string;
  region?: string;
};

export type MediaSearchResponse = {
  query: string;
  page: number;
  totalPages: number;
  items: DavasMediaSearchItem[];
};

export type MediaDetailInput = {
  externalId: string;
  mediaType: MediaType;
  language?: string;
};

@Injectable()
export class TmdbClient {
  private readonly apiKey?: string;
  private readonly baseUrl: string;
  private readonly fetcher: Fetcher;

  constructor(
    @Optional() configService?: ConfigService,
    @Optional() @Inject(TMDB_CLIENT_OPTIONS) options?: TmdbClientOptions,
  ) {
    this.apiKey = options?.apiKey ?? configService?.get<string>('TMDB_API_KEY');
    this.baseUrl = options?.baseUrl ?? configService?.get<string>('TMDB_BASE_URL') ?? 'https://api.themoviedb.org/3';
    this.fetcher = options?.fetcher ?? fetch;
  }

  async search({ query, type, page, language = 'ko-KR', region = 'KR' }: MediaSearchInput): Promise<MediaSearchResponse> {
    if (!this.apiKey) {
      throw new ServiceUnavailableException('TMDB_API_KEY is not configured');
    }

    const endpoint = `/search/${type}`;
    const url = new URL(`${this.baseUrl}${endpoint}`);
    url.searchParams.set('api_key', this.apiKey);
    url.searchParams.set('query', query);
    url.searchParams.set('page', String(page));
    url.searchParams.set('language', language);
    url.searchParams.set('region', region);
    url.searchParams.set('include_adult', 'false');

    const response = await this.fetcher(url);
    if (!response.ok) {
      throw new ServiceUnavailableException(`TMDB search failed with status ${response.status}`);
    }

    const payload = (await response.json()) as { page?: number; total_pages?: number; results?: TmdbSearchResult[] };
    const normalizedResults = (payload.results ?? [])
      .filter((result) => this.isSupportedResult(result, type))
      .map((result) => mapTmdbSearchResult(this.withMediaType(result, type)));

    return {
      query,
      page: payload.page ?? page,
      totalPages: payload.total_pages ?? 1,
      items: normalizedResults,
    };
  }

  async detail({ externalId, mediaType, language = 'ko-KR' }: MediaDetailInput): Promise<TmdbMediaDetail> {
    if (!this.apiKey) {
      throw new ServiceUnavailableException('TMDB_API_KEY is not configured');
    }

    const resource = mediaType === 'TV' ? 'tv' : 'movie';
    const appendToResponse = mediaType === 'TV' ? 'credits,images,content_ratings' : 'credits,images,release_dates';
    const url = new URL(`${this.baseUrl}/${resource}/${externalId}`);
    url.searchParams.set('api_key', this.apiKey);
    url.searchParams.set('language', language);
    url.searchParams.set('append_to_response', appendToResponse);
    url.searchParams.set('include_image_language', `${language.slice(0, 2)},en,null`);

    const response = await this.fetcher(url);
    if (!response.ok) {
      throw new ServiceUnavailableException(`TMDB detail failed with status ${response.status}`);
    }

    return mapTmdbDetail((await response.json()) as TmdbDetailPayload, mediaType);
  }

  private isSupportedResult(result: TmdbSearchResult, type: MediaSearchType) {
    if (type === 'movie' || type === 'tv') {
      return true;
    }
    return result.media_type === 'movie' || result.media_type === 'tv';
  }

  private withMediaType(result: TmdbSearchResult, type: MediaSearchType): TmdbSearchResult {
    if (type === 'movie') {
      return { ...result, media_type: 'movie' };
    }
    if (type === 'tv') {
      return { ...result, media_type: 'tv' };
    }
    return result;
  }
}
