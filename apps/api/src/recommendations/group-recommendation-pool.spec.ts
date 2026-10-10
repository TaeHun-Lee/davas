import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { AvailabilityObservationEntity, MediaEntity } from '../database/entities';
import {
  GroupRecommendationPool,
  latestAvailability,
  onChosenService,
  type PoolRequest,
} from './group-recommendation-pool';

type Operator = { _type: string; _value: unknown };

function matches(actual: unknown, expected: unknown): boolean {
  if (expected && typeof expected === 'object' && '_type' in expected) {
    const operator = expected as Operator;
    if (operator._type === 'in') return (operator._value as unknown[]).includes(actual);
    if (operator._type === 'not') return !matches(actual, operator._value);
    if (operator._type === 'moreThan') {
      return actual instanceof Date && actual.getTime() > (operator._value as Date).getTime();
    }
  }
  return actual === expected;
}

const where = <T extends object>(rows: T[], filter: Record<string, unknown>) =>
  rows.filter((row) =>
    Object.entries(filter).every(([key, expected]) =>
      matches((row as Record<string, unknown>)[key], expected),
    ),
  );

const NOW = new Date('2026-10-10T03:00:00.000Z');
const HOUR = 60 * 60 * 1000;

function title(id: string, votes: number, options: Partial<MediaEntity> = {}) {
  return Object.assign(new MediaEntity(), {
    id,
    externalProvider: 'TMDB' as const,
    externalId: `tmdb-${id}`,
    mediaType: 'MOVIE' as const,
    releaseDate: '2024-01-01',
    tmdbVoteCount: votes,
    ...options,
  });
}

function seen(contentId: string, provider: string, expiresInHours: number, offerType = 'STREAM') {
  return Object.assign(new AvailabilityObservationEntity(), {
    contentId,
    region: 'KR',
    provider,
    offerType,
    status: 'AVAILABLE',
    observedAt: new Date(NOW.getTime() - 2 * HOUR),
    expiresAt: new Date(NOW.getTime() + expiresInHours * HOUR),
    confidence: '0.8',
  });
}

type Discovered = { externalId: string; mediaType: 'MOVIE' | 'TV' };

function setup(
  options: {
    media?: MediaEntity[];
    observations?: AvailabilityObservationEntity[];
    discover?: Discovered[][];
    trending?: Discovered[];
    providerCatalogFails?: boolean;
  } = {},
) {
  const media = [...(options.media ?? [])];
  const observations = [...(options.observations ?? [])];
  const calls = {
    providerCatalog: 0,
    genreCatalog: 0,
    discover: [] as Array<Record<string, unknown>>,
    trending: 0,
    imported: [] as string[],
    refreshed: [] as string[],
  };
  const mediaRepository = {
    find: async (query: { where: Record<string, unknown>; take?: number }) => {
      const found = where(media, query.where).sort(
        (a, b) => (b.tmdbVoteCount ?? 0) - (a.tmdbVoteCount ?? 0),
      );
      return found.slice(0, query.take ?? found.length);
    },
  };
  const observationRepository = {
    find: async (query: { where: Record<string, unknown> }) => where(observations, query.where),
  };
  const tmdb = {
    watchProviderCatalog: async () => {
      calls.providerCatalog += 1;
      if (options.providerCatalogFails) throw new Error('TMDB down');
      return [
        { id: 8, name: 'Netflix' },
        { id: 1796, name: 'Netflix basic with Ads' },
        { id: 356, name: 'wavve' },
      ];
    },
    genreCatalog: async () => {
      calls.genreCatalog += 1;
      return [
        { id: 35, name: '코미디' },
        { id: 18, name: '드라마' },
        { id: 27, name: '공포' },
      ];
    },
    discover: async (input: Record<string, unknown> & { page: number }) => {
      calls.discover.push(input);
      const pages = options.discover ?? [];
      return { items: pages[input.page - 1] ?? [], totalPages: pages.length };
    },
    trending: async () => {
      calls.trending += 1;
      return { items: options.trending ?? [], totalPages: 1 };
    },
  };
  const mediaSelection = {
    select: async (selection: { externalId: string; mediaType: 'MOVIE' | 'TV' }) => {
      if (selection.externalId === 'broken') throw new Error('TMDB hiccup');
      calls.imported.push(selection.externalId);
      const created = title(`imported-${selection.externalId}`, 10, {
        externalId: selection.externalId,
        mediaType: selection.mediaType,
      });
      media.push(created);
      return created;
    },
  };
  const availability = {
    refresh: async (contentId: string) => {
      calls.refreshed.push(contentId);
    },
  };
  const pool = new GroupRecommendationPool(
    mediaRepository as never,
    observationRepository as never,
    availability as never,
    mediaSelection as never,
    tmdb as never,
  );
  pool.now = () => NOW;
  return { pool, calls };
}

const request = (overrides: Partial<PoolRequest> = {}): PoolRequest => ({
  region: 'KR',
  services: ['netflix', 'netflix basic with ads'],
  contentTypes: ['MOVIE'],
  moodTags: [],
  avoidTags: [],
  ...overrides,
});

describe('group recommendation candidate pool', () => {
  it('imports titles the chosen services stream when the stored ones are mostly watched', async () => {
    // Like production: plenty of stored movies, nearly all of them already recorded.
    const watched = Array.from({ length: 140 }, (_, index) => title(`watched-${index}`, 5000));
    const { pool, calls } = setup({
      media: [...watched, title('unseen-1', 100)],
      discover: [
        [
          { externalId: 'tmdb-watched-0', mediaType: 'MOVIE' },
          { externalId: 'n1', mediaType: 'MOVIE' },
          { externalId: 'broken', mediaType: 'MOVIE' },
          { externalId: 'n2', mediaType: 'MOVIE' },
        ],
      ],
    });

    await pool.warm(
      request({ moodTags: ['웃긴'], avoidTags: ['공포'] }),
      new Set(watched.map((item) => item.id)),
    );

    assert.equal(calls.discover[0].watchProviderIds?.toString(), '8,1796');
    assert.deepEqual(calls.discover[0].withAnyGenres, [35]);
    assert.deepEqual(calls.discover[0].withoutGenres, [27]);
    // A stored title is not imported again, and one failed import does not stop the rest.
    assert.deepEqual(calls.imported, ['n1', 'n2']);
    // The new titles are asked where they stream first; watched titles are never asked.
    assert.deepEqual(calls.refreshed.slice(0, 2), ['imported-n1', 'imported-n2']);
    assert.ok(calls.refreshed.includes('unseen-1'));
    assert.ok(!calls.refreshed.some((id) => id.startsWith('watched-')));
    assert.equal(calls.trending, 0);
  });

  it('falls back to trending titles when the service list cannot be read', async () => {
    const { pool, calls } = setup({
      providerCatalogFails: true,
      trending: [
        { externalId: 't1', mediaType: 'MOVIE' },
        { externalId: 't2', mediaType: 'TV' },
      ],
    });
    await pool.warm(request(), new Set());
    assert.equal(calls.discover.length, 0);
    assert.deepEqual(calls.imported, ['t1']);
  });

  it('leaves a ready pool alone and refreshes stale titles within budget', async () => {
    const ready = Array.from({ length: 40 }, (_, index) => title(`ready-${index}`, 1000 - index));
    const { pool, calls } = setup({
      media: [
        ...ready,
        title('upcoming', 2000, { releaseDate: '2999-01-01' }),
        title('rejected', 3000),
      ],
      observations: ready.map((item, index) =>
        // Half are still fresh; the rest expired but were last seen on Netflix.
        seen(item.id, 'Netflix', index < 20 ? 3 : -1),
      ),
    });

    await pool.warm(request(), new Set(['rejected']));

    assert.equal(calls.providerCatalog, 0, 'nothing imported');
    assert.deepEqual(calls.imported, []);
    assert.equal(calls.refreshed.length, 20);
    assert.ok(calls.refreshed.every((id) => Number(id.split('-')[1]) >= 20));
    assert.ok(!calls.refreshed.includes('upcoming') && !calls.refreshed.includes('rejected'));
  });

  it('counts only subscription offers on a chosen service as ready', async () => {
    const rentals = Array.from({ length: 40 }, (_, index) => title(`rental-${index}`, 500));
    const { pool, calls } = setup({
      media: rentals,
      observations: rentals.map((item) => seen(item.id, 'Netflix', 3, 'RENT')),
      discover: [[{ externalId: 'n1', mediaType: 'MOVIE' }]],
    });
    await pool.warm(request(), new Set());
    assert.deepEqual(calls.imported, ['n1']);
  });

  it('remembers TMDB service and genre lists for a day, and asks again after a failure', async () => {
    const { pool, calls } = setup({ discover: [[]] });
    await pool.warm(request({ moodTags: ['웃긴'] }), new Set());
    await pool.warm(request({ moodTags: ['웃긴'] }), new Set());
    assert.equal(calls.providerCatalog, 1);
    assert.equal(calls.genreCatalog, 1);

    const failing = setup({ providerCatalogFails: true });
    await failing.pool.warm(request(), new Set());
    await failing.pool.warm(request(), new Set());
    assert.equal(failing.calls.providerCatalog, 2);
  });

  it('reads the newest observation of each title and what it offered', () => {
    const older = Object.assign(seen('a', 'wavve', 1), {
      observedAt: new Date(NOW.getTime() - 9 * HOUR),
    });
    const latest = latestAvailability([older, seen('a', 'Netflix', 3), seen('a', 'Watcha', 3)]);
    assert.deepEqual(
      latest.get('a')?.offers.map((offer) => offer.provider),
      ['Netflix', 'Watcha'],
    );
    assert.equal(onChosenService({ provider: 'Netflix', offerType: 'STREAM' }, ['netflix']), true);
    assert.equal(onChosenService({ provider: 'Netflix', offerType: 'RENT' }, ['netflix']), false);
    assert.equal(onChosenService({ provider: 'wavve', offerType: 'ADS' }, ['netflix']), false);
  });
});
