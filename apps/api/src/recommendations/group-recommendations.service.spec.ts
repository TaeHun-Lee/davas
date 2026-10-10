import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { HttpException } from '@nestjs/common';
import type { EntityManager, ObjectLiteral, Repository } from 'typeorm';
import {
  AvailabilityObservationEntity,
  DiaryEntity,
  MediaEntity,
  RecommendationExposureEntity,
  RecommendationFeedbackEntity,
  RecommendationSessionEntity,
  SpaceMembershipEntity,
  WatchParticipantEntity,
  WatchReactionEntity,
} from '../database/entities';
import { SpaceAccessService } from '../spaces/space-access.service';
import { GroupRecommendationPool } from './group-recommendation-pool';
import { GroupRecommendationsService } from './group-recommendations.service';

type Row = Record<string, unknown> & { id?: string };

class FakeDatabase {
  sessions: RecommendationSessionEntity[] = [];
  exposures: RecommendationExposureEntity[] = [];
  feedback: RecommendationFeedbackEntity[] = [];
  memberships: SpaceMembershipEntity[] = [];
  media: MediaEntity[] = [];
  observations: AvailabilityObservationEntity[] = [];
  diaries: DiaryEntity[] = [];
  participants: WatchParticipantEntity[] = [];
  reactions: WatchReactionEntity[] = [];
  private sequence = 0;

  readonly manager = {
    getRepository: <T extends ObjectLiteral>(target: new () => T) => this.repository(target),
  };

  readonly dataSource = {
    transaction: async <T>(work: (manager: EntityManager) => Promise<T>) =>
      work(this.manager as EntityManager),
  };

  repository<T extends ObjectLiteral>(target: new () => T): Repository<T> {
    const rows = this.rows(target);
    const targetKey: unknown = target;
    const hydrate = (value: T) => {
      if (targetKey === RecommendationSessionEntity) {
        const session = value as unknown as RecommendationSessionEntity;
        session.exposures = this.exposures
          .filter((exposure) => exposure.sessionId === session.id)
          .map((exposure) => this.hydrateExposure(exposure));
      }
      if (targetKey === RecommendationExposureEntity) {
        this.hydrateExposure(value as unknown as RecommendationExposureEntity);
      }
      if (targetKey === RecommendationFeedbackEntity) {
        const feedback = value as unknown as RecommendationFeedbackEntity;
        feedback.exposure = this.exposures.find((exposure) => exposure.id === feedback.exposureId)!;
      }
      return value;
    };
    const saveOne = (value: T) => {
      const row = value as Row;
      if (!row.id) row.id = `${target.name}-${++this.sequence}`;
      const now = new Date('2026-08-13T00:00:00.000Z');
      if (targetKey === RecommendationSessionEntity)
        (value as unknown as RecommendationSessionEntity).createdAt ??= now;
      if (targetKey === RecommendationExposureEntity)
        (value as unknown as RecommendationExposureEntity).createdAt ??= now;
      if (targetKey === RecommendationFeedbackEntity) {
        const feedback = value as unknown as RecommendationFeedbackEntity;
        feedback.createdAt ??= now;
        feedback.updatedAt = now;
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
      find: async (options: { where?: Row; take?: number }) => {
        const found = options.where
          ? rows.filter((candidate) => this.matches(candidate, options.where!))
          : [...rows];
        return found.slice(0, options.take ?? found.length).map(hydrate) as T[];
      },
      findOne: async (options: { where: Row }) => {
        const found = rows.find((candidate) => this.matches(candidate, options.where)) as
          T | undefined;
        return found ? hydrate(found) : null;
      },
    } as never;
  }

  addMembership(spaceId: string, accountId: string) {
    this.memberships.push(
      Object.assign(new SpaceMembershipEntity(), {
        id: `membership-${accountId}`,
        spaceId,
        accountId,
        role: 'MEMBER' as const,
        status: 'ACTIVE' as const,
        joinedAt: new Date(),
        leftAt: null,
      }),
    );
  }

  addMedia(
    id: string,
    title: string,
    genres: string[],
    provider = 'Netflix',
    offerType = 'STREAM',
  ) {
    const media = Object.assign(new MediaEntity(), {
      id,
      externalProvider: 'TMDB' as const,
      externalId: id,
      mediaType: 'MOVIE' as const,
      title,
      originalTitle: title,
      overview: null,
      shortPlot: null,
      posterUrl: null,
      backdropUrl: null,
      tagline: null,
      releaseDate: '2025-01-01',
      genres,
      country: 'KR',
      countries: ['KR'],
      runtime: 120,
      tmdbRating: '8.0',
      tmdbVoteCount: 1000,
      director: 'Director',
      creators: [],
      cast: [],
      certification: null,
    });
    const observation = Object.assign(new AvailabilityObservationEntity(), {
      id: `availability-${id}`,
      contentId: id,
      region: 'KR',
      sourceProvider: 'TMDB',
      provider,
      offerType,
      status: 'AVAILABLE' as const,
      observedAt: new Date('2026-08-13T00:00:00.000Z'),
      expiresAt: new Date('2099-01-01T00:00:00.000Z'),
      confidence: '0.9',
    });
    this.media.push(media);
    this.observations.push(observation);
    return media;
  }

  private hydrateExposure(exposure: RecommendationExposureEntity) {
    exposure.session = this.sessions.find((session) => session.id === exposure.sessionId)!;
    exposure.content = this.media.find((media) => media.id === exposure.contentId)!;
    exposure.feedback = this.feedback.filter((feedback) => feedback.exposureId === exposure.id);
    return exposure;
  }

  private rows<T extends ObjectLiteral>(target: new () => T): T[] {
    const key: unknown = target;
    if (key === RecommendationSessionEntity) return this.sessions as unknown as T[];
    if (key === RecommendationExposureEntity) return this.exposures as unknown as T[];
    if (key === RecommendationFeedbackEntity) return this.feedback as unknown as T[];
    if (key === SpaceMembershipEntity) return this.memberships as unknown as T[];
    if (key === MediaEntity) return this.media as unknown as T[];
    if (key === AvailabilityObservationEntity) return this.observations as unknown as T[];
    if (key === DiaryEntity) return this.diaries as unknown as T[];
    if (key === WatchParticipantEntity) return this.participants as unknown as T[];
    if (key === WatchReactionEntity) return this.reactions as unknown as T[];
    throw new Error(`Unexpected repository ${target.name}`);
  }

  private matches(candidate: Row, where: Row) {
    return Object.entries(where).every(([key, expected]) => matchesValue(candidate[key], expected));
  }
}

type Operator = { _type: string; _value: unknown };

/** TypeORM's In, Not and MoreThan, as far as the service uses them. */
function matchesValue(actual: unknown, expected: unknown): boolean {
  if (expected && typeof expected === 'object' && '_type' in expected) {
    const operator = expected as Operator;
    if (operator._type === 'in') return (operator._value as unknown[]).includes(actual);
    if (operator._type === 'not') return !matchesValue(actual, operator._value);
    if (operator._type === 'moreThan') {
      return actual instanceof Date && actual.getTime() > (operator._value as Date).getTime();
    }
  }
  return actual === expected;
}

function setup(participantIds = ['u1', 'u2'], notifications?: object) {
  const database = new FakeDatabase();
  participantIds.forEach((accountId) => database.addMembership('space-1', accountId));
  database.addMedia('content-drama', 'Drama Pick', ['drama']);
  database.addMedia('content-comedy', 'Comedy Pick', ['comedy']);
  database.addMedia('content-unavailable', 'Wrong Service', ['drama'], 'Wavve');
  const availability = {
    getCurrent: async (contentId: string) => {
      const observation = database.observations.find((item) => item.contentId === contentId)!;
      return {
        contentId,
        region: 'KR',
        availability: 'AVAILABLE' as const,
        state: 'AVAILABLE' as const,
        observedAt: observation.observedAt.toISOString(),
        expiresAt: observation.expiresAt.toISOString(),
        sourceProvider: 'TMDB',
        confidence: 0.9,
        offers: [
          {
            provider: observation.provider,
            offerType: observation.offerType,
            confidence: 0.9,
          },
        ],
      };
    },
  };
  const spaceAccess = new SpaceAccessService(database.repository(SpaceMembershipEntity));
  const service = new GroupRecommendationsService(
    database.repository(RecommendationSessionEntity),
    database.repository(RecommendationExposureEntity),
    database.repository(RecommendationFeedbackEntity),
    database.repository(DiaryEntity),
    database.repository(WatchParticipantEntity),
    database.repository(WatchReactionEntity),
    availability as never,
    spaceAccess,
    database.dataSource as never,
    // No TMDB here: the pool only reads what the fixtures stored.
    new GroupRecommendationPool(
      database.repository(MediaEntity),
      database.repository(AvailabilityObservationEntity),
      { refresh: async () => undefined } as never,
    ),
    notifications as never,
  );
  // The fixtures date every session 2026-08-13, a day before "now", inside the open week.
  service.now = () => new Date('2026-08-14T00:00:00.000Z');
  return { database, service };
}

const request = (participantIds = ['u1', 'u2']) => ({
  spaceId: 'space-1',
  participantAccountIds: participantIds,
  region: 'kr',
  services: ['Netflix'],
  contentTypes: ['MOVIE' as const],
  runtime: { minMinutes: 80, maxMinutes: 150 },
  moodTags: ['Drama'],
  avoidTags: ['Horror'],
  rewatchPolicy: 'EXCLUDE' as const,
  decisionRule: 'ALL' as const,
});

function exceptionCode(error: unknown) {
  assert.ok(error instanceof HttpException);
  return (error.getResponse() as { code: string }).code;
}

describe('GroupRecommendationsService', () => {
  it('creates reproducible exposures after hard filters without exposing private scores', async () => {
    const { database, service } = setup();
    const first = await service.create('u1', request());
    const firstScores = database.exposures.map((row) => row.groupScore);
    const second = await service.create('u1', request());

    assert.deepEqual(
      first.items.map((item) => item.content.id),
      second.items.map((item) => item.content.id),
    );
    assert.equal(
      first.items.some((item) => item.content.id === 'content-unavailable'),
      false,
    );
    assert.deepEqual(
      database.exposures.slice(firstScores.length).map((row) => row.groupScore),
      firstScores,
    );
    assert.equal(database.exposures[0].participantScores.length, 2);
    const wire = JSON.stringify(first);
    assert.doesNotMatch(wire, /participantScores|scoreParts|groupScore|reviewText/);
    assert.match(wire, /reasonCode/);
    assert.match(wire, /AVAILABLE_ON_SELECTED_SERVICES/);
  });

  it('leaves out titles the group watched and titles a chosen service only rents', async () => {
    const { database, service } = setup();
    database.addMedia('content-rent', 'Rent Only', ['drama'], 'Netflix', 'RENT');
    database.addMedia('content-watched', 'Seen It', ['drama']);
    database.diaries.push(
      Object.assign(new DiaryEntity(), { id: 'diary-1', userId: 'u2', mediaId: 'content-watched' }),
    );

    const created = await service.create('u1', request());
    const ids = created.items.map((item) => item.content.id);
    assert.ok(ids.includes('content-drama'));
    assert.ok(!ids.includes('content-rent'), 'rent-only title left out');
    assert.ok(!ids.includes('content-watched'), 'watched title left out');
  });

  it('rejects inactive participants and invalid request contradictions with safe errors', async () => {
    const { service } = setup();
    await assert.rejects(
      () => service.create('u1', request(['u1', 'missing'])),
      (error) => {
        assert.equal(exceptionCode(error), 'RECOMMENDATION_NOT_FOUND');
        return true;
      },
    );
    await assert.rejects(
      () =>
        service.create('u1', {
          ...request(),
          moodTags: ['horror'],
          avoidTags: ['Horror'],
        }),
      (error) => {
        assert.equal(exceptionCode(error), 'RECOMMENDATION_CONSTRAINT_CONFLICT');
        return true;
      },
    );
  });

  it('returns 404 to nonparticipants and blocks a participant immediately after leaving the space', async () => {
    const { database, service } = setup();
    const created = await service.create('u1', request());

    await assert.rejects(
      () => service.get(created.session.id, 'outsider'),
      (error) => {
        assert.equal(exceptionCode(error), 'RECOMMENDATION_NOT_FOUND');
        return true;
      },
    );

    database.memberships.find((row) => row.accountId === 'u2')!.status = 'LEFT';
    await assert.rejects(
      () => service.get(created.session.id, 'u2'),
      (error) => {
        assert.equal(exceptionCode(error), 'RECOMMENDATION_NOT_FOUND');
        return true;
      },
    );
    await assert.rejects(
      () =>
        service.recordFeedback(created.items[0].exposureId, 'u2', {
          kind: 'HOLD',
        }),
      (error) => {
        assert.equal(exceptionCode(error), 'RECOMMENDATION_NOT_FOUND');
        return true;
      },
    );
  });

  it('records private feedback, computes all-participant consensus, and links a matching watch event', async () => {
    const { database, service } = setup();
    const created = await service.create('u1', request());
    const exposure = created.items[0];
    const first = await service.recordFeedback(exposure.exposureId, 'u1', {
      kind: 'INTERESTED',
    });
    assert.equal(first.consensus.status, 'PENDING');
    assert.equal(first.consensus.interestedCount, 1);

    const second = await service.recordFeedback(exposure.exposureId, 'u2', {
      kind: 'INTERESTED',
    });
    assert.equal(second.consensus.status, 'MATCHED');
    assert.equal(database.sessions[0].status, 'MATCHED');
    assert.doesNotMatch(JSON.stringify(second), /accountId|participantScores/);

    database.diaries.push(
      Object.assign(new DiaryEntity(), {
        id: 'watch-1',
        userId: 'u1',
        mediaId: exposure.content.id,
      }),
    );
    const watched = await service.recordFeedback(exposure.exposureId, 'u1', {
      kind: 'WATCHED',
      watchEventId: 'watch-1',
    });
    assert.equal(watched.feedback.watchEventId, 'watch-1');
  });

  it('lets everyone in a pick find it, see their own answers and hear when it starts and matches', async () => {
    const requested: Array<Record<string, unknown>> = [];
    const matched: Array<Record<string, unknown>> = [];
    const { service } = setup(['u1', 'u2', 'u3'], {
      notifyRecommendationRequested: async (input: Record<string, unknown>) =>
        requested.push(input),
      notifyRecommendationMatched: async (input: Record<string, unknown>) => matched.push(input),
    });
    const created = await service.create('u1', request(['u1', 'u2']));
    assert.deepEqual(
      requested.map((input) => input.recipientId),
      ['u2'],
    );

    const listed = await service.listForSpace('space-1', 'u2');
    assert.equal(listed.items.length, 1);
    assert.equal(listed.items[0].id, created.session.id);
    assert.equal(listed.items[0].answeredByMe, 0);
    assert.equal(listed.items[0].matchedTitle, null);
    // A space member who was not asked does not see it; an outsider gets the usual 404.
    assert.deepEqual((await service.listForSpace('space-1', 'u3')).items, []);
    await assert.rejects(
      () => service.listForSpace('space-1', 'stranger'),
      (error) => exceptionCode(error) === 'RECOMMENDATION_NOT_FOUND',
    );

    const exposure = created.items[0];
    await service.recordFeedback(exposure.exposureId, 'u1', { kind: 'INTERESTED' });
    const forU1 = await service.get(created.session.id, 'u1');
    const forU2 = await service.get(created.session.id, 'u2');
    assert.equal(forU1.items[0].myFeedback, 'INTERESTED');
    assert.equal(forU2.items[0].myFeedback, null);
    assert.equal(matched.length, 0);

    await service.recordFeedback(exposure.exposureId, 'u2', { kind: 'INTERESTED' });
    assert.deepEqual(matched, [
      {
        recipientId: 'u1',
        actorId: 'u2',
        mediaId: exposure.content.id,
        idempotencyKey: `RECOMMENDATION_MATCHED:u1:${created.session.id}`,
      },
    ]);
    const after = await service.listForSpace('space-1', 'u1');
    assert.equal(after.items[0].matchedTitle, exposure.content.title);
    assert.equal(after.items[0].answeredByMe, 1);

    // A second agreement in the same pick does not announce it again.
    const other = created.items[1];
    await service.recordFeedback(other.exposureId, 'u1', { kind: 'INTERESTED' });
    await service.recordFeedback(other.exposureId, 'u2', { kind: 'INTERESTED' });
    assert.equal(matched.length, 1);
  });

  it('supports minimum agreement, availability-error feedback, and future explicit-reject exclusion', async () => {
    const { database, service } = setup(['u1', 'u2', 'u3']);
    const created = await service.create('u1', {
      ...request(['u1', 'u2', 'u3']),
      decisionRule: 'MINIMUM',
      minimumApprovals: 2,
    });
    const [firstExposure, secondExposure] = created.items;
    const rejected = await service.recordFeedback(firstExposure.exposureId, 'u1', {
      kind: 'REJECTED',
    });
    assert.equal(rejected.consensus.status, 'PENDING');
    await service.recordFeedback(secondExposure.exposureId, 'u1', {
      kind: 'AVAILABILITY_ERROR',
    });
    assert.equal(database.feedback.at(-1)?.kind, 'AVAILABILITY_ERROR');
    const held = await service.recordFeedback(secondExposure.exposureId, 'u2', { kind: 'HOLD' });
    assert.equal(held.feedback.kind, 'HOLD');
    const alreadyWatched = await service.recordFeedback(secondExposure.exposureId, 'u2', {
      kind: 'ALREADY_WATCHED',
    });
    assert.equal(alreadyWatched.feedback.kind, 'ALREADY_WATCHED');

    const regenerated = await service.create('u1', {
      ...request(['u1', 'u2', 'u3']),
      decisionRule: 'MINIMUM',
      minimumApprovals: 2,
    });
    assert.equal(
      regenerated.items.some((item) => item.content.id === firstExposure.content.id),
      false,
    );
    assert.equal(
      regenerated.items.some((item) => item.content.id === secondExposure.content.id),
      false,
    );
  });

  it('settles on an agreed title, closes the pick and stops taking answers', async () => {
    const { database, service } = setup();
    const created = await service.create('u1', request());
    const first = created.items[0];
    const second = created.items[1];

    await assert.rejects(
      () => service.decide(created.session.id, 'u1', first.exposureId),
      (error) => exceptionCode(error) === 'RECOMMENDATION_NOT_AGREED',
    );
    await service.recordFeedback(first.exposureId, 'u1', { kind: 'INTERESTED' });
    await service.recordFeedback(first.exposureId, 'u2', { kind: 'INTERESTED' });

    const decided = await service.decide(created.session.id, 'u2', first.exposureId);
    assert.equal(decided.session.status, 'CLOSED');
    assert.equal(decided.session.decidedExposureId, first.exposureId);
    assert.equal(decided.session.closedAt, '2026-08-14T00:00:00.000Z');
    assert.equal(database.sessions[0].decidedExposureId, first.exposureId);

    await assert.rejects(
      () => service.recordFeedback(second.exposureId, 'u1', { kind: 'INTERESTED' }),
      (error) => exceptionCode(error) === 'RECOMMENDATION_CLOSED',
    );
    await assert.rejects(
      () => service.decide(created.session.id, 'u1', first.exposureId),
      (error) => exceptionCode(error) === 'RECOMMENDATION_CLOSED',
    );
    const listed = await service.listForSpace('space-1', 'u1');
    assert.equal(listed.items[0].status, 'CLOSED');
    assert.equal(listed.items[0].decidedTitle, first.content.title);
  });

  it('lets only the starter end a pick, and ends picks left open for a week', async () => {
    const { service } = setup();
    const created = await service.create('u1', request());
    await assert.rejects(
      () => service.close(created.session.id, 'u2'),
      (error) => exceptionCode(error) === 'RECOMMENDATION_CLOSE_FORBIDDEN',
    );
    const closed = await service.close(created.session.id, 'u1');
    assert.equal(closed.session.status, 'CLOSED');
    assert.equal(closed.session.decidedExposureId, null);
    // Closing again is harmless.
    assert.equal((await service.close(created.session.id, 'u1')).session.status, 'CLOSED');

    const other = setup();
    const stale = await other.service.create('u1', request());
    other.service.now = () => new Date('2026-08-21T00:00:01.000Z');
    const view = await other.service.get(stale.session.id, 'u2');
    assert.equal(view.session.status, 'CLOSED');
    assert.equal(view.session.closedAt, '2026-08-20T00:00:00.000Z');
    await assert.rejects(
      () => other.service.recordFeedback(stale.items[0].exposureId, 'u2', { kind: 'HOLD' }),
      (error) => exceptionCode(error) === 'RECOMMENDATION_CLOSED',
    );
  });

  it('shows the settled title on home for a few days until someone in the pick records it', async () => {
    const { database, service } = setup();
    assert.deepEqual(await service.decidedPick('space-1', 'u1'), { pick: null });
    const created = await service.create('u1', request());
    const first = created.items[0];
    await service.recordFeedback(first.exposureId, 'u1', { kind: 'INTERESTED' });
    await service.recordFeedback(first.exposureId, 'u2', { kind: 'INTERESTED' });
    await service.decide(created.session.id, 'u1', first.exposureId);

    const shown = await service.decidedPick('space-1', 'u2');
    assert.equal(shown.pick?.sessionId, created.session.id);
    assert.equal(shown.pick?.media.id, first.content.id);
    assert.equal(shown.pick?.decidedAt, '2026-08-14T00:00:00.000Z');

    service.now = () => new Date('2026-08-18T00:00:00.000Z');
    assert.equal((await service.decidedPick('space-1', 'u2')).pick, null);

    service.now = () => new Date('2026-08-15T00:00:00.000Z');
    database.diaries.push(
      Object.assign(new DiaryEntity(), {
        id: 'diary-after',
        userId: 'u2',
        mediaId: first.content.id,
        createdAt: new Date('2026-08-14T12:00:00.000Z'),
        deletedAt: null,
      }),
    );
    assert.equal((await service.decidedPick('space-1', 'u1')).pick, null);
  });
});
