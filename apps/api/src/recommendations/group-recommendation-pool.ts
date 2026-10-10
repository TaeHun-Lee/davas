import { Injectable, Optional } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, MoreThan, Not, Repository } from 'typeorm';
import { mapWithConcurrency } from '../common/concurrency';
import { seoulToday } from '../common/seoul-date';
import { AvailabilityObservationEntity, MediaEntity } from '../database/entities';
import { AvailabilityService } from '../media/availability.service';
import { MediaSelectionService } from '../media/media-selection.service';
import { SUBSCRIPTION_OFFER_TYPES } from '../media/ports/availability-provider.port';
import { TmdbClient, type TmdbCatalogEntry } from '../media/tmdb.client';
import { tagGenreNames } from './group-recommendation.algorithm';

export type PoolRequest = {
  region: string;
  /** Lower-cased TMDB provider names of the chosen services. */
  services: string[];
  contentTypes: Array<'MOVIE' | 'TV'>;
  moodTags: string[];
  avoidTags: string[];
};

type ContentType = PoolRequest['contentTypes'][number];

/** The newest observation of a title in a region: when it expires and what it offered. */
export type LatestAvailability = {
  status: string;
  observedAt: Date;
  expiresAt: Date;
  offers: Array<{ provider: string; offerType: string; confidence: number }>;
};

// A pick wants at least this many unwatched titles known to stream on a chosen service. Below
// it, titles those services stream are imported from TMDB before ranking.
const READY_TARGET = 30;
const IMPORT_LIMIT = 20;
// Later discover pages are read only while the earlier ones hold titles already stored.
const IMPORT_PAGES = 3;
const DISCOVER_MIN_VOTES = 20;
// "Where can we watch it" is asked again for at most this many titles per pick.
const REFRESH_LIMIT = 24;
// The most-voted unwatched titles looked at when choosing what to refresh.
const SCAN_LIMIT = 250;
// An observation older than this says nothing about where a title streams now.
const KNOWN_WINDOW_MS = 30 * 24 * 60 * 60 * 1000;
// TMDB's provider and genre lists barely change; one lookup a day per list is plenty.
const CATALOG_TTL_MS = 24 * 60 * 60 * 1000;

const normalized = (value: string) => value.trim().toLocaleLowerCase('en-US');
const tmdbType = (type: ContentType) => (type === 'TV' ? 'tv' : 'movie');

/** Groups observations (newest first) into each title's newest observation. */
export function latestAvailability(rows: AvailabilityObservationEntity[]) {
  const latest = new Map<string, LatestAvailability>();
  for (const row of [...rows].sort((a, b) => b.observedAt.getTime() - a.observedAt.getTime())) {
    const current = latest.get(row.contentId);
    if (current && current.observedAt.getTime() !== row.observedAt.getTime()) continue;
    const entry = current ?? {
      status: row.status,
      observedAt: row.observedAt,
      expiresAt: row.expiresAt,
      offers: [],
    };
    if (row.status === 'AVAILABLE') {
      entry.offers.push({
        provider: row.provider,
        offerType: row.offerType,
        confidence: Number(row.confidence),
      });
      entry.status = 'AVAILABLE';
    }
    latest.set(row.contentId, entry);
  }
  return latest;
}

/** Whether an offer is a subscription (or free) offer on one of the chosen services. */
export function onChosenService(
  offer: { provider: string; offerType: string },
  services: readonly string[],
) {
  return (
    SUBSCRIPTION_OFFER_TYPES.has(offer.offerType) && services.includes(normalized(offer.provider))
  );
}

/**
 * The titles a group pick draws from. Candidates only come from stored titles, and only titles
 * with a fresh "where can we watch it" observation on a chosen service pass the hard filters.
 * A couple's database holds mostly what they already watched, so the pool counts and refreshes
 * only titles the participants have not seen or turned down. When too few of those are known
 * to stream on the chosen services, it imports titles TMDB says those services stream (falling
 * back to trending titles when the service lookup fails), then refreshes availability, imported
 * titles first, within fixed budgets. Failures leave the pool as it is.
 */
@Injectable()
export class GroupRecommendationPool {
  private readonly catalogs = new Map<
    string,
    { expiresAt: number; value: Promise<TmdbCatalogEntry[]> }
  >();

  constructor(
    @InjectRepository(MediaEntity)
    private readonly media: Repository<MediaEntity>,
    @InjectRepository(AvailabilityObservationEntity)
    private readonly observations: Repository<AvailabilityObservationEntity>,
    private readonly availability: AvailabilityService,
    @Optional() private readonly mediaSelection?: MediaSelectionService,
    @Optional() private readonly tmdb?: TmdbClient,
  ) {}

  /** The clock; tests set it. */
  now: () => Date = () => new Date();

  async warm(request: PoolRequest, excluded: ReadonlySet<string>) {
    try {
      const today = seoulToday();
      const released = (item: Pick<MediaEntity, 'releaseDate'>) =>
        !item.releaseDate || item.releaseDate <= today;
      const eligible = (await this.unseen(request, excluded)).filter(released);
      const latest = await this.latestFor(
        eligible.map((item) => item.id),
        request.region,
      );
      const knownOnService = (id: string) =>
        (latest.get(id)?.offers ?? []).some((offer) => onChosenService(offer, request.services));
      const known = eligible.filter((item) => knownOnService(item.id)).length;
      const imported =
        known < READY_TARGET ? (await this.importTitles(request)).filter(released) : [];

      const now = this.now().getTime();
      const stale = (id: string) => (latest.get(id)?.expiresAt.getTime() ?? 0) <= now;
      const refresh = [
        ...imported.map((item) => item.id),
        ...eligible.filter((item) => stale(item.id) && knownOnService(item.id)).map((i) => i.id),
        ...eligible.filter((item) => stale(item.id) && !knownOnService(item.id)).map((i) => i.id),
      ];
      await mapWithConcurrency([...new Set(refresh)].slice(0, REFRESH_LIMIT), 4, async (id) => {
        try {
          await this.availability.refresh(id, request.region);
        } catch {
          // Recorded as a provider failure by the availability service when it can be.
        }
      });
    } catch {
      // Recommendations still run on whatever the pool already has.
    }
  }

  /** Stored titles of the requested types the participants have not watched or turned down. */
  unseen(request: Pick<PoolRequest, 'contentTypes'>, excluded: ReadonlySet<string>) {
    return this.media.find({
      where: {
        mediaType: In(request.contentTypes),
        ...(excluded.size ? { id: Not(In([...excluded])) } : {}),
      },
      order: { tmdbVoteCount: 'DESC', id: 'ASC' },
      take: SCAN_LIMIT,
    });
  }

  /** Each title's newest observation that is still fresh. */
  async freshFor(contentIds: string[], region: string) {
    if (!contentIds.length) return new Map<string, LatestAvailability>();
    return latestAvailability(
      await this.observations.find({
        where: { contentId: In(contentIds), region, expiresAt: MoreThan(this.now()) },
      }),
    );
  }

  private async latestFor(contentIds: string[], region: string) {
    if (!contentIds.length) return new Map<string, LatestAvailability>();
    return latestAvailability(
      await this.observations.find({
        where: {
          contentId: In(contentIds),
          region,
          observedAt: MoreThan(new Date(this.now().getTime() - KNOWN_WINDOW_MS)),
        },
      }),
    );
  }

  private async importTitles(request: PoolRequest) {
    if (!this.tmdb || !this.mediaSelection) return [];
    const wanted = await this.titlesToImport(request);
    const imported: MediaEntity[] = [];
    await mapWithConcurrency(wanted, 3, async (item) => {
      try {
        imported.push(
          await this.mediaSelection!.select({
            externalProvider: 'TMDB',
            externalId: item.externalId,
            mediaType: item.mediaType,
          }),
        );
      } catch {
        // One title failing to import does not stop the others.
      }
    });
    return imported;
  }

  /**
   * Titles not stored yet, split evenly between the requested types. Importing a stored title
   * again would only ask TMDB for its details once more without growing the pool.
   */
  private async titlesToImport(request: PoolRequest) {
    const quota = Math.ceil(IMPORT_LIMIT / request.contentTypes.length);
    const picked: Array<{ externalId: string; mediaType: ContentType }> = [];
    for (const type of request.contentTypes) {
      const forType: typeof picked = [];
      for (let page = 1; page <= IMPORT_PAGES && forType.length < quota; page += 1) {
        const source = await this.sourcePage(type, page, request);
        const wanted = source.items.filter(
          (item) =>
            item.mediaType === type &&
            !forType.some((picked) => picked.externalId === item.externalId),
        );
        const stored = wanted.length
          ? await this.media.find({
              where: {
                externalProvider: 'TMDB',
                mediaType: type,
                externalId: In(wanted.map((item) => item.externalId)),
              },
              select: { id: true, externalId: true },
            })
          : [];
        const storedIds = new Set(stored.map((item) => item.externalId));
        forType.push(
          ...wanted
            .filter((item) => !storedIds.has(item.externalId))
            .map((item) => ({ externalId: item.externalId, mediaType: type })),
        );
        if (page >= (source.totalPages ?? 1)) break;
      }
      picked.push(...forType.slice(0, quota));
    }
    return picked.slice(0, IMPORT_LIMIT);
  }

  /** Titles the chosen services stream, fitting the moods; trending titles if that lookup fails. */
  private async sourcePage(type: ContentType, page: number, request: PoolRequest) {
    const providerIds = await this.catalogIds(
      `providers:${tmdbType(type)}:${request.region}`,
      () => this.tmdb!.watchProviderCatalog(tmdbType(type), request.region),
      request.services,
    );
    if (!providerIds.length) {
      return this.tmdb!.trending({ period: 'week', page, language: 'ko-KR' });
    }
    const genreKey = `genres:${tmdbType(type)}`;
    const loadGenres = () => this.tmdb!.genreCatalog(tmdbType(type));
    const [withAnyGenres, withoutGenres] = await Promise.all([
      this.catalogIds(genreKey, loadGenres, request.moodTags.flatMap(tagGenreNames)),
      this.catalogIds(genreKey, loadGenres, request.avoidTags.flatMap(tagGenreNames)),
    ]);
    return this.tmdb!.discover({
      mediaType: tmdbType(type),
      page,
      region: request.region,
      watchProviderIds: providerIds,
      withAnyGenres,
      withoutGenres,
      sortBy: 'popularity.desc',
      voteCountGte: DISCOVER_MIN_VOTES,
      reason: 'group-pool',
    });
  }

  /** The ids of the catalog entries named in `names`; none when the lookup fails. */
  private async catalogIds(
    key: string,
    load: () => Promise<TmdbCatalogEntry[]>,
    names: readonly string[],
  ) {
    if (!names.length) return [];
    const wanted = new Set(names.map(normalized));
    try {
      const entries = await this.catalog(key, load);
      return entries.filter((entry) => wanted.has(normalized(entry.name))).map((entry) => entry.id);
    } catch {
      return [];
    }
  }

  private catalog(key: string, load: () => Promise<TmdbCatalogEntry[]>) {
    const cached = this.catalogs.get(key);
    if (cached && cached.expiresAt > this.now().getTime()) return cached.value;
    const value = load().catch((error: unknown) => {
      // A failed lookup is asked again next time instead of being remembered for a day.
      this.catalogs.delete(key);
      throw error;
    });
    this.catalogs.set(key, { expiresAt: this.now().getTime() + CATALOG_TTL_MS, value });
    return value;
  }
}
