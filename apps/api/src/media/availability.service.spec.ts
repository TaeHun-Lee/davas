import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  AvailabilityObservationEntity,
  ExternalContentRefEntity,
  MediaEntity,
} from '../database/entities';
import { AvailabilityService } from './availability.service';
import { MediaService } from './media.service';
import type {
  AvailabilityProvider,
  ProviderAvailabilityLookup,
} from './ports/availability-provider.port';

class FakeRepository<T extends { id?: string }> {
  private sequence = 0;

  constructor(readonly records: T[] = []) {}

  async findOne(options: { where: Partial<T> }) {
    return (
      this.records.find((record) => this.matches(record, options.where)) ?? null
    );
  }

  async find(options: { where: Partial<T> }) {
    return this.records
      .filter((record) => this.matches(record, options.where))
      .slice()
      .sort((left, right) => {
        const leftDate =
          (left as { observedAt?: Date }).observedAt?.getTime() ?? 0;
        const rightDate =
          (right as { observedAt?: Date }).observedAt?.getTime() ?? 0;
        return rightDate - leftDate;
      });
  }

  create(input: Partial<T>) {
    return { ...input } as T;
  }

  async save(input: T | T[]): Promise<T | T[]> {
    if (Array.isArray(input)) {
      for (const item of input) {
        if (!item.id) {
          item.id = `saved-${++this.sequence}`;
          this.records.push(item);
        }
      }
      return input;
    }
    if (!input.id) {
      input.id = `saved-${++this.sequence}`;
      this.records.push(input);
    }
    return input;
  }

  private matches(record: T, where: Partial<T>) {
    return Object.entries(where).every(
      ([key, value]) => record[key as keyof T] === value,
    );
  }
}

class FakeAvailabilityProvider implements AvailabilityProvider {
  constructor(private readonly result: ProviderAvailabilityLookup | Error) {}

  async getOffers() {
    if (this.result instanceof Error) {
      throw this.result;
    }
    return this.result;
  }

  async getReleaseState() {
    return { sourceProvider: 'TMDB', state: 'UNKNOWN' as const, confidence: 0 };
  }
}

const content = { id: 'content-1', mediaType: 'MOVIE' } as MediaEntity;
const contentRef = {
  id: 'ref-1',
  contentId: content.id,
  provider: 'TMDB',
  externalId: '157336',
  source: 'TMDB',
} as ExternalContentRefEntity;
const now = new Date('2026-08-13T00:00:00.000Z');

function service(
  provider: ProviderAvailabilityLookup | Error,
  refs: ExternalContentRefEntity[] = [contentRef],
  observations: AvailabilityObservationEntity[] = [],
) {
  return new AvailabilityService(
    new FakeRepository([content]) as never,
    new FakeRepository(refs) as never,
    new FakeRepository(observations) as never,
    new FakeAvailabilityProvider(provider),
    { ttlMs: 60_000, now: () => now },
  );
}

describe('AvailabilityService', () => {
  it('stores only real provider offers and de-duplicates the latest Korean observation', async () => {
    const result = await service({
      sourceProvider: 'TMDB',
      status: 'AVAILABLE',
      confidence: 0.8,
      offers: [
        { provider: 'Netflix', offerType: 'STREAM', confidence: 0.8 },
        { provider: 'Netflix', offerType: 'STREAM', confidence: 0.8 },
        { provider: 'Google Play Movies', offerType: 'RENT', confidence: 0.8 },
      ],
    }).refresh(content.id, 'kr');

    assert.equal(result.region, 'KR');
    assert.equal(result.state, 'AVAILABLE');
    assert.equal(result.availability, 'AVAILABLE');
    assert.deepEqual(
      result.offers.map(({ provider, offerType }) => ({ provider, offerType })),
      [
        { provider: 'Netflix', offerType: 'STREAM' },
        { provider: 'Google Play Movies', offerType: 'RENT' },
      ],
    );
  });

  it('distinguishes a successful lookup with no offers from provider failure', async () => {
    const noOffers = await service({
      sourceProvider: 'TMDB',
      status: 'NO_OFFERS',
      confidence: 0.7,
      offers: [],
    }).refresh(content.id);
    const failed = await service(new Error('provider unavailable')).refresh(
      content.id,
    );

    assert.equal(noOffers.state, 'NO_OFFERS');
    assert.equal(noOffers.availability, 'UNAVAILABLE');
    assert.equal(noOffers.confidence, 0.7);
    assert.equal(failed.state, 'PROVIDER_FAILURE');
    assert.equal(failed.availability, 'UNKNOWN');
    assert.equal(failed.confidence, 0);
  });

  it('distinguishes unmapped content, an empty cache, and an expired observation', async () => {
    const lookup = {
      sourceProvider: 'TMDB',
      status: 'NO_OFFERS' as const,
      confidence: 0.7,
      offers: [],
    };
    const unmapped = await service(lookup, []).getCurrent(content.id);
    const unknown = await service(lookup).getCurrent(content.id);
    const expiredObservation = {
      id: 'observation-1',
      contentId: content.id,
      region: 'KR',
      sourceProvider: 'TMDB',
      provider: 'Netflix',
      offerType: 'STREAM',
      status: 'AVAILABLE',
      observedAt: new Date('2026-08-12T23:00:00.000Z'),
      expiresAt: new Date('2026-08-12T23:30:00.000Z'),
      confidence: '0.8',
    } as AvailabilityObservationEntity;
    const expired = await service(
      lookup,
      [contentRef],
      [expiredObservation],
    ).getCurrent(content.id);

    assert.equal(unmapped.state, 'UNMAPPED');
    assert.equal(unmapped.availability, 'UNKNOWN');
    assert.equal(unknown.state, 'UNKNOWN');
    assert.equal(expired.state, 'EXPIRED');
    assert.equal(expired.availability, 'UNKNOWN');
    assert.deepEqual(expired.offers, []);
  });

  it('keeps a cached canonical title readable when metadata refresh fails', async () => {
    const cached = {
      id: content.id,
      externalProvider: 'TMDB',
      externalId: '157336',
      mediaType: 'MOVIE',
      title: 'Interstellar',
      originalTitle: 'Interstellar',
      overview: 'Cached overview',
      tagline: null,
      posterUrl: null,
      backdropUrl: null,
      releaseDate: '2014-11-05',
      runtime: 169,
      genres: ['Science Fiction'],
      country: 'US',
      countries: ['US'],
      tmdbRating: '8.7',
      tmdbVoteCount: 100,
      director: 'Christopher Nolan',
      creators: [],
      cast: [],
      certification: '12',
    } as unknown as MediaEntity;
    const metadata = {
      detail: async () => {
        throw new Error('TMDB unavailable');
      },
    };
    const mediaService = new MediaService(
      metadata as never,
      new FakeRepository([cached]) as never,
    );

    const detail = await mediaService.findDetail(content.id);
    assert.equal(detail.id, content.id);
    assert.equal(detail.title, 'Interstellar');
    assert.equal(detail.overview, 'Cached overview');
  });
});
