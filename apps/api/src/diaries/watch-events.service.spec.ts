import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { HttpException } from '@nestjs/common';
import type { EntityManager, ObjectLiteral, Repository } from 'typeorm';
import {
  CommentEntity,
  DiaryEntity,
  MediaEntity,
  SpaceMembershipEntity,
  WatchParticipantEntity,
  WatchPhotoEntity,
  WatchReactionEntity,
  WatchReviewLikeEntity,
  WatchShareEntity,
  WatchSourceEntity,
} from '../database/entities';
import { SpaceAccessService } from '../spaces/space-access.service';
import { DiaryAccessService } from './diary-access.service';
import { SpaceMemoriesService } from './space-memories.service';
import { WatchEventsService } from './watch-events.service';
import type { WatchPhotosService } from './watch-photos.service';

type Row = Record<string, unknown> & { id?: string };

class FakeDatabase {
  diaries: DiaryEntity[] = [];
  media: MediaEntity[] = [];
  memberships: SpaceMembershipEntity[] = [];
  participants: WatchParticipantEntity[] = [];
  reactions: WatchReactionEntity[] = [];
  sources: WatchSourceEntity[] = [];
  shares: WatchShareEntity[] = [];
  likes: WatchReviewLikeEntity[] = [];
  comments: CommentEntity[] = [];
  photos: WatchPhotoEntity[] = [];
  private sequence = 0;

  readonly dataSource = {
    transaction: <T>(work: (manager: EntityManager) => Promise<T>) =>
      work(this.manager as EntityManager),
  };

  readonly manager = {
    getRepository: <T extends ObjectLiteral>(target: new () => T) => this.repository(target),
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
          conditions.some((condition) => this.matches(target, candidate as Row, condition)),
      );
      if (options.order) {
        const entries = Object.entries(options.order);
        result = [...result].sort((a, b) => {
          for (const [key, direction] of entries) {
            const left = (a as Row)[key] as string | Date;
            const right = (b as Row)[key] as string | Date;
            const comparison = String(left).localeCompare(String(right));
            if (comparison) return direction === 'DESC' ? -comparison : comparison;
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
        Array.isArray(input) ? input.map((value) => saveOne(value)) : saveOne(input),
      find,
      findOne: async (options: { where: Row | Row[]; relations?: unknown }) =>
        (await find({ ...options, take: 1 }))[0] ?? null,
      count: async (options: { where?: Row | Row[] } = {}) => (await find(options)).length,
      createQueryBuilder: () => ({
        insert: () => ({
          values: (input: Row) => ({
            orIgnore: () => ({
              execute: async () => {
                const exists = rows.some((candidate) =>
                  this.matches(target, candidate as Row, input),
                );
                if (!exists) saveOne(Object.assign(new target(), input));
              },
            }),
          }),
        }),
      }),
      delete: async (where: Row) => {
        const matches = rows.filter((candidate) => this.matches(target, candidate as Row, where));
        for (const match of matches) rows.splice(rows.indexOf(match), 1);
        return { affected: matches.length };
      },
      softDelete: async (where: Row) => {
        const matches = rows.filter((candidate) => this.matches(target, candidate as Row, where));
        for (const match of matches) (match as unknown as DiaryEntity).deletedAt = new Date();
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
    const membership: SpaceMembershipEntity = Object.assign(new SpaceMembershipEntity(), {
      id: `membership-${++this.sequence}`,
      spaceId,
      accountId,
      role: 'MEMBER' as const,
      status: 'ACTIVE' as const,
      joinedAt: new Date(),
      leftAt: null,
    });
    this.memberships.push(membership);
    return membership;
  }

  private rows<T extends ObjectLiteral>(target: new () => T): T[] {
    const targetKey: unknown = target;
    if (targetKey === DiaryEntity) return this.diaries as unknown as T[];
    if (targetKey === MediaEntity) return this.media as unknown as T[];
    if (targetKey === SpaceMembershipEntity) return this.memberships as unknown as T[];
    if (targetKey === WatchParticipantEntity) return this.participants as unknown as T[];
    if (targetKey === WatchReactionEntity) return this.reactions as unknown as T[];
    if (targetKey === WatchSourceEntity) return this.sources as unknown as T[];
    if (targetKey === WatchShareEntity) return this.shares as unknown as T[];
    if (targetKey === WatchReviewLikeEntity) return this.likes as unknown as T[];
    if (targetKey === CommentEntity) return this.comments as unknown as T[];
    if (targetKey === WatchPhotoEntity) return this.photos as unknown as T[];
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
        if (expected._type === 'in') return (expected._value as unknown[]).includes(actual);
        if (expected._type === 'equal') return String(actual) === String(expected._value);
        if (expected._type === 'lessThan') return String(actual) < String(expected._value);
      }
      if (expected && typeof expected === 'object' && !(expected instanceof Date)) {
        return this.matches(target, (actual ?? {}) as Row, expected as Row);
      }
      return actual === expected;
    });
  }

  private isFindOperator(value: unknown): value is { _type: string; _value: unknown } {
    return Boolean(value && typeof value === 'object' && '_type' in value);
  }

  private hydrate<T extends ObjectLiteral>(target: new () => T, value: T, relations?: unknown) {
    if (!relations) return value;
    const targetKey: unknown = target;
    if (targetKey === DiaryEntity) this.hydrateDiary(value as unknown as DiaryEntity);
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
        reaction.likes = this.likes.filter((like) => like.reactionId === reaction.id);
        return reaction;
      });
    diary.watchPhotos = this.photos.filter((photo) => photo.diaryId === diary.id);
    diary.watchSource = this.sources.find((source) => source.diaryId === diary.id) ?? null;
    diary.spaceShares = this.shares.filter((share) => share.diaryId === diary.id);
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
    enqueueNotification: async (_manager: unknown, input: Record<string, unknown>) => {
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
  const attachedPhotoIds: string[][] = [];
  const removedPhotosOf: string[] = [];
  const photos = {
    replaceForDiary: async (
      _manager: unknown,
      _diaryId: string,
      _account: string,
      ids: string[],
    ) => {
      attachedPhotoIds.push(ids);
      return ids.length;
    },
    removeAllForDiary: async (_manager: unknown, diaryId: string) =>
      void removedPhotosOf.push(diaryId),
    view: (photo: WatchPhotoEntity) => ({ id: photo.id }),
  } as unknown as WatchPhotosService;
  // Records every notify* call as { method, ...input }.
  const notified: Array<Record<string, unknown>> = [];
  const notifications = new Proxy(
    {},
    {
      get: (_target, method) => async (input: Record<string, unknown>) =>
        void notified.push({ method: String(method), ...input }),
    },
  );
  const service = new WatchEventsService(
    database.repository(DiaryEntity),
    database.repository(MediaEntity),
    database.repository(WatchParticipantEntity),
    database.repository(WatchReactionEntity),
    database.repository(WatchSourceEntity),
    watchShares,
    database.repository(WatchReviewLikeEntity),
    database.repository(CommentEntity),
    access,
    spaceAccess,
    outbox as never,
    database.dataSource as never,
    photos,
    notifications as never,
  );
  const memories = new SpaceMemoriesService(watchShares, spaceAccess, photos);
  return {
    access,
    attachedPhotoIds,
    database,
    memories,
    notified,
    outboxEvents,
    removedPhotosOf,
    service,
  };
}

async function coupleRecord(isBlind: boolean) {
  const context = setup();
  context.database.addMember('space-1', 'jiwoo');
  context.database.addMember('space-1', 'minho');
  context.database.addMember('space-1', 'seojun');
  const created = await context.service.create('jiwoo', {
    mediaId: 'media-1',
    watchedDate: '2026-10-04',
    spaceIds: ['space-1'],
    participantAccountIds: ['minho'],
    rating: 4.5,
    headline: '결말이 오래 남아요',
    review: '지우의 소감',
    isBlind,
  });
  await context.service.respondToParticipation(created.id, 'minho', 'CONFIRMED');
  return { ...context, created };
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
      database.participants.every((participant) => participant.status === 'CONFIRMED'),
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
      outboxEvents.filter((event) => event.eventType === 'WatchParticipationRequested').length,
      2,
    );
    assert.doesNotMatch(JSON.stringify(outboxEvents), /작성자 리뷰|거실|rating|review|place/i);
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

    const comparison = await service.compareReactions('space-1', 'media-1', 'member');
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
    assert.equal((await service.timeline('space-1', 'member', {})).items.length, 2);

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
    const comparison = await service.compareReactions('space-1', 'media-1', 'owner');
    assert.equal(
      comparison.events.some((event) =>
        event.reactions.some((reaction) => reaction.accountId === 'member'),
      ),
      false,
    );
    assert.equal((await service.detail('owner', memberEvent.id)).source, null);
  });

  it('still lets the author edit a record after a companion left its space', async () => {
    const { database, service } = setup();
    database.addMember('space-1', 'owner');
    database.addMember('space-2', 'owner');
    const membership = database.addMember('space-1', 'member');
    database.addMember('space-1', 'decliner');
    const created = await service.create('owner', {
      mediaId: 'media-1',
      watchedDate: '2026-08-05',
      spaceIds: ['space-1'],
      participantAccountIds: ['member', 'decliner'],
    });
    await service.respondToParticipation(created.id, 'decliner', 'DECLINED');
    membership.status = 'LEFT';
    membership.leftAt = new Date();

    // The web always sends the spaces back with an edit; the space it already sits in stays.
    await service.update('owner', created.id, {
      memoryNote: '다시 봐도 좋다',
      spaceIds: ['space-1'],
    });
    assert.equal(
      database.diaries.find((diary) => diary.id === created.id)?.memoryNote,
      '다시 봐도 좋다',
    );

    // A new space still needs everyone who is on the record, but not the one who declined.
    await assert.rejects(
      () => service.update('owner', created.id, { spaceIds: ['space-1', 'space-2'] }),
      (error) => exceptionCode(error) === 'SPACE_NOT_FOUND',
    );
    database.addMember('space-2', 'member');
    await service.update('owner', created.id, { spaceIds: ['space-1', 'space-2'] });
    assert.ok(
      database.shares.some((share) => share.diaryId === created.id && share.spaceId === 'space-2'),
    );
  });

  it('stops showing the personal parts of a record once its author leaves', async () => {
    const { access, database, service } = setup();
    database.addMember('space-1', 'owner');
    const membership = database.addMember('space-1', 'member');
    const created = await service.create('member', {
      mediaId: 'media-1',
      watchedDate: '2026-08-06',
      spaceIds: ['space-1'],
    });
    const record = { id: created.id, userId: 'member' };
    assert.equal(await access.isAuthorVisibleTo(record, 'owner'), true);
    membership.status = 'LEFT';
    membership.leftAt = new Date();
    assert.equal(await access.isAuthorVisibleTo(record, 'owner'), false);
    assert.equal(await access.isAuthorVisibleTo(record, 'member'), true);
  });

  it('counts comments for each record on a timeline page', async () => {
    const { database, service } = setup();
    database.addMember('space-1', 'owner');
    const quiet = await service.create('owner', {
      mediaId: 'media-1',
      watchedDate: '2026-08-05',
      spaceIds: ['space-1'],
    });
    const chatty = await service.create('owner', {
      mediaId: 'media-1',
      watchedDate: '2026-08-06',
      spaceIds: ['space-1'],
    });
    for (const id of ['c1', 'c2']) {
      database.comments.push(
        Object.assign(new CommentEntity(), { id, diaryId: chatty.id, userId: 'owner' }),
      );
    }
    const { items } = await service.timeline('space-1', 'owner', {});
    const counts = new Map(items.map((item) => [item.id, item.commentCount]));
    assert.equal(counts.get(chatty.id), 2);
    assert.equal(counts.get(quiet.id), 0);
  });

  it('lets a companion who was there add photos and tells the others', async () => {
    const { attachedPhotoIds, created, database, notified, service } = await coupleRecord(false);
    await assert.rejects(
      () => service.setMyPhotos(created.id, 'seojun', []),
      (error) => exceptionCode(error) === 'WATCH_PHOTOS_FORBIDDEN',
    );
    const photoId = '00000000-0000-4000-8000-0000000000aa';
    await service.setMyPhotos(created.id, 'minho', [photoId]);
    assert.deepEqual(attachedPhotoIds.at(-1), [photoId]);
    assert.ok(
      notified.some(
        (call) =>
          call.method === 'notifyPhotosAdded' &&
          call.recipientId === 'jiwoo' &&
          call.actorId === 'minho',
      ),
    );

    // Each photo follows its uploader: a companion who leaves takes theirs along.
    database.photos.push(
      Object.assign(new WatchPhotoEntity(), {
        id: 'p-jiwoo',
        diaryId: created.id,
        uploaderId: 'jiwoo',
        position: 0,
      }),
      Object.assign(new WatchPhotoEntity(), {
        id: 'p-minho',
        diaryId: created.id,
        uploaderId: 'minho',
        position: 1,
      }),
    );
    const seen = async () => (await service.detail('jiwoo', created.id)).photos.map((p) => p.id);
    assert.deepEqual(await seen(), ['p-jiwoo', 'p-minho']);
    const minho = database.memberships.find((membership) => membership.accountId === 'minho')!;
    minho.status = 'LEFT';
    minho.leftAt = new Date();
    assert.deepEqual(await seen(), ['p-jiwoo']);
  });

  it('removes the photos of a deleted record with it', async () => {
    const { database, removedPhotosOf, service } = setup();
    database.addMember('space-1', 'owner');
    const created = await service.create('owner', {
      mediaId: 'media-1',
      watchedDate: '2026-08-06',
      spaceIds: ['space-1'],
    });
    await service.remove('owner', created.id);
    assert.deepEqual(removedPhotosOf, [created.id]);
  });

  it('sends the release year of the title with a record', async () => {
    const { database, service } = setup();
    Object.assign(database.media[0], { releaseDate: '2023-11-22' });
    const created = await service.create('owner', {
      mediaId: 'media-1',
      watchedDate: '2026-08-06',
    });
    assert.equal(created.media.releaseYear, '2023');
    Object.assign(database.media[0], { releaseDate: null });
    assert.equal((await service.detail('owner', created.id)).media.releaseYear, null);
  });

  it('keeps a service name only on a streaming viewing', async () => {
    const { database, service } = setup();
    await service.create('owner', {
      mediaId: 'media-1',
      watchedDate: '2026-08-06',
      source: { kind: 'THEATER', providerName: '넷플릭스', placeText: 'CGV 용산' } as never,
    });
    assert.equal(database.sources[0].providerName, null);
    assert.equal(database.sources[0].placeText, 'CGV 용산');
  });

  it('lists the records still waiting for my answer, however many newer ones came after', async () => {
    const { database, service } = setup();
    database.addMember('space-1', 'jiwoo');
    database.addMember('space-1', 'minho');
    const asked = await service.create('minho', {
      mediaId: 'media-1',
      watchedDate: '2026-08-01',
      spaceIds: ['space-1'],
      participantAccountIds: ['jiwoo'],
    });
    for (let day = 2; day <= 8; day += 1) {
      await service.create('minho', {
        mediaId: 'media-1',
        watchedDate: `2026-08-0${day}`,
        spaceIds: ['space-1'],
      });
    }
    // A request in another space or a deleted record is not offered here.
    database.addMember('space-2', 'jiwoo');
    database.addMember('space-2', 'minho');
    const elsewhere = await service.create('minho', {
      mediaId: 'media-1',
      watchedDate: '2026-08-03',
      spaceIds: ['space-2'],
      participantAccountIds: ['jiwoo'],
    });

    const first = await service.pendingConfirmations('space-1', 'jiwoo');
    assert.deepEqual(
      first.items.map((item) => item.id),
      [asked.id],
    );
    assert.ok(!first.items.some((item) => item.id === elsewhere.id));
    assert.deepEqual((await service.pendingConfirmations('space-1', 'minho')).items, []);

    await service.respondToParticipation(asked.id, 'jiwoo', 'CONFIRMED');
    assert.deepEqual((await service.pendingConfirmations('space-1', 'jiwoo')).items, []);
    await assert.rejects(
      () => service.pendingConfirmations('space-1', 'stranger'),
      (error) => exceptionCode(error) === 'SPACE_NOT_FOUND',
    );
  });

  it('keeps the share time when a record is edited, and renews it when shared again', async () => {
    const { database, service } = setup();
    database.addMember('space-1', 'owner');
    const created = await service.create('owner', {
      mediaId: 'media-1',
      watchedDate: '2026-08-06',
      spaceIds: ['space-1'],
    });
    const share = database.shares.find((item) => item.diaryId === created.id)!;
    const original = new Date('2026-08-06T12:00:00Z');
    share.sharedAt = original;

    await service.update('owner', created.id, {
      memoryNote: '팝콘을 쏟았다',
      spaceIds: ['space-1'],
    });
    assert.equal(share.sharedAt, original);
    assert.equal(share.revokedAt, null);

    await service.update('owner', created.id, { spaceIds: [] });
    const revokedAt = share.revokedAt;
    assert.ok(revokedAt);
    await service.update('owner', created.id, { memoryNote: '다시 고침', spaceIds: [] });
    assert.equal(share.revokedAt, revokedAt);

    await service.update('owner', created.id, { spaceIds: ['space-1'] });
    assert.equal(share.revokedAt, null);
    assert.ok(share.sharedAt > original);
  });

  it('keeps a blind review hidden from the partner until they write theirs, everywhere', async () => {
    const { created, service } = await coupleRecord(true);

    const locked = await service.detail('minho', created.id);
    const jiwoo = locked.reactions.find((reaction) => reaction.accountId === 'jiwoo')!;
    assert.equal(jiwoo.locked, true);
    assert.equal(jiwoo.isBlind, true);
    assert.equal(jiwoo.rating, null);
    assert.equal(jiwoo.headline, null);
    assert.equal(jiwoo.review, null);
    assert.equal('updatedAt' in jiwoo, false);
    assert.doesNotMatch(JSON.stringify(locked), /지우의 소감|결말이 오래 남아요/);

    const timeline = await service.timeline('space-1', 'minho', {});
    assert.doesNotMatch(JSON.stringify(timeline), /지우의 소감|결말이 오래 남아요/);
    const comparison = await service.compareReactions('space-1', 'media-1', 'minho');
    assert.doesNotMatch(JSON.stringify(comparison), /지우의 소감/);
    // A space member who was not there waits for every watcher, not just one.
    const outsider = await service.detail('seojun', created.id);
    assert.equal(outsider.reactions.find((item) => item.accountId === 'jiwoo')?.locked, true);

    await service.upsertReaction(created.id, 'minho', { rating: 4 });
    const opened = await service.detail('minho', created.id);
    assert.equal(
      opened.reactions.find((item) => item.accountId === 'jiwoo')?.review,
      '지우의 소감',
    );
    const outsiderAfter = await service.detail('seojun', created.id);
    assert.equal(outsiderAfter.reactions.find((item) => item.accountId === 'jiwoo')?.locked, false);
    // The writer always sees their own review.
    const own = await service.detail('jiwoo', created.id);
    assert.equal(own.reactions.find((item) => item.accountId === 'jiwoo')?.locked, false);
  });

  it('shows a review right away when blind reveal is off', async () => {
    const { created, service } = await coupleRecord(false);
    const view = await service.detail('minho', created.id);
    const jiwoo = view.reactions.find((reaction) => reaction.accountId === 'jiwoo')!;
    assert.equal(jiwoo.locked, false);
    assert.equal(jiwoo.headline, '결말이 오래 남아요');
  });

  it('lets people like a visible review of someone else, once', async () => {
    const { created, database, service } = await coupleRecord(true);
    const jiwooReaction = database.reactions.find((reaction) => reaction.accountId === 'jiwoo')!;

    await assert.rejects(
      () => service.setReviewLike(created.id, jiwooReaction.id, 'minho', true),
      (error) => exceptionCode(error) === 'REVIEW_LOCKED',
    );
    await assert.rejects(
      () => service.setReviewLike(created.id, jiwooReaction.id, 'jiwoo', true),
      (error) => exceptionCode(error) === 'OWN_REVIEW_LIKE',
    );
    await service.upsertReaction(created.id, 'minho', { rating: 4 });
    await service.setReviewLike(created.id, jiwooReaction.id, 'minho', true);
    const twice = await service.setReviewLike(created.id, jiwooReaction.id, 'minho', true);
    assert.deepEqual(twice, { reactionId: jiwooReaction.id, liked: true, likeCount: 1 });

    const view = await service.detail('minho', created.id);
    const liked = view.reactions.find((reaction) => reaction.accountId === 'jiwoo')!;
    assert.equal(liked.likeCount, 1);
    assert.equal(liked.likedByMe, true);

    const undone = await service.setReviewLike(created.id, jiwooReaction.id, 'minho', false);
    assert.equal(undone.likeCount, 0);
    await assert.rejects(
      () => service.setReviewLike(created.id, 'missing', 'minho', true),
      (error) => exceptionCode(error) === 'REVIEW_NOT_FOUND',
    );
  });

  it('stores theater and series details, memory notes, photos and spoiler flags', async () => {
    const { attachedPhotoIds, database, service } = setup();
    const theater = await service.create('owner', {
      mediaId: 'media-1',
      watchedDate: '2026-10-04',
      source: {
        kind: 'THEATER',
        placeText: 'CGV 용산',
        theaterFormat: 'IMAX',
        seatText: 'H12',
        episodeWatched: 3,
      },
      memoryNote: '  팝콘 반반  ',
      hasSpoiler: true,
      review: '반전',
      photoIds: ['photo-1', 'photo-2'],
    });
    assert.deepEqual(attachedPhotoIds, [['photo-1', 'photo-2']]);
    assert.equal(theater.memoryNote, '팝콘 반반');
    assert.equal(theater.source?.theaterFormat, 'IMAX');
    assert.equal(theater.source?.seatText, 'H12');
    // Episodes only make sense for a series watched at home.
    assert.equal(theater.source?.episodeWatched, null);
    assert.equal(theater.reactions[0].hasSpoiler, true);
    assert.equal(database.diaries[0].hasSpoiler, true);

    await assert.rejects(
      () =>
        service.create('owner', {
          mediaId: 'media-1',
          watchedDate: '2026-10-04',
          source: { kind: 'OTT', episodeWatched: 9, episodeTotal: 8 },
        }),
      (error) => exceptionCode(error) === 'WATCH_EPISODE_RANGE',
    );
    const series = await service.create('owner', {
      mediaId: 'media-1',
      watchedDate: '2026-10-04',
      source: { kind: 'OTT', providerName: '넷플릭스', episodeWatched: 8, episodeTotal: 16 },
    });
    assert.equal(series.source?.episodeWatched, 8);
    assert.equal(series.source?.theaterFormat, null);
  });

  it('keeps the rating when an update leaves review fields out', async () => {
    const { service } = setup();
    const created = await service.create('owner', {
      mediaId: 'media-1',
      watchedDate: '2026-10-04',
      rating: 4,
      review: '좋았어요',
    });
    const updated = await service.update('owner', created.id, { watchedDate: '2026-10-03' });
    assert.equal(updated.watchedDate, '2026-10-03');
    assert.equal(updated.reactions[0].rating, 4);
    assert.equal(updated.reactions[0].review, '좋았어요');
  });

  it('sums a space year, recalls this day in past years, and lists series in progress', async () => {
    const { database, memories, service } = setup();
    database.addMember('space-1', 'jiwoo');
    database.addMember('space-1', 'minho');
    Object.assign(database.media[0], { genres: ['스릴러', '드라마'] });
    const series = database.addMedia('media-tv');
    Object.assign(series, { mediaType: 'TV', genres: ['드라마'] });
    const record = (mediaId: string, watchedDate: string, source: object, spaceIds = ['space-1']) =>
      service.create('jiwoo', { mediaId, watchedDate, spaceIds, source: source as never });

    await record('media-1', '2026-03-01', { kind: 'THEATER' });
    await record('media-1', '2025-10-06', { kind: 'OTT', providerName: '넷플릭스' });
    await record('media-tv', '2026-05-01', { kind: 'OTT', episodeWatched: 4, episodeTotal: 16 });
    await record('media-tv', '2026-05-08', { kind: 'OTT', episodeWatched: 8, episodeTotal: 16 });
    // A personal record never counts toward the space.
    await record('media-1', '2026-04-01', { kind: 'THEATER' }, []);

    const result = await memories.memories(
      'space-1',
      'minho',
      undefined,
      new Date('2026-10-06T03:00:00Z'),
    );
    assert.equal(result.year, 2026);
    assert.deepEqual(result.totals, { records: 3, movies: 1, series: 2, photos: 0 });
    assert.deepEqual(result.genres[0], { name: '드라마', count: 3 });
    assert.deepEqual(result.sources, { theater: 1, ott: 2, other: 0 });
    assert.deepEqual(
      result.onThisDay.map((item) => [item.watchedDate, item.yearsAgo]),
      [['2025-10-06', 1]],
    );
    assert.deepEqual(
      result.inProgress.map((item) => [item.title, item.episodeWatched, item.episodeTotal]),
      [['작품 media-tv', 8, 16]],
    );

    const lastYear = await memories.memories('space-1', 'minho', 2025, new Date('2026-10-06'));
    assert.equal(lastYear.totals.records, 1);
    await assert.rejects(() => memories.memories('space-1', 'stranger'));
  });

  it('still counts a departed member record in memories, without its photos or source', async () => {
    const { database, memories, service } = setup();
    database.addMember('space-1', 'jiwoo');
    const minho = database.addMember('space-1', 'minho');
    const series = database.addMedia('media-tv');
    Object.assign(series, { mediaType: 'TV' });
    const theater = await service.create('minho', {
      mediaId: 'media-1',
      watchedDate: '2025-10-06',
      spaceIds: ['space-1'],
      source: { kind: 'THEATER' } as never,
    });
    await service.create('minho', {
      mediaId: 'media-tv',
      watchedDate: '2026-05-01',
      spaceIds: ['space-1'],
      source: { kind: 'OTT', episodeWatched: 3, episodeTotal: 12 } as never,
    });
    database.photos.push(
      Object.assign(new WatchPhotoEntity(), {
        id: 'photo-1',
        diaryId: theater.id,
        uploaderId: 'minho',
        position: 0,
      }),
    );
    minho.status = 'LEFT';
    minho.leftAt = new Date();

    const now = new Date('2026-10-06T03:00:00Z');
    const thisYear = await memories.memories('space-1', 'jiwoo', undefined, now);
    assert.equal(thisYear.totals.records, 1);
    assert.deepEqual(thisYear.sources, { theater: 0, ott: 0, other: 0 });
    assert.deepEqual(thisYear.inProgress, []);
    assert.equal(thisYear.onThisDay[0].sourceKind, null);
    assert.equal(thisYear.onThisDay[0].photoCount, 0);
    assert.equal(thisYear.onThisDay[0].coverPhoto, null);
    const lastYear = await memories.memories('space-1', 'jiwoo', 2025, now);
    assert.equal(lastYear.totals.photos, 0);
  });

  it('sums the year-end card without letting a locked blind rating count', async () => {
    const { database, memories, service } = setup();
    database.addMember('space-1', 'jiwoo');
    database.addMember('space-1', 'minho');
    database.addMedia('media-2');
    const theater = (placeText: string) => ({ kind: 'THEATER', placeText }) as never;
    const first = await service.create('jiwoo', {
      mediaId: 'media-1',
      watchedDate: '2026-03-01',
      spaceIds: ['space-1'],
      participantAccountIds: ['minho'],
      source: theater('CGV 용산'),
      rating: 4.5,
    });
    await service.respondToParticipation(first.id, 'minho', 'CONFIRMED');
    await service.upsertReaction(first.id, 'minho', { rating: 3.5 });
    // Jiwoo's blind 5.0 stays hidden from Minho until he writes his own review.
    const blind = await service.create('jiwoo', {
      mediaId: 'media-2',
      watchedDate: '2026-03-15',
      spaceIds: ['space-1'],
      participantAccountIds: ['minho'],
      source: theater('CGV 용산'),
      rating: 5,
      isBlind: true,
    });
    await service.respondToParticipation(blind.id, 'minho', 'CONFIRMED');
    await service.create('jiwoo', {
      mediaId: 'media-1',
      watchedDate: '2026-07-02',
      spaceIds: ['space-1'],
      source: { kind: 'OTT', providerName: '넷플릭스' } as never,
    });

    const now = new Date('2026-10-06T03:00:00Z');
    const forMinho = (await memories.memories('space-1', 'minho', undefined, now)).recap;
    assert.equal(forMinho.monthly[2], 2);
    assert.equal(forMinho.monthly[6], 1);
    assert.deepEqual(forMinho.busiestMonth, { month: 3, count: 2 });
    assert.equal(forMinho.firstWatch?.watchedDate, '2026-03-01');
    assert.equal(forMinho.latestWatch?.watchedDate, '2026-07-02');
    assert.deepEqual(
      forMinho.topRated.map((item) => [item.mediaId, item.averageRating, item.ratingCount]),
      [['media-1', 4, 2]],
    );
    assert.deepEqual(forMinho.favoritePlace, { name: 'CGV 용산', count: 2 });
    assert.deepEqual(forMinho.favoriteService, { name: '넷플릭스', count: 1 });

    const forJiwoo = (await memories.memories('space-1', 'jiwoo', undefined, now)).recap;
    assert.deepEqual(
      forJiwoo.topRated.map((item) => [item.mediaId, item.averageRating]),
      [
        ['media-2', 5],
        ['media-1', 4],
      ],
    );
  });

  it('lays a month of shared records out by the day they were watched', async () => {
    const { database, memories, service } = setup();
    database.addMember('space-1', 'jiwoo');
    database.addMember('space-1', 'minho');
    const record = (watchedDate: string, spaceIds = ['space-1']) =>
      service.create('jiwoo', { mediaId: 'media-1', watchedDate, spaceIds });
    const early = await record('2026-03-01');
    await record('2026-03-15');
    await record('2026-03-15');
    await record('2026-04-01');
    // A personal record is not on the space's calendar.
    await record('2026-03-20', []);

    const march = await memories.calendar('space-1', 'minho', '2026-03');
    assert.equal(march.month, '2026-03');
    assert.deepEqual(
      march.days.map((day) => [day.date, day.records.length]),
      [
        ['2026-03-01', 1],
        ['2026-03-15', 2],
      ],
    );
    assert.equal(march.days[0].records[0].watchEventId, early.id);
    assert.equal(march.days[0].records[0].isMine, false);
    await assert.rejects(() => memories.calendar('space-1', 'stranger', '2026-03'));
  });

  it('searches records by their words, as the viewer sees them', async () => {
    const { database, service } = setup();
    for (const member of ['jiwoo', 'minho', 'seojun']) database.addMember('space-1', member);
    Object.assign(database.media[0], { originalTitle: 'Original One' });
    database.addMedia('media-2');
    const shared = await service.create('jiwoo', {
      mediaId: 'media-1',
      watchedDate: '2026-10-04',
      spaceIds: ['space-1'],
      participantAccountIds: ['minho'],
      source: { kind: 'THEATER', placeText: 'CGV 용산' } as never,
      memoryNote: '팝콘 반반',
      headline: '결말이 오래 남아요',
      isBlind: true,
    });
    await service.respondToParticipation(shared.id, 'minho', 'CONFIRMED');
    await service.create('jiwoo', {
      mediaId: 'media-1',
      watchedDate: '2026-10-05',
      memoryNote: '혼자 봄',
    });
    const streaming = await service.create('minho', {
      mediaId: 'media-2',
      watchedDate: '2026-10-06',
      spaceIds: ['space-1'],
      source: { kind: 'OTT', providerName: '넷플릭스' } as never,
    });
    const find = (accountId: string, q: string, extra: object = {}) =>
      service.search(accountId, { scope: 'mine', q, ...extra } as never);
    const ids = async (pending: ReturnType<typeof find>) =>
      (await pending).items.map((item) => item.watchEvent.id);

    assert.deepEqual((await find('jiwoo', '팝콘')).items[0].match, {
      field: 'memo',
      text: '팝콘 반반',
    });
    // Spaces do not matter, and an original title counts as the title.
    assert.equal((await find('jiwoo', 'cgv용산')).items[0].match?.field, 'place');
    assert.equal((await find('jiwoo', 'original')).items[0].match?.field, 'title');
    assert.equal((await find('jiwoo', 'minho')).items[0].match?.field, 'people');
    // A companion finds the record, but not by a blind review still locked for them.
    assert.deepEqual(await ids(find('minho', '결말')), []);
    await service.upsertReaction(shared.id, 'minho', { rating: 4 });
    assert.deepEqual(await ids(find('minho', '결말')), [shared.id]);

    // The space scope covers what is shared there, never a personal record.
    const space = (q: string, extra: object = {}) =>
      service.search('seojun', { scope: 'space', spaceId: 'space-1', q, ...extra } as never);
    assert.deepEqual(
      (await space('', { sourceKind: 'OTT' })).items.map((item) => item.watchEvent.id),
      [streaming.id],
    );
    assert.deepEqual((await space('혼자')).items, []);
    const firstPage = await space('', { limit: 1 });
    assert.equal(firstPage.items[0].watchEvent.id, streaming.id);
    assert.equal(firstPage.hasMore, true);
    assert.equal(firstPage.nextCursor, '1');
    await assert.rejects(() =>
      service.search('stranger', { scope: 'space', spaceId: 'space-1' } as never),
    );
  });

  it('reports where the viewer is up to in a series, from the newest record', async () => {
    const { service } = setup();
    assert.equal(await service.progress('owner', 'media-1'), null);
    await service.create('owner', {
      mediaId: 'media-1',
      watchedDate: '2026-05-01',
      source: { kind: 'OTT', providerName: '티빙', episodeWatched: 3, episodeTotal: 12 },
    });
    await service.create('owner', {
      mediaId: 'media-1',
      watchedDate: '2026-05-09',
      source: { kind: 'OTT', providerName: '티빙', episodeWatched: 6, episodeTotal: 12 },
    });
    assert.deepEqual(await service.progress('owner', 'media-1'), {
      mediaId: 'media-1',
      episodeWatched: 6,
      episodeTotal: 12,
      completed: false,
      providerName: '티빙',
      sourceKind: 'OTT',
      watchedDate: '2026-05-09',
    });
  });

  it('announces an opened blind review when the author writes theirs by editing the record', async () => {
    const { database, notified, service } = setup();
    database.addMember('space-1', 'jiwoo');
    database.addMember('space-1', 'minho');
    const created = await service.create('jiwoo', {
      mediaId: 'media-1',
      watchedDate: '2026-10-04',
      spaceIds: ['space-1'],
      participantAccountIds: ['minho'],
    });
    await service.respondToParticipation(created.id, 'minho', 'CONFIRMED');
    await service.upsertReaction(created.id, 'minho', { rating: 4, isBlind: true });

    notified.length = 0;
    await service.update('jiwoo', created.id, { rating: 3.5 });
    assert.deepEqual(
      notified.map((item) => [item.method, item.recipientId, item.actorId]),
      [['notifyReviewRevealed', 'minho', 'jiwoo']],
    );
  });

  it('notifies the companion, the rest of the space, an opened blind review, and a like', async () => {
    const { created, database, notified, service } = await coupleRecord(true);
    const sent = () => notified.map((item) => [item.method, item.recipientId, item.actorId]);
    assert.deepEqual(sent(), [
      ['notifyWatchParticipationRequested', 'minho', 'jiwoo'],
      ['notifyWatchShared', 'seojun', 'jiwoo'],
    ]);

    notified.length = 0;
    await service.upsertReaction(created.id, 'minho', { rating: 4 });
    assert.deepEqual(sent(), [['notifyReviewRevealed', 'jiwoo', 'minho']]);

    notified.length = 0;
    await service.upsertReaction(created.id, 'minho', { rating: 4.5 });
    assert.deepEqual(sent(), [], 'already open, nothing new to announce');

    const jiwooReaction = database.reactions.find((reaction) => reaction.accountId === 'jiwoo')!;
    await service.setReviewLike(created.id, jiwooReaction.id, 'minho', true);
    assert.deepEqual(sent(), [['notifyReviewLiked', 'jiwoo', 'minho']]);
  });

  it('accepts today in Korea during the hours when UTC is still on yesterday', async (t) => {
    // 2026-10-06 16:30 UTC is 01:30 on 2026-10-07 in Seoul, right after a late movie.
    t.mock.timers.enable({ apis: ['Date'], now: new Date('2026-10-06T16:30:00Z') });
    const { service } = setup();
    const created = await service.create('owner', {
      mediaId: 'media-1',
      watchedDate: '2026-10-07',
    });
    assert.equal(created.watchedDate, '2026-10-07');
    await assert.rejects(
      () => service.create('owner', { mediaId: 'media-1', watchedDate: '2026-10-08' }),
      (error) => exceptionCode(error) === 'WATCH_DATE_IN_FUTURE',
    );
  });
});
