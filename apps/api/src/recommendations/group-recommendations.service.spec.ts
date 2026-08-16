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
    getRepository: <T extends ObjectLiteral>(target: new () => T) =>
      this.repository(target),
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
        feedback.exposure = this.exposures.find(
          (exposure) => exposure.id === feedback.exposureId,
        )!;
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
        Array.isArray(input)
          ? input.map((value) => saveOne(value))
          : saveOne(input),
      find: async (options: { where?: Row; take?: number }) => {
        const found = options.where
          ? rows.filter((candidate) => this.matches(candidate, options.where!))
          : [...rows];
        return found.slice(0, options.take ?? found.length).map(hydrate) as T[];
      },
      findOne: async (options: { where: Row }) => {
        const found = rows.find((candidate) =>
          this.matches(candidate, options.where),
        ) as T | undefined;
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
      offerType: 'FLATRATE',
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
    exposure.session = this.sessions.find(
      (session) => session.id === exposure.sessionId,
    )!;
    exposure.content = this.media.find(
      (media) => media.id === exposure.contentId,
    )!;
    exposure.feedback = this.feedback.filter(
      (feedback) => feedback.exposureId === exposure.id,
    );
    return exposure;
  }

  private rows<T extends ObjectLiteral>(target: new () => T): T[] {
    const key: unknown = target;
    if (key === RecommendationSessionEntity)
      return this.sessions as unknown as T[];
    if (key === RecommendationExposureEntity)
      return this.exposures as unknown as T[];
    if (key === RecommendationFeedbackEntity)
      return this.feedback as unknown as T[];
    if (key === SpaceMembershipEntity)
      return this.memberships as unknown as T[];
    if (key === MediaEntity) return this.media as unknown as T[];
    if (key === AvailabilityObservationEntity)
      return this.observations as unknown as T[];
    if (key === DiaryEntity) return this.diaries as unknown as T[];
    if (key === WatchParticipantEntity)
      return this.participants as unknown as T[];
    if (key === WatchReactionEntity) return this.reactions as unknown as T[];
    throw new Error(`Unexpected repository ${target.name}`);
  }

  private matches(candidate: Row, where: Row) {
    return Object.entries(where).every(([key, expected]) => {
      if (
        expected &&
        typeof expected === 'object' &&
        '_type' in expected &&
        (expected as { _type?: string })._type === 'in'
      ) {
        return (expected as unknown as { _value: unknown[] })._value.includes(
          candidate[key],
        );
      }
      return candidate[key] === expected;
    });
  }
}

function setup(participantIds = ['u1', 'u2']) {
  const database = new FakeDatabase();
  participantIds.forEach((accountId) =>
    database.addMembership('space-1', accountId),
  );
  database.addMedia('content-drama', 'Drama Pick', ['drama']);
  database.addMedia('content-comedy', 'Comedy Pick', ['comedy']);
  database.addMedia('content-unavailable', 'Wrong Service', ['drama'], 'Wavve');
  const availability = {
    getCurrent: async (contentId: string) => {
      const observation = database.observations.find(
        (item) => item.contentId === contentId,
      )!;
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
  const spaceAccess = new SpaceAccessService(
    database.repository(SpaceMembershipEntity),
  );
  const service = new GroupRecommendationsService(
    database.repository(RecommendationSessionEntity),
    database.repository(RecommendationExposureEntity),
    database.repository(RecommendationFeedbackEntity),
    database.repository(MediaEntity),
    database.repository(AvailabilityObservationEntity),
    database.repository(DiaryEntity),
    database.repository(WatchParticipantEntity),
    database.repository(WatchReactionEntity),
    availability as never,
    spaceAccess,
    database.dataSource as never,
  );
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
        assert.equal(
          exceptionCode(error),
          'RECOMMENDATION_CONSTRAINT_CONFLICT',
        );
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

  it('supports minimum agreement, availability-error feedback, and future explicit-reject exclusion', async () => {
    const { database, service } = setup(['u1', 'u2', 'u3']);
    const created = await service.create('u1', {
      ...request(['u1', 'u2', 'u3']),
      decisionRule: 'MINIMUM',
      minimumApprovals: 2,
    });
    const [firstExposure, secondExposure] = created.items;
    const rejected = await service.recordFeedback(
      firstExposure.exposureId,
      'u1',
      { kind: 'REJECTED' },
    );
    assert.equal(rejected.consensus.status, 'PENDING');
    await service.recordFeedback(secondExposure.exposureId, 'u1', {
      kind: 'AVAILABILITY_ERROR',
    });
    assert.equal(database.feedback.at(-1)?.kind, 'AVAILABILITY_ERROR');
    const held = await service.recordFeedback(
      secondExposure.exposureId,
      'u2',
      { kind: 'HOLD' },
    );
    assert.equal(held.feedback.kind, 'HOLD');
    const alreadyWatched = await service.recordFeedback(
      secondExposure.exposureId,
      'u2',
      { kind: 'ALREADY_WATCHED' },
    );
    assert.equal(alreadyWatched.feedback.kind, 'ALREADY_WATCHED');

    const regenerated = await service.create('u1', {
      ...request(['u1', 'u2', 'u3']),
      decisionRule: 'MINIMUM',
      minimumApprovals: 2,
    });
    assert.equal(
      regenerated.items.some(
        (item) => item.content.id === firstExposure.content.id,
      ),
      false,
    );
    assert.equal(
      regenerated.items.some(
        (item) => item.content.id === secondExposure.content.id,
      ),
      false,
    );
  });
});
