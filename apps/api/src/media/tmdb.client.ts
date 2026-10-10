import { DEFAULT_LANGUAGE, DEFAULT_REGION } from '@davas/shared';
import { Inject, Injectable, Optional, ServiceUnavailableException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { MediaSearchResponse, MediaSearchType, MediaType } from '@davas/shared';
import { mapTmdbDetail, TmdbDetailPayload, TmdbMediaDetail } from './tmdb-detail.mapper';
import {
  DavasMediaSearchItem,
  mapTmdbRecommendationResult,
  mapTmdbSearchResult,
  MediaRecommendationItem,
  tmdbImageUrl,
  TmdbSearchResult,
} from './tmdb.mapper';
import type { ProviderAvailabilityLookup, ProviderOffer } from './ports/availability-provider.port';

export type { MediaSearchResponse, MediaSearchType };

type Fetcher = typeof fetch;

type TmdbClientOptions = {
  apiKey?: string;
  baseUrl?: string;
  fetcher?: Fetcher;
  timeoutMs?: number;
};

export const TMDB_CLIENT_OPTIONS = 'TMDB_CLIENT_OPTIONS';

// TMDB normally answers well within a second.
export const TMDB_TIMEOUT_MS = 5_000;

export type MediaSearchInput = {
  query: string;
  type: MediaSearchType;
  page: number;
  language?: string;
  region?: string;
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
  /** Titles carrying every one of these genres. */
  withGenres?: number[];
  /** Titles carrying at least one of these genres; ignored when `withGenres` is set. */
  withAnyGenres?: number[];
  withoutGenres?: number[];
  /** Titles a subscription (or a free or ad-supported plan) on one of these streams in `region`. */
  watchProviderIds?: number[];
  sortBy: string;
  voteCountGte: number;
  reason: string;
};

/** A TMDB watch provider or genre: its id and the name TMDB shows for it. */
export type TmdbCatalogEntry = { id: number; name: string };

export type RecommendationResponse = {
  page: number;
  totalPages: number;
  items: MediaRecommendationItem[];
};

export type MediaDetailInput = {
  externalId: string;
  mediaType: MediaType;
  language?: string;
};

export type WatchProvidersInput = MediaDetailInput & {
  region: string;
  observedAt: Date;
};

type TmdbWatchProvider = {
  provider_name?: string;
};

type TmdbPage<T> = { page?: number; total_pages?: number; results?: T[] };

type TmdbWatchProviderRegion = {
  flatrate?: TmdbWatchProvider[];
  rent?: TmdbWatchProvider[];
  buy?: TmdbWatchProvider[];
  free?: TmdbWatchProvider[];
  ads?: TmdbWatchProvider[];
};

@Injectable()
export class TmdbClient {
  private readonly apiKey?: string;
  private readonly baseUrl: string;
  private readonly fetcher: Fetcher;
  private readonly timeoutMs: number;

  constructor(
    @Optional() configService?: ConfigService,
    @Optional() @Inject(TMDB_CLIENT_OPTIONS) options?: TmdbClientOptions,
  ) {
    this.apiKey = options?.apiKey ?? configService?.get<string>('TMDB_API_KEY');
    this.baseUrl =
      options?.baseUrl ??
      configService?.get<string>('TMDB_BASE_URL') ??
      'https://api.themoviedb.org/3';
    this.fetcher = options?.fetcher ?? fetch;
    this.timeoutMs = options?.timeoutMs ?? TMDB_TIMEOUT_MS;
  }

  async search({
    query,
    type,
    page,
    language = DEFAULT_LANGUAGE,
    region = DEFAULT_REGION,
  }: MediaSearchInput): Promise<MediaSearchResponse> {
    const payload = await this.get<TmdbPage<TmdbSearchResult>>('search', `/search/${type}`, {
      query,
      page: String(page),
      language,
      region,
      include_adult: 'false',
    });
    return {
      query,
      page: payload.page ?? page,
      totalPages: payload.total_pages ?? 1,
      items: (payload.results ?? [])
        .filter((result) => this.isSupportedResult(result, type))
        .map((result) => mapTmdbSearchResult(this.withMediaType(result, type))),
    };
  }

  async trending({
    period,
    page,
    language = DEFAULT_LANGUAGE,
  }: TrendingRecommendationsInput): Promise<RecommendationResponse> {
    const payload = await this.get<TmdbPage<TmdbSearchResult>>(
      'trending',
      `/trending/all/${period}`,
      { page: String(page), language },
    );
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
    language = DEFAULT_LANGUAGE,
    region = DEFAULT_REGION,
    withGenres,
    withAnyGenres,
    withoutGenres,
    watchProviderIds,
    sortBy,
    voteCountGte,
    reason,
  }: DiscoverRecommendationsInput): Promise<RecommendationResponse> {
    const genres = withGenres?.length
      ? withGenres.join(',')
      : withAnyGenres?.length
        ? withAnyGenres.join('|')
        : undefined;
    const providers = watchProviderIds?.length ? watchProviderIds.join('|') : undefined;
    const payload = await this.get<TmdbPage<TmdbSearchResult>>(
      'discover',
      `/discover/${mediaType}`,
      {
        page: String(page),
        language,
        region,
        with_genres: genres,
        without_genres: withoutGenres?.length ? withoutGenres.join(',') : undefined,
        watch_region: providers ? region : undefined,
        with_watch_providers: providers,
        with_watch_monetization_types: providers ? 'flatrate|free|ads' : undefined,
        sort_by: sortBy,
        'vote_count.gte': String(voteCountGte),
        include_adult: 'false',
      },
    );
    return {
      page: payload.page ?? page,
      totalPages: payload.total_pages ?? 1,
      items: (payload.results ?? [])
        .map((result) => this.withMediaType(result, mediaType))
        .map((result) => mapTmdbRecommendationResult(result, reason)),
    };
  }

  /** The streaming services TMDB knows in a region, with the ids discover filters by. */
  async watchProviderCatalog(
    mediaType: 'movie' | 'tv',
    region: string,
  ): Promise<TmdbCatalogEntry[]> {
    const payload = await this.get<{
      results?: Array<{ provider_id?: number; provider_name?: string }>;
    }>('watch provider list', `/watch/providers/${mediaType}`, { watch_region: region });
    return (payload.results ?? []).flatMap((provider) =>
      provider.provider_id && provider.provider_name?.trim()
        ? [{ id: provider.provider_id, name: provider.provider_name.trim() }]
        : [],
    );
  }

  /** TMDB's genres with their names in `language`, the names stored on titles. */
  async genreCatalog(
    mediaType: 'movie' | 'tv',
    language = DEFAULT_LANGUAGE,
  ): Promise<TmdbCatalogEntry[]> {
    const payload = await this.get<{ genres?: Array<{ id?: number; name?: string }> }>(
      'genre list',
      `/genre/${mediaType}/list`,
      { language },
    );
    return (payload.genres ?? []).flatMap((genre) =>
      genre.id && genre.name?.trim() ? [{ id: genre.id, name: genre.name.trim() }] : [],
    );
  }

  async detail({
    externalId,
    mediaType,
    language = DEFAULT_LANGUAGE,
  }: MediaDetailInput): Promise<TmdbMediaDetail> {
    const resource = mediaType === 'TV' ? 'tv' : 'movie';
    const payload = await this.get<TmdbDetailPayload>('detail', `/${resource}/${externalId}`, {
      language,
      append_to_response:
        mediaType === 'TV' ? 'credits,images,content_ratings' : 'credits,images,release_dates',
      include_image_language: `${language.slice(0, 2)},en,null`,
    });
    return mapTmdbDetail(payload, mediaType);
  }

  async watchProviders({
    externalId,
    mediaType,
    region,
  }: WatchProvidersInput): Promise<ProviderAvailabilityLookup> {
    const resource = mediaType === 'TV' ? 'tv' : 'movie';
    const payload = await this.get<{ results?: Record<string, TmdbWatchProviderRegion> }>(
      'watch providers',
      `/${resource}/${externalId}/watch/providers`,
      {},
    );
    const regionResult = payload.results?.[region.toUpperCase()];
    const offers: ProviderOffer[] = [];
    const seen = new Set<string>();
    const append = (
      items: TmdbWatchProvider[] | undefined,
      offerType: ProviderOffer['offerType'],
    ) => {
      for (const item of items ?? []) {
        const provider = item.provider_name?.trim();
        const key = `${provider ?? ''}:${offerType}`;
        if (!provider || seen.has(key)) {
          continue;
        }
        seen.add(key);
        offers.push({ provider, offerType, confidence: 0.8 });
      }
    };
    append(regionResult?.flatrate, 'STREAM');
    append(regionResult?.rent, 'RENT');
    append(regionResult?.buy, 'BUY');
    append(regionResult?.free, 'FREE');
    append(regionResult?.ads, 'ADS');

    return {
      sourceProvider: 'TMDB',
      status: offers.length > 0 ? 'AVAILABLE' : 'NO_OFFERS',
      offers,
      confidence: offers.length > 0 ? 0.8 : 0.7,
    };
  }

  /**
   * One GET with the API key. A missing key, a TMDB that does not answer within a few seconds
   * (a slow TMDB must not hold a search, a detail sheet or a group recommendation open) and a
   * failed answer are each a 503 named after `label`.
   */
  private async get<T>(label: string, path: string, params: Record<string, string | undefined>) {
    if (!this.apiKey) {
      throw new ServiceUnavailableException('TMDB_API_KEY is not configured');
    }
    const url = new URL(`${this.baseUrl}${path}`);
    url.searchParams.set('api_key', this.apiKey);
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined) url.searchParams.set(key, value);
    }
    let response: Response;
    try {
      response = await this.fetcher(url, { signal: AbortSignal.timeout(this.timeoutMs) });
    } catch (error) {
      const reason = error instanceof Error ? error.name : 'Error';
      throw new ServiceUnavailableException(`TMDB ${label} did not answer (${reason})`);
    }
    if (!response.ok) {
      throw new ServiceUnavailableException(`TMDB ${label} failed with status ${response.status}`);
    }
    return (await response.json()) as T;
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
