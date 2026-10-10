import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  KobisMovieEntity,
  KobisShowtimeEntity,
  KobisSyncRunEntity,
  KobisTheaterEntity,
} from '../database/entities';
import type { KobisTheaterDay } from './kobis-schedule.client';
import { lastNoon, nextNoon, ShowtimeSyncService, syncEnabled } from './showtime-sync.service';

type Operator = { _type: string; _value: unknown };
type Row = Record<string, unknown>;

function matches(actual: unknown, expected: unknown): boolean {
  if (expected && typeof expected === 'object' && '_type' in expected) {
    const { _type: type, _value: value } = expected as Operator;
    if (type === 'in') return (value as unknown[]).includes(actual);
    if (type === 'not') return !matches(actual, value);
    if (type === 'lessThan') return String(actual) < String(value);
    if (type === 'moreThanOrEqual') return String(actual) >= String(value);
  }
  return actual === expected;
}
const where = (row: Row, filter: Row) =>
  Object.entries(filter).every(([key, expected]) => matches(row[key], expected));

/** The repositories the sync uses, over arrays. */
function store() {
  const tables = {
    theaters: [] as Row[],
    showtimes: [] as Row[],
    movies: [] as Row[],
    runs: [] as Row[],
  };
  let id = 0;
  const repository = (rows: Row[], key = 'id') => ({
    create: (value: Row) => ({ ...value }),
    save: async (value: Row) => {
      value[key] ??= `row-${++id}`;
      const index = rows.findIndex((row) => row[key] === value[key]);
      if (index >= 0) rows[index] = { ...rows[index], ...value };
      else rows.push({ ...value });
      return value;
    },
    insert: async (values: Row[]) => void rows.push(...values.map((value) => ({ ...value }))),
    upsert: async (values: Row[]) => {
      for (const value of values) {
        const index = rows.findIndex((row) => row[key] === value[key]);
        if (index >= 0) rows[index] = { ...rows[index], ...value };
        else rows.push({ ...value });
      }
    },
    update: async (filter: Row | string, values: Row) => {
      for (const row of rows) {
        if (typeof filter === 'string' ? row[key] === filter : where(row, filter))
          Object.assign(row, values);
      }
    },
    delete: async (filter: Row) => {
      const kept = rows.filter((row) => !where(row, filter));
      rows.splice(0, rows.length, ...kept);
    },
    find: async ({ where: filter }: { where: Row }) => rows.filter((row) => where(row, filter)),
    findOne: async ({ where: filter }: { where: Row }) =>
      rows.filter((row) => where(row, filter)).at(-1) ?? null,
  });
  const repos = {
    theaters: repository(tables.theaters, 'code'),
    showtimes: repository(tables.showtimes),
    movies: repository(tables.movies, 'code'),
    runs: repository(tables.runs),
  };
  const byEntity = new Map<unknown, unknown>([
    [KobisTheaterEntity, repos.theaters],
    [KobisShowtimeEntity, repos.showtimes],
    [KobisMovieEntity, repos.movies],
    [KobisSyncRunEntity, repos.runs],
  ]);
  const dataSource = {
    transaction: async (work: (manager: unknown) => Promise<void>) =>
      work({ getRepository: (entity: unknown) => byEntity.get(entity) }),
  };
  return { tables, repos, dataSource };
}

const NOW = new Date('2026-10-10T03:00:00.000Z'); // 12:00 KST

/** Seoul has two theaters, Gyeonggi one; theater C fails, B plays only today. */
function fakeKobis(
  schedules: Record<string, Record<string, KobisTheaterDay['rows']>>,
  failing = new Set<string>(),
) {
  const asked: string[] = [];
  const client = {
    requests: 0,
    basicAreas: async (wide: string) => {
      client.requests += 1;
      return wide === '0105001'
        ? [{ code: 'guro', name: '구로구' }]
        : [{ code: 'suwon', name: '수원시' }];
    },
    theaters: async (_wide: string, area: string) => {
      client.requests += 1;
      return area === 'guro'
        ? [
            { code: 'A', name: '씨네큐 신도림' },
            { code: 'B', name: 'CGV 구로' },
          ]
        : [{ code: 'C', name: 'CGV 수원' }];
    },
    schedule: async (code: string, day: string): Promise<KobisTheaterDay> => {
      client.requests += 1;
      asked.push(`${code}:${day}`);
      if (failing.has(code)) throw new Error('timeout');
      return { homepageUrl: `https://${code}.example`, rows: schedules[code]?.[day] ?? [] };
    },
  };
  return { client, asked };
}

const row = (movieCode: string, movieTitle: string, times = ['19:30']) => ({
  screenName: '01관',
  movieCode,
  movieTitle,
  times,
});

function setup(options: {
  kobis: ReturnType<typeof fakeKobis>;
  linked?: Map<string, unknown> | null;
}) {
  const { tables, repos, dataSource } = store();
  const matched: string[] = [];
  const matcher = {
    configured: options.linked !== null,
    match: async (code: string) => {
      matched.push(code);
      const tmdb = options.linked?.get(code) ?? null;
      return {
        film: {
          code,
          title: `film ${code}`,
          titleEn: null,
          originalTitle: null,
          productionYear: 2026,
          openDate: '2026-10-01',
          directors: [],
        },
        tmdb,
      };
    },
  };
  const service = new ShowtimeSyncService(
    repos.theaters as never,
    repos.showtimes as never,
    repos.movies as never,
    repos.runs as never,
    dataSource as never,
    matcher as never,
  );
  service.now = () => NOW;
  service.sleep = async () => undefined;
  service.createClient = () => options.kobis.client as never;
  return { service, tables, matched };
}

describe('daily KOBIS showtime sync', () => {
  it('runs at 12:00 in Korea, and only in production unless told otherwise', () => {
    assert.equal(
      nextNoon(new Date('2026-10-10T02:59:00Z')).toISOString(),
      '2026-10-10T03:00:00.000Z',
    );
    assert.equal(
      nextNoon(new Date('2026-10-10T03:00:00Z')).toISOString(),
      '2026-10-11T03:00:00.000Z',
    );
    assert.equal(
      lastNoon(new Date('2026-10-10T02:00:00Z')).toISOString(),
      '2026-10-09T03:00:00.000Z',
    );
    assert.equal(syncEnabled(undefined, 'production'), true);
    assert.equal(syncEnabled(undefined, 'development'), false);
    assert.equal(syncEnabled('off', 'production'), false);
    assert.equal(syncEnabled('on', 'test'), true);
  });

  it('reads every theater for a week, keeps a failed theater as it was, and links new films', async () => {
    const kobis = fakeKobis(
      {
        A: {
          '2026-10-10': [row('m1', '오디세이(4D)', ['11:40', '18:45'])],
          '2026-10-12': [row('m2', '룩백(디지털)')],
        },
        B: { '2026-10-10': [row('m1', '오디세이(디지털)')] },
      },
      new Set(['C']),
    );
    const { service, tables, matched } = setup({
      kobis,
      linked: new Map([
        [
          'm1',
          { externalId: '1368337', mediaType: 'MOVIE', title: '오디세이', reason: 'now-showing' },
        ],
      ]),
    });
    // Yesterday's rows go; theater C's stored week stays because today's read failed.
    tables.showtimes.push(
      { id: 'old', theaterCode: 'A', showDate: '2026-10-09', movieCode: 'm1', times: ['10:00'] },
      { id: 'kept', theaterCode: 'C', showDate: '2026-10-11', movieCode: 'm1', times: ['10:00'] },
    );

    const run = await service.run();

    // A plays on the 12th after an empty 11th, so it reads on until two empty days in a row.
    assert.deepEqual(
      kobis.asked.filter((ask) => ask.startsWith('A:')),
      ['A:2026-10-10', 'A:2026-10-11', 'A:2026-10-12', 'A:2026-10-13', 'A:2026-10-14'],
    );
    // B plays only today: it stops after two empty days.
    assert.deepEqual(
      kobis.asked.filter((ask) => ask.startsWith('B:')),
      ['B:2026-10-10', 'B:2026-10-11', 'B:2026-10-12'],
    );
    assert.deepEqual(
      tables.showtimes
        .map(
          (item) => `${item.theaterCode}:${item.showDate}:${item.movieCode}:${item.format ?? '-'}`,
        )
        .sort(),
      ['A:2026-10-10:m1:FOUR_DX', 'A:2026-10-12:m2:-', 'B:2026-10-10:m1:-', 'C:2026-10-11:m1:-'],
    );
    assert.deepEqual(
      tables.theaters.map(
        (item) =>
          `${item.code}:${item.wideAreaName}:${item.basicAreaName}:${item.homepageUrl ?? '-'}`,
      ),
      [
        'A:서울시:구로구:https://A.example',
        'B:서울시:구로구:https://B.example',
        'C:경기도:수원시:-',
      ],
    );
    assert.deepEqual(matched.sort(), ['m1', 'm2']);
    assert.deepEqual(
      tables.movies.map((item) => `${item.code}:${item.matchStatus}:${item.tmdbId ?? '-'}`).sort(),
      ['m1:MATCHED:1368337', 'm2:UNMATCHED:-'],
    );
    assert.equal((tables.movies.find((item) => item.code === 'm1')?.tmdb as Row).reason, undefined);
    assert.equal(run?.status, 'SUCCEEDED');
    assert.equal(run?.theaters, 3);
    assert.equal(run?.failedTheaters, 1);
    assert.equal(run?.showtimes, 3);
    assert.equal(run?.moviesMatched, 1);
    assert.ok((run?.requests ?? 0) > 10);
  });

  it('does not look films up again before they are due, and works without a KOBIS key', async () => {
    const kobis = fakeKobis({ A: { '2026-10-10': [row('m1', '오디세이')] } });
    const first = setup({ kobis, linked: new Map() });
    first.tables.movies.push({
      code: 'm1',
      matchStatus: 'UNMATCHED',
      checkedAt: new Date('2026-10-08T00:00:00Z'),
    });
    await first.service.run();
    assert.deepEqual(first.matched, [], 'looked up two days ago, due again in a week');

    const keyless = setup({
      kobis: fakeKobis({ A: { '2026-10-10': [row('m1', '오디세이')] } }),
      linked: null,
    });
    const run = await keyless.service.run();
    assert.equal(run?.status, 'SUCCEEDED');
    assert.deepEqual(keyless.matched, []);
    assert.equal(keyless.tables.showtimes.length, 1);
  });

  it('gives up for the day when KOBIS keeps failing, and catches up after a missed noon', async () => {
    const down = fakeKobis({}, new Set(['A', 'B', 'C']));
    const { service, tables } = setup({ kobis: down, linked: new Map() });
    const run = await service.run();
    assert.equal(run?.status, 'FAILED');
    assert.equal(run?.failedTheaters, 3);

    // A run left "RUNNING" by a restart is closed, and the missed noon is read now.
    tables.runs.push({
      id: 'stuck',
      status: 'RUNNING',
      startedAt: new Date('2026-10-10T03:01:00Z'),
    });
    const ran: string[] = [];
    service.run = async () => {
      ran.push('run');
      return null;
    };
    await service.catchUp();
    assert.equal(tables.runs.find((item) => item.id === 'stuck')?.status, 'FAILED');
    assert.deepEqual(ran, ['run']);
  });
});
