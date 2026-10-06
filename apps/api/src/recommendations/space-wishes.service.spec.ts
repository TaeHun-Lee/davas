import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { NotFoundException } from '@nestjs/common';
import { MediaEntity, SpaceWishEntity, UserEntity, WatchShareEntity } from '../database/entities';
import type { AvailabilityResponse, AvailabilityService } from '../media/availability.service';
import type { SpaceAccessService } from '../spaces/space-access.service';
import { SpaceWishesService } from './space-wishes.service';

type Row = Record<string, unknown>;

function operatorMatches(actual: unknown, expected: unknown): boolean {
  if (expected && typeof expected === 'object' && '_type' in expected) {
    const operator = expected as { _type: string; _value: unknown };
    if (operator._type === 'in') return (operator._value as unknown[]).includes(actual);
    if (operator._type === 'isNull') return actual === null || actual === undefined;
  }
  if (expected && typeof expected === 'object' && !(expected instanceof Date)) {
    return Object.entries(expected).every(([key, value]) =>
      operatorMatches((actual as Row | undefined)?.[key], value),
    );
  }
  return actual === expected;
}

function repository<T extends object>(rows: T[], create: () => T) {
  const matches = (row: T, where: Row = {}) =>
    Object.entries(where).every(([key, value]) => operatorMatches((row as Row)[key], value));
  return {
    find: async ({ where }: { where?: Row } = {}) => rows.filter((row) => matches(row, where)),
    findOne: async ({ where }: { where: Row }) => rows.find((row) => matches(row, where)) ?? null,
    count: async ({ where }: { where?: Row } = {}) =>
      rows.filter((row) => matches(row, where)).length,
    delete: async (where: Row) => {
      for (const row of rows.filter((candidate) => matches(candidate, where))) {
        rows.splice(rows.indexOf(row), 1);
      }
    },
    createQueryBuilder: () => ({
      insert: () => ({
        values: (input: Row) => ({
          orIgnore: () => ({
            execute: async () => {
              if (!rows.some((row) => matches(row, input))) {
                rows.push(Object.assign(create(), input, { createdAt: new Date() }));
              }
            },
          }),
        }),
      }),
    }),
  };
}

const media = (id: string, title: string, genres: string[]) =>
  Object.assign(new MediaEntity(), {
    id,
    title,
    mediaType: 'MOVIE',
    posterUrl: null,
    releaseDate: '2024-02-22',
    genres,
  });

function setup(offers: Record<string, string[]> = {}) {
  const catalog = [
    media('m-pamyo', '파묘', ['미스터리', '공포']),
    media('m-decision', '헤어질 결심', ['로맨스', '미스터리']),
    media('m-dune', '듄: 파트 2', ['SF']),
  ];
  const wishes: SpaceWishEntity[] = [];
  const users = [
    Object.assign(new UserEntity(), { id: 'jiwoo', nickname: '지우', ottServices: ['netflix'] }),
    Object.assign(new UserEntity(), { id: 'minho', nickname: '민호', ottServices: [] }),
  ];
  const shares: WatchShareEntity[] = [];
  const refreshed: string[] = [];
  const members = ['jiwoo', 'minho'];
  const spaceAccess = {
    assertActiveMember: async (_spaceId: string, accountId: string) => {
      if (!members.includes(accountId)) throw new NotFoundException();
    },
    activeMembersInSpaces: async () => members.map((accountId) => ({ accountId })),
  } as unknown as SpaceAccessService;
  const response = (contentId: string, state: AvailabilityResponse['state']) =>
    ({
      contentId,
      region: 'KR',
      availability: state === 'AVAILABLE' ? 'AVAILABLE' : 'UNKNOWN',
      state,
      observedAt: null,
      expiresAt: null,
      sourceProvider: 'TMDB',
      confidence: 0.8,
      offers: (offers[contentId] ?? []).map((provider) => ({
        provider,
        offerType: provider === 'Google Play Movies' ? 'RENT' : 'STREAM',
        confidence: 0.8,
      })),
    }) satisfies AvailabilityResponse;
  const availability = {
    getCurrent: async (contentId: string) => response(contentId, 'UNKNOWN'),
    refresh: async (contentId: string) => {
      refreshed.push(contentId);
      return response(contentId, offers[contentId]?.length ? 'AVAILABLE' : 'NO_OFFERS');
    },
  } as unknown as AvailabilityService;
  const wishRepository = repository(wishes, () => new SpaceWishEntity());
  const withMedia = {
    ...wishRepository,
    find: async (options: { where?: Row }) =>
      (await wishRepository.find(options)).map((wish) =>
        Object.assign(wish, { media: catalog.find((item) => item.id === wish.mediaId) }),
      ),
  };
  const service = new SpaceWishesService(
    withMedia as never,
    repository(catalog, () => new MediaEntity()) as never,
    repository(users, () => new UserEntity()) as never,
    {
      find: async () => shares,
    } as never,
    spaceAccess,
    availability,
  );
  return { members, refreshed, service, shares, wishes };
}

describe('SpaceWishesService', () => {
  it('groups wishes per title and marks the ones everybody added', async () => {
    const { service } = setup({ 'm-pamyo': ['Netflix'] });
    await service.add('space-1', 'jiwoo', 'm-pamyo');
    await service.add('space-1', 'minho', 'm-pamyo');
    await service.add('space-1', 'minho', 'm-dune');
    await service.add('space-1', 'minho', 'm-dune');

    const { items } = await service.list('space-1', 'jiwoo');
    assert.deepEqual(
      items.map((item) => [
        item.media.title,
        item.wantedBy.length,
        item.wantedByAll,
        item.wantedByMe,
      ]),
      [
        ['파묘', 2, true, true],
        ['듄: 파트 2', 1, false, false],
      ],
    );
    // Netflix is on 지우's plan, so the space can stream 파묘.
    assert.deepEqual(items[0].availability, {
      state: 'AVAILABLE',
      services: ['netflix'],
      onSpaceServices: true,
    });
  });

  it('only counts subscription streaming, and maps TMDB provider names to services', async () => {
    const { service } = setup({ 'm-decision': ['Google Play Movies', 'TVING'] });
    await service.add('space-1', 'jiwoo', 'm-decision');
    const [item] = (await service.list('space-1', 'jiwoo')).items;
    assert.deepEqual(item.availability.services, ['tving']);
    assert.equal(item.availability.onSpaceServices, false);
  });

  it('treats a title as watched once a record of it is made after it was added', async () => {
    const { service, shares } = setup();
    await service.add('space-1', 'jiwoo', 'm-pamyo');
    // An old record that was just edited re-saves its share, but it is not a new viewing.
    shares.push(
      Object.assign(new WatchShareEntity(), {
        spaceId: 'space-1',
        sharedAt: new Date(Date.now() + 1000),
        diary: { mediaId: 'm-pamyo', createdAt: new Date(Date.now() - 60_000) },
      }),
    );
    assert.equal((await service.list('space-1', 'jiwoo')).items[0].watched, false);
    shares.push(
      Object.assign(new WatchShareEntity(), {
        spaceId: 'space-1',
        sharedAt: new Date(Date.now() + 1000),
        diary: { mediaId: 'm-pamyo', createdAt: new Date(Date.now() + 1000) },
      }),
    );
    const [item] = (await service.list('space-1', 'jiwoo')).items;
    assert.equal(item.watched, true);
    const pick = await service.pick('space-1', 'jiwoo');
    assert.equal(pick.item, null);
  });

  it('picks what everyone wants and can stream first, then moves on when excluded', async () => {
    const { service } = setup({ 'm-pamyo': ['Netflix'], 'm-dune': ['Netflix'] });
    await service.add('space-1', 'jiwoo', 'm-dune');
    await service.add('space-1', 'jiwoo', 'm-pamyo');
    await service.add('space-1', 'minho', 'm-pamyo');
    await service.add('space-1', 'minho', 'm-decision');

    const first = await service.pick('space-1', 'minho', { mood: 'CHILLS' });
    assert.equal(first.item?.media.title, '파묘');
    assert.deepEqual(first.reasons, [
      '둘 다 보고 싶어 해요',
      '구독 중인 OTT에서 볼 수 있어요',
      '오늘 기분에 맞아요',
    ]);
    assert.equal(first.remaining, 2);

    const next = await service.pick('space-1', 'minho', { exclude: ['m-pamyo'] });
    assert.equal(next.item?.media.title, '듄: 파트 2');
  });

  it('limits availability lookups per request and hides spaces from non-members', async () => {
    const { refreshed, service } = setup();
    for (const id of ['m-pamyo', 'm-decision', 'm-dune']) await service.add('space-1', 'jiwoo', id);
    await service.list('space-1', 'jiwoo');
    assert.equal(refreshed.length, 3);
    await assert.rejects(service.list('space-1', 'stranger'), NotFoundException);
    await assert.rejects(service.add('space-1', 'jiwoo', 'missing'), NotFoundException);
  });

  it('removes only my wish', async () => {
    const { service, wishes } = setup();
    await service.add('space-1', 'jiwoo', 'm-pamyo');
    await service.add('space-1', 'minho', 'm-pamyo');
    const status = await service.remove('space-1', 'jiwoo', 'm-pamyo');
    assert.deepEqual(status, { mediaId: 'm-pamyo', wantedByMe: false, wantedCount: 1 });
    assert.deepEqual(
      wishes.map((wish) => wish.accountId),
      ['minho'],
    );
  });
});
