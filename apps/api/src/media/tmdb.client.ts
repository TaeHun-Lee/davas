import { Inject, Injectable, Optional, ServiceUnavailableException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { MediaType } from '@davas/shared';
import { mapTmdbDetail, TmdbDetailPayload, TmdbMediaDetail } from './tmdb-detail.mapper';
import {
  DavasMediaSearchItem,
  mapTmdbRecommendationResult,
  mapTmdbSearchResult,
  MediaRecommendationItem,
  TmdbSearchResult,
} from './tmdb.mapper';

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

export type TrendingRecommendationsInput = {
  period: 'day' | 'week';
  page: number;
  language?: string;
};

export type DiscoverRecommendationsInput = {
  mediaType: 'movie' | 'tv';
  page: number;
  language?: string;
  region?: string;
  withGenres: number[];
  sortBy: string;
  voteCountGte: number;
  reason: string;
};

export type RecommendationResponse = {
  page: number;
  totalPages: number;
  items: MediaRecommendationItem[];
};

type TmdbPersonSearchResult = {
  id: number;
  name?: string;
  profile_path?: string | null;
  known_for_department?: string;
  known_for?: TmdbSearchResult[];
};

export type PersonSearchInput = {
  query: string;
  page: number;
  language?: string;
};

export type DavasPersonSearchItem = {
  id: string;
  name: string;
  profileUrl: string | null;
  knownForDepartment: string;
  knownFor: DavasMediaSearchItem[];
};

export type PersonSearchResponse = {
  query: string;
  page: number;
  totalPages: number;
  items: DavasPersonSearchItem[];
};

export type PersonCreditsInput = {
  personId: string;
  language?: string;
};

export type PersonCreditsResponse = {
  personId: string;
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

  async trending({ period, page, language = 'ko-KR' }: TrendingRecommendationsInput): Promise<RecommendationResponse> {
    if (!this.apiKey) {
      throw new ServiceUnavailableException('TMDB_API_KEY is not configured');
    }

    const url = new URL(`${this.baseUrl}/trending/all/${period}`);
    url.searchParams.set('api_key', this.apiKey);
    url.searchParams.set('page', String(page));
    url.searchParams.set('language', language);

    const response = await this.fetcher(url);
    if (!response.ok) {
      throw new ServiceUnavailableException(`TMDB trending failed with status ${response.status}`);
    }

    const payload = (await response.json()) as { page?: number; total_pages?: number; results?: TmdbSearchResult[] };

    return {
      page: payload.page ?? page,
      totalPages: payload.total_pages ?? 1,
      items: (payload.results ?? [])
        .filter((result) => this.isSupportedResult(result, 'multi'))
        .map((result) => mapTmdbRecommendationResult(result, 'trending')),
    };
  }

  async discover({
    mediaType,
    page,
    language = 'ko-KR',
    region = 'KR',
    withGenres,
    sortBy,
    voteCountGte,
    reason,
  }: DiscoverRecommendationsInput): Promise<RecommendationResponse> {
    if (!this.apiKey) {
      throw new ServiceUnavailableException('TMDB_API_KEY is not configured');
    }

    const url = new URL(`${this.baseUrl}/discover/${mediaType}`);
    url.searchParams.set('api_key', this.apiKey);
    url.searchParams.set('page', String(page));
    url.searchParams.set('language', language);
    url.searchParams.set('region', region);
    url.searchParams.set('with_genres', withGenres.join(','));
    url.searchParams.set('sort_by', sortBy);
    url.searchParams.set('vote_count.gte', String(voteCountGte));
    url.searchParams.set('include_adult', 'false');

    const response = await this.fetcher(url);
    if (!response.ok) {
      throw new ServiceUnavailableException(`TMDB discover failed with status ${response.status}`);
    }

    const payload = (await response.json()) as { page?: number; total_pages?: number; results?: TmdbSearchResult[] };

    return {
      page: payload.page ?? page,
      totalPages: payload.total_pages ?? 1,
      items: (payload.results ?? [])
        .map((result) => this.withMediaType(result, mediaType))
        .map((result) => mapTmdbRecommendationResult(result, reason)),
    };
  }

  async searchPeople({ query, page, language = 'ko-KR' }: PersonSearchInput): Promise<PersonSearchResponse> {
    if (!this.apiKey) {
      throw new ServiceUnavailableException('TMDB_API_KEY is not configured');
    }

    const url = new URL(`${this.baseUrl}/search/person`);
    url.searchParams.set('api_key', this.apiKey);
    url.searchParams.set('query', query);
    url.searchParams.set('page', String(page));
    url.searchParams.set('language', language);
    url.searchParams.set('include_adult', 'false');

    const response = await this.fetcher(url);
    if (!response.ok) {
      throw new ServiceUnavailableException(`TMDB person search failed with status ${response.status}`);
    }

    const payload = (await response.json()) as { page?: number; total_pages?: number; results?: TmdbPersonSearchResult[] };

    return {
      query,
      page: payload.page ?? page,
      totalPages: payload.total_pages ?? 1,
      items: (payload.results ?? []).map((person) => ({
        id: String(person.id),
        name: person.name ?? '',
        profileUrl: imageUrl('w500', person.profile_path),
        knownForDepartment: person.known_for_department ?? '',
        knownFor: (person.known_for ?? [])
          .filter((result) => this.isSupportedResult(result, 'multi'))
          .map((result) => mapTmdbSearchResult(result)),
      })),
    };
  }

  async personCredits({ personId, language = 'ko-KR' }: PersonCreditsInput): Promise<PersonCreditsResponse> {
    if (!this.apiKey) {
      throw new ServiceUnavailableException('TMDB_API_KEY is not configured');
    }

    const url = new URL(`${this.baseUrl}/person/${personId}/combined_credits`);
    url.searchParams.set('api_key', this.apiKey);
    url.searchParams.set('language', language);

    const response = await this.fetcher(url);
    if (!response.ok) {
      throw new ServiceUnavailableException(`TMDB person credits failed with status ${response.status}`);
    }

    const payload = (await response.json()) as { cast?: TmdbSearchResult[]; crew?: TmdbSearchResult[] };
    const credits = [...(payload.cast ?? []), ...(payload.crew ?? [])];

    return {
      personId,
      items: credits
        .filter((result) => this.isSupportedResult(result, 'multi'))
        .map((result) => mapTmdbSearchResult(result)),
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

function imageUrl(size: 'w500' | 'w780', path?: string | null): string | null {
  return path ? `https://image.tmdb.org/t/p/${size}${path}` : null;
}
