import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { HttpException } from '@nestjs/common';
import type { EntityManager, ObjectLiteral, Repository } from 'typeorm';
import {
  DiaryEntity,
  MediaEntity,
  SpaceMembershipEntity,
  WatchParticipantEntity,
  WatchReactionEntity,
  WatchShareEntity,
  WatchSourceEntity,
} from '../database/entities';
import { SpaceAccessService } from '../spaces/space-access.service';
import { DiaryAccessService } from './diary-access.service';
import { WatchEventsService } from './watch-events.service';

type Row = Record<string, unknown> & { id?: string };

class FakeDatabase {
  diaries: DiaryEntity[] = [];
  media: MediaEntity[] = [];
  memberships: SpaceMembershipEntity[] = [];
  participants: WatchParticipantEntity[] = [];
  reactions: WatchReactionEntity[] = [];
  sources: WatchSourceEntity[] = [];
  shares: WatchShareEntity[] = [];
  private sequence = 0;

  readonly dataSource = {
    transaction: <T>(work: (manager: EntityManager) => Promise<T>) =>
      work(this.manager as EntityManager),
  };

  readonly manager = {
    getRepository: <T extends ObjectLiteral>(target: new () => T) =>
      this.repository(target),
  };

  repository<T extends ObjectLiteral>(target: new () => T): Repository<T> {
    const rows = this.rows(target);
    const targetKey: unknown = target;
    const find = async (options: {
      where?: Row | Row[];
      relations?: unknown;
      order?: Record<string, 'ASC' | 'DESC'>;
      take?: number;
      withDeleted?: boolean;
    }) => {
      const where = options.where ?? {};
      const conditions = Array.isArray(where) ? where : [where];
      let result = rows.filter(
        (candidate) =>
          (targetKey !== DiaryEntity ||
            options.withDeleted ||
            !(candidate as unknown as DiaryEntity).deletedAt) &&
          conditions.some((condition) =>
            this.matches(target, candidate as Row, condition),
          ),
      );
      if (options.order) {
        const entries = Object.entries(options.order);
        result = [...result].sort((a, b) => {
          for (const [key, direction] of entries) {
            const left = (a as Row)[key] as string | Date;
            const right = (b as Row)[key] as string | Date;
            const comparison = String(left).localeCompare(String(right));
            if (comparison)
              return direction === 'DESC' ? -comparison : comparison;
          }
          return 0;
        });
      }
      if (options.take !== undefined) result = result.slice(0, options.take);
      return result.map((row) => this.hydrate(target, row, options.relations));
    };
    const saveOne = (value: T) => {
      const row = value as Row;
      if (!row.id) row.id = `${target.name}-${++this.sequence}`;
      const now = new Date();
      if (targetKey === DiaryEntity) {
        const diary = value as unknown as DiaryEntity;
        diary.createdAt ??= now;
        diary.updatedAt = now;
        diary.deletedAt ??= null;
      }
      if (targetKey === WatchReactionEntity) {
        const reaction = value as unknown as WatchReactionEntity;
        reaction.createdAt ??= now;
        reaction.updatedAt = now;
      }
      const index = rows.findIndex((candidate) => candidate.id === row.id);
      if (index >= 0) rows[index] = value;
      else rows.push(value);
      return value;
    };
    return {
      create: (input: Partial<T>) => Object.assign(new target(), input),
      save: async (input: T | T[]) =>
        Array.isArray(input)
          ? input.map((value) => saveOne(value))
          : saveOne(input),
      find,
      findOne: async (options: { where: Row | Row[]; relations?: unknown }) =>
        (await find({ ...options, take: 1 }))[0] ?? null,
      delete: async (where: Row) => {
        const matches = rows.filter((candidate) =>
          this.matches(target, candidate as Row, where),
        );
        for (const match of matches) rows.splice(rows.indexOf(match), 1);
        return { affected: matches.length };
      },
      softDelete: async (where: Row) => {
        const matches = rows.filter((candidate) =>
          this.matches(target, candidate as Row, where),
        );
        for (const match of matches)
          (match as unknown as DiaryEntity).deletedAt = new Date();
        return { affected: matches.length };
      },
    } as never;
  }

  addMedia(id = 'media-1') {
    const media = Object.assign(new MediaEntity(), {
      id,
      title: `작품 ${id}`,
      mediaType: 'MOVIE' as const,
      posterUrl: null,
    });
    this.media.push(media);
    return media;
  }

  addMember(spaceId: string, accountId: string) {
    const membership: SpaceMembershipEntity = Object.assign(
      new SpaceMembershipEntity(),
      {
        id: `membership-${++this.sequence}`,
        spaceId,
        accountId,
        role: 'MEMBER' as const,
        status: 'ACTIVE' as const,
        joinedAt: new Date(),
        leftAt: null,
      },
    );
    this.memberships.push(membership);
    return membership;
  }

  private rows<T extends ObjectLiteral>(target: new () => T): T[] {
    const targetKey: unknown = target;
    if (targetKey === DiaryEntity) return this.diaries as unknown as T[];
    if (targetKey === MediaEntity) return this.media as unknown as T[];
    if (targetKey === SpaceMembershipEntity)
      return this.memberships as unknown as T[];
    if (targetKey === WatchParticipantEntity)
      return this.participants as unknown as T[];
    if (targetKey === WatchReactionEntity)
      return this.reactions as unknown as T[];
    if (targetKey === WatchSourceEntity) return this.sources as unknown as T[];
    if (targetKey === WatchShareEntity) return this.shares as unknown as T[];
    throw new Error(`Unexpected repository ${target.name}`);
  }

  private matches<T extends ObjectLiteral>(
    target: new () => T,
    candidate: Row,
    where: Row,
  ): boolean {
    const targetKey: unknown = target;
    return Object.entries(where).every(([key, expected]): boolean => {
      const actual =
        key === 'diary' && targetKey === WatchShareEntity
          ? this.diaries.find((diary) => diary.id === candidate.diaryId)
          : candidate[key];
      if (this.isFindOperator(expected)) {
        if (expected._type === 'isNull') return actual === null;
        if (expected._type === 'in')
          return (expected._value as unknown[]).includes(actual);
        if (expected._type === 'equal')
          return String(actual) === String(expected._value);
        if (expected._type === 'lessThan')
          return String(actual) < String(expected._value);
      }
      if (
        expected &&
        typeof expected === 'object' &&
        !(expected instanceof Date)
      ) {
        return this.matches(target, (actual ?? {}) as Row, expected as Row);
      }
      return actual === expected;
    });
  }

  private isFindOperator(
    value: unknown,
  ): value is { _type: string; _value: unknown } {
    return Boolean(value && typeof value === 'object' && '_type' in value);
  }

  private hydrate<T extends ObjectLiteral>(
    target: new () => T,
    value: T,
    relations?: unknown,
  ) {
    if (!relations) return value;
    const targetKey: unknown = target;
    if (targetKey === DiaryEntity)
      this.hydrateDiary(value as unknown as DiaryEntity);
    if (targetKey === WatchShareEntity) {
      const share = value as unknown as WatchShareEntity;
      share.diary = this.diaries.find((diary) => diary.id === share.diaryId)!;
      this.hydrateDiary(share.diary);
    }
    if (targetKey === WatchReactionEntity) {
      const reaction = value as unknown as WatchReactionEntity;
      reaction.account = {
        id: reaction.accountId,
        nickname: reaction.accountId,
      } as never;
    }
    if (targetKey === SpaceMembershipEntity) {
      const membership = value as unknown as SpaceMembershipEntity;
      membership.account = {
        id: membership.accountId,
        nickname: membership.accountId,
      } as never;
    }
    return value;
  }

  private hydrateDiary(diary: DiaryEntity) {
    diary.media = this.media.find((media) => media.id === diary.mediaId)!;
    diary.user = { id: diary.userId, nickname: diary.userId } as never;
    diary.watchParticipants = this.participants
      .filter((participant) => participant.diaryId === diary.id)
      .map((participant) => {
        participant.account = {
          id: participant.accountId,
          nickname: participant.accountId,
        } as never;
        return participant;
      });
    diary.watchReactions = this.reactions
      .filter((reaction) => reaction.diaryId === diary.id)
      .map((reaction) => {
        reaction.account = {
          id: reaction.accountId,
          nickname: reaction.accountId,
        } as never;
        return reaction;
      });
    diary.watchSource =
      this.sources.find((source) => source.diaryId === diary.id) ?? null;
    diary.spaceShares = this.shares.filter(
      (share) => share.diaryId === diary.id,
    );
  }
}

function setup() {
  const database = new FakeDatabase();
  database.addMedia();
  const watchShares = database.repository(WatchShareEntity);
  const memberships = database.repository(SpaceMembershipEntity);
  const spaceAccess = new SpaceAccessService(memberships);
  const outboxEvents: Array<Record<string, unknown>> = [];
  const outbox = {
    enqueue: async (_manager: unknown, input: Record<string, unknown>) => {
      outboxEvents.push(input);
      return input;
    },
    enqueueNotification: async (
      _manager: unknown,
      input: Record<string, unknown>,
    ) => {
      outboxEvents.push({ eventType: 'NotificationRequested', ...input });
      return input;
    },
  };
  const access = new DiaryAccessService(
    { find: async () => [] } as never,
    { findOne: async () => null } as never,
    watchShares,
    spaceAccess,
  );
  const service = new WatchEventsService(
    database.repository(DiaryEntity),
    database.repository(MediaEntity),
    database.repository(WatchParticipantEntity),
    database.repository(WatchReactionEntity),
    database.repository(WatchSourceEntity),
    watchShares,
    access,
    spaceAccess,
    outbox as never,
    database.dataSource as never,
  );
  return { database, outboxEvents, service };
}

function exceptionCode(error: unknown) {
  assert.ok(error instanceof HttpException);
  return (error.getResponse() as { code?: string }).code;
}

describe('WatchEventsService', () => {
  it('allows repeat watches and never exposes old private records to a newly joined space', async () => {
    const { database, service } = setup();
    const first = await service.create('owner', {
      mediaId: 'media-1',
      watchedDate: '2026-08-01',
    });
    const second = await service.create('owner', {
      mediaId: 'media-1',
      watchedDate: '2026-08-01',
    });

    assert.notEqual(first.id, second.id);
    assert.equal(database.diaries.length, 2);
    assert.equal(database.shares.length, 0);
    assert.equal(
      database.participants.every(
        (participant) => participant.status === 'CONFIRMED',
      ),
      true,
    );

    database.addMember('space-1', 'owner');
    database.addMember('space-1', 'new-member');
    const timeline = await service.timeline('space-1', 'new-member', {});
    assert.deepEqual(timeline.items, []);
  });

  it('separates the watch fact, source, participant states, and personal reactions', async () => {
    const { database, outboxEvents, service } = setup();
    for (const accountId of ['owner', 'member', 'decliner', 'stranger']) {
      database.addMember('space-1', accountId);
    }
    const created = await service.create('owner', {
      mediaId: 'media-1',
      watchedDate: '2026-08-02',
      spaceIds: ['space-1'],
      participantAccountIds: ['member', 'decliner'],
      source: {
        kind: 'OTT',
        providerName: 'Davas Play',
        placeText: '거실',
      },
      rating: 4.5,
      review: '작성자 리뷰',
    });

    assert.equal(created.visibility, 'SPACES');
    assert.equal(database.diaries[0].rating, '4.5');
    assert.equal(database.reactions[0].ratingScale, 9);
    assert.equal(database.sources[0].providerName, 'Davas Play');
    assert.equal(
      database.participants.find((row) => row.accountId === 'member')?.status,
      'PENDING',
    );
    assert.equal(
      outboxEvents.filter(
        (event) => event.eventType === 'WatchParticipationRequested',
      ).length,
      2,
    );
    assert.doesNotMatch(
      JSON.stringify(outboxEvents),
      /작성자 리뷰|거실|rating|review|place/i,
    );
    await assert.rejects(
      () => service.upsertReaction(created.id, 'member', { rating: 3.5 }),
      (error) => exceptionCode(error) === 'WATCH_PARTICIPATION_NOT_FOUND',
    );

    await service.respondToParticipation(created.id, 'member', 'CONFIRMED');
    await service.respondToParticipation(created.id, 'decliner', 'DECLINED');
    await service.upsertReaction(created.id, 'member', {
      rating: 3.5,
      review: '구성원 리뷰',
    });
    await assert.rejects(
      () => service.upsertReaction(created.id, 'decliner', { rating: 2 }),
      (error) => exceptionCode(error) === 'WATCH_PARTICIPATION_NOT_FOUND',
    );
    await assert.rejects(
      () => service.respondToParticipation(created.id, 'stranger', 'CONFIRMED'),
      (error) => exceptionCode(error) === 'WATCH_PARTICIPATION_NOT_FOUND',
    );
    await assert.rejects(
      () => service.upsertReaction(created.id, 'stranger', { rating: 1 }),
      (error) => exceptionCode(error) === 'WATCH_PARTICIPATION_NOT_FOUND',
    );

    const comparison = await service.compareReactions(
      'space-1',
      'media-1',
      'member',
    );
    assert.deepEqual(
      comparison.events[0].reactions.map((reaction) => reaction.rating).sort(),
      [3.5, 4.5],
    );
  });

  it('requires every participant to be active in every shared space', async () => {
    const { database, service } = setup();
    database.addMember('space-1', 'owner');
    database.addMember('space-2', 'owner');
    database.addMember('space-1', 'member');

    await assert.rejects(
      () =>
        service.create('owner', {
          mediaId: 'media-1',
          watchedDate: '2026-08-02',
          spaceIds: ['space-1', 'space-2'],
          participantAccountIds: ['member'],
        }),
      (error) => exceptionCode(error) === 'SPACE_NOT_FOUND',
    );
  });

  it('lets only the author update or delete the watch fact and returns 404 otherwise', async () => {
    const { database, service } = setup();
    database.addMember('space-1', 'owner');
    database.addMember('space-1', 'member');
    const created = await service.create('owner', {
      mediaId: 'media-1',
      watchedDate: '2026-08-03',
      spaceIds: ['space-1'],
    });

    await assert.rejects(
      () => service.update('member', created.id, { watchedDate: '2026-08-04' }),
      (error) => exceptionCode(error) === 'RECORD_NOT_FOUND',
    );
    const updated = await service.update('owner', created.id, {
      watchedDate: '2026-08-04',
      source: { kind: 'THEATER', placeText: '동네 극장' },
      spaceIds: [],
    });
    assert.equal(updated.watchedDate, '2026-08-04');
    assert.equal(updated.visibility, 'PRIVATE');

    await assert.rejects(
      () => service.remove('member', created.id),
      (error) => exceptionCode(error) === 'RECORD_NOT_FOUND',
    );
    await service.remove('owner', created.id);
    await assert.rejects(
      () => service.detail('owner', created.id),
      (error) => exceptionCode(error) === 'RECORD_NOT_FOUND',
    );
  });

  it('blocks a departed member immediately and hides that member reaction from comparison', async () => {
    const { database, service } = setup();
    database.addMember('space-1', 'owner');
    const membership = database.addMember('space-1', 'member');
    const created = await service.create('owner', {
      mediaId: 'media-1',
      watchedDate: '2026-08-05',
      spaceIds: ['space-1'],
      participantAccountIds: ['member'],
    });
    await service.respondToParticipation(created.id, 'member', 'CONFIRMED');
    await service.upsertReaction(created.id, 'member', { rating: 5 });
    const memberEvent = await service.create('member', {
      mediaId: 'media-1',
      watchedDate: '2026-08-06',
      spaceIds: ['space-1'],
      source: { kind: 'OTHER', placeText: '구성원 위치 기여' },
    });
    assert.equal(
      (await service.timeline('space-1', 'member', {})).items.length,
      2,
    );

    membership.status = 'LEFT';
    membership.leftAt = new Date();
    await assert.rejects(
      () => service.timeline('space-1', 'member', {}),
      (error) => exceptionCode(error) === 'SPACE_NOT_FOUND',
    );
    await assert.rejects(
      () => service.detail('member', created.id),
      (error) => exceptionCode(error) === 'RECORD_NOT_FOUND',
    );
    const comparison = await service.compareReactions(
      'space-1',
      'media-1',
      'owner',
    );
    assert.equal(
      comparison.events.some((event) =>
        event.reactions.some((reaction) => reaction.accountId === 'member'),
      ),
      false,
    );
    assert.equal((await service.detail('owner', memberEvent.id)).source, null);
  });
});
