import { SPACE_MAX_MEMBERS, SPACE_MIN_MEMBERS } from '@davas/shared';
import { createHash } from 'node:crypto';
import type {
  GroupRecommendationConsensus,
  GroupRecommendationDecidedPickResponse,
  GroupRecommendationFeedbackResponse,
  GroupRecommendationSessionListResponse,
  GroupRecommendationSessionResponse,
  GroupRecommendationSessionSummary,
} from '@davas/shared';
import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  Optional,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, In, Repository } from 'typeorm';
import {
  DiaryEntity,
  MediaEntity,
  RecommendationExposureEntity,
  RecommendationFeedbackEntity,
  RecommendationSessionEntity,
  SpaceMembershipEntity,
  WatchParticipantEntity,
} from '../database/entities';
import { AvailabilityService } from '../media/availability.service';
import { NotificationsService } from '../notifications/notifications.service';
import { SpaceAccessService } from '../spaces/space-access.service';
import {
  CreateRecommendationSessionDto,
  RecommendationFeedbackDto,
} from './group-recommendations.dto';
import {
  assignCandidateChannels,
  DEFAULT_GROUP_GAMMA,
  DEFAULT_GROUP_LAMBDA,
  diversityRerank,
  GROUP_RECOMMENDATION_ALGORITHM_VERSION,
  NormalizedRecommendationRequest,
  passesHardFilters,
  POPULAR_NOW_THRESHOLD,
  rankCandidate,
  RankedCandidate,
  RecommendationCandidate,
  scoreParticipant,
  tagMatchesGenres,
  tasteFeatures,
} from './group-recommendation.algorithm';
import {
  buildTasteProfile,
  favoriteFeatures,
  featureShare,
  type TasteProfile,
} from './taste-profile';
import { TasteHistory } from './taste-history';
import {
  GroupRecommendationPool,
  type LatestAvailability,
  onChosenService,
} from './group-recommendation-pool';
import { SUBSCRIPTION_OFFER_TYPES } from '../media/ports/availability-provider.port';
import { DAY_MS } from '../common/time';

const response = (statusCode: number, code: string, message: string) => ({
  statusCode,
  code,
  message,
});
const normalized = (value: string) => value.trim().toLocaleLowerCase('en-US');
// A pick nobody settled stops taking answers after a week, as if its starter had ended it.
const SESSION_OPEN_DAYS = 7;
// What a pick settled on stays home's "오늘 밤 후보" for a few days, or until someone records it.
const DECIDED_PICK_DAYS = 3;

type SessionRequest = NormalizedRecommendationRequest & {
  spaceId: string;
  participantAccountIds: string[];
  decisionRule: 'ALL' | 'MINIMUM';
  minimumApprovals: number;
};

type CandidateWithChannels = {
  candidate: RecommendationCandidate;
  media: MediaEntity;
  channels: string[];
};

@Injectable()
export class GroupRecommendationsService {
  constructor(
    @InjectRepository(RecommendationSessionEntity)
    private readonly sessions: Repository<RecommendationSessionEntity>,
    @InjectRepository(RecommendationExposureEntity)
    private readonly exposures: Repository<RecommendationExposureEntity>,
    @InjectRepository(DiaryEntity)
    private readonly diaries: Repository<DiaryEntity>,
    @InjectRepository(WatchParticipantEntity)
    private readonly watchParticipants: Repository<WatchParticipantEntity>,
    private readonly tasteHistory: TasteHistory,
    private readonly availability: AvailabilityService,
    private readonly spaceAccess: SpaceAccessService,
    private readonly dataSource: DataSource,
    private readonly pool: GroupRecommendationPool,
    @Optional() private readonly notifications?: NotificationsService,
  ) {}

  /** The service's clock; tests set it to keep fixed dates inside the open week. */
  now: () => Date = () => new Date();

  async create(
    accountId: string,
    dto: CreateRecommendationSessionDto,
  ): Promise<GroupRecommendationSessionResponse> {
    const request = this.normalizeRequest(dto);
    await this.assertSpaceMembers(request.spaceId, [accountId, ...request.participantAccountIds]);

    const seed = createHash('sha256').update(JSON.stringify(request)).digest('hex');
    const ranked = await this.rankCandidates(request, seed);

    const saved = await this.dataSource.transaction(async (manager) => {
      await this.assertSpaceMembers(
        request.spaceId,
        [accountId, ...request.participantAccountIds],
        manager.getRepository(SpaceMembershipEntity),
      );
      const sessionRepository = manager.getRepository(RecommendationSessionEntity);
      const exposureRepository = manager.getRepository(RecommendationExposureEntity);
      const session = await sessionRepository.save(
        sessionRepository.create({
          spaceId: request.spaceId,
          requesterAccountId: accountId,
          participantAccountIds: request.participantAccountIds,
          region: request.region,
          services: request.services,
          contentTypes: request.contentTypes,
          runtimeMin: request.runtimeMin,
          runtimeMax: request.runtimeMax,
          moodTags: request.moodTags,
          avoidTags: request.avoidTags,
          rewatchPolicy: request.rewatchPolicy,
          decisionRule: request.decisionRule,
          minimumApprovals: request.minimumApprovals,
          lambda: String(DEFAULT_GROUP_LAMBDA),
          gamma: String(DEFAULT_GROUP_GAMMA),
          algorithmVersion: GROUP_RECOMMENDATION_ALGORITHM_VERSION,
          seed,
          constraintsSnapshot: this.constraintsSnapshot(request),
          status: 'OPEN',
        }),
      );
      const exposureRows = ranked.map((item, index) =>
        exposureRepository.create({
          sessionId: session.id,
          contentId: item.media.id,
          content: item.media,
          rank: index + 1,
          groupScore: String(item.ranked.finalScore),
          participantScores: item.ranked.participantScores.map(
            ({ accountId: participantId, score, uncertainty }) => ({
              accountId: participantId,
              score,
              uncertainty,
            }),
          ),
          scoreParts: item.ranked.scoreParts,
          candidateChannels: item.ranked.channels,
          reasonCodes: item.reasonCodes,
          reasonParams: item.reasonParams,
          availabilitySnapshot: item.availabilitySnapshot,
        }),
      );
      const persisted = exposureRows.length ? await exposureRepository.save(exposureRows) : [];
      session.exposures = persisted;
      return session;
    });

    // The others are asked to answer; a pick with nothing to choose from asks no one.
    if (saved.exposures?.length) {
      await Promise.all(
        request.participantAccountIds
          .filter((recipientId) => recipientId !== accountId)
          .map((recipientId) =>
            this.notifications
              ?.notifyRecommendationRequested({
                recipientId,
                actorId: accountId,
                idempotencyKey: `RECOMMENDATION_REQUESTED:${recipientId}:${saved.id}`,
              })
              .catch(() => undefined),
          ),
      );
    }
    return this.sessionView(saved, accountId);
  }

  /**
   * Recent picks in a space that the viewer started or was asked into, newest first, so
   * everyone in a pick can come back to it and answer.
   */
  async listForSpace(
    spaceId: string,
    accountId: string,
  ): Promise<GroupRecommendationSessionListResponse> {
    await this.assertSpaceMembers(spaceId, [accountId]);
    // A space has two to five people, so its recent picks are few enough to filter here.
    const sessions = await this.sessions.find({
      where: { spaceId },
      order: { createdAt: 'DESC' },
      take: 30,
      relations: { exposures: { content: true, feedback: true } },
    });
    return {
      items: sessions
        .filter(
          (session) =>
            session.requesterAccountId === accountId ||
            session.participantAccountIds.includes(accountId),
        )
        .slice(0, 10)
        .map((session) => this.sessionSummary(session, accountId)),
    };
  }

  async get(sessionId: string, accountId: string): Promise<GroupRecommendationSessionResponse> {
    const session = await this.loadSession(sessionId, accountId);
    return this.sessionView(session, accountId);
  }

  async recordFeedback(
    exposureId: string,
    accountId: string,
    dto: RecommendationFeedbackDto,
  ): Promise<GroupRecommendationFeedbackResponse> {
    const exposure = await this.exposures.findOne({
      where: { id: exposureId },
      relations: { session: true, content: true },
    });
    if (!exposure?.session) throw this.notFound();
    if (!exposure.session.participantAccountIds.includes(accountId)) {
      throw this.notFound();
    }
    await this.assertSpaceMembers(exposure.session.spaceId, [accountId]);
    if (this.status(exposure.session) === 'CLOSED') throw this.closed();
    const watchEventId = await this.validateWatchLink(exposure, accountId, dto);
    const matchedBefore = exposure.session.status === 'MATCHED';

    const saved = await this.dataSource.transaction(async (manager) => {
      const feedbackRepository = manager.getRepository(RecommendationFeedbackEntity);
      let row = await feedbackRepository.findOne({
        where: { exposureId, accountId },
      });
      row = Object.assign(row ?? feedbackRepository.create({ exposureId, accountId }), {
        kind: dto.kind,
        watchEventId,
      });
      await feedbackRepository.save(row);
      const all = await feedbackRepository.find({ where: { exposureId } });
      const consensus = this.consensus(exposure.session, all);
      if (consensus.status === 'MATCHED') {
        exposure.session.status = 'MATCHED';
        await manager.getRepository(RecommendationSessionEntity).save(exposure.session);
      }
      return { row, consensus };
    });

    // The first agreement in a pick tells everyone in it, once each.
    if (!matchedBefore && saved.consensus.status === 'MATCHED') {
      const session = exposure.session;
      const others = [
        ...new Set([session.requesterAccountId, ...session.participantAccountIds]),
      ].filter((recipientId) => recipientId !== accountId);
      await Promise.all(
        others.map((recipientId) =>
          this.notifications
            ?.notifyRecommendationMatched({
              recipientId,
              actorId: accountId,
              mediaId: exposure.contentId,
              idempotencyKey: `RECOMMENDATION_MATCHED:${recipientId}:${session.id}`,
            })
            .catch(() => undefined),
        ),
      );
    }

    return {
      feedback: {
        exposureId,
        kind: saved.row.kind,
        watchEventId: saved.row.watchEventId,
      },
      consensus: saved.consensus,
    };
  }

  /**
   * "이걸로 볼게요": anyone in a pick settles on a title everyone needed agreed on. The pick
   * closes, and the title becomes home's "오늘 밤 후보" for the people in it.
   */
  async decide(
    sessionId: string,
    accountId: string,
    exposureId: string,
  ): Promise<GroupRecommendationSessionResponse> {
    const session = await this.loadSession(sessionId, accountId);
    if (this.status(session) === 'CLOSED') throw this.closed();
    const exposure = session.exposures?.find((item) => item.id === exposureId);
    if (!exposure) throw this.notFound();
    if (this.consensus(session, exposure.feedback ?? []).status !== 'MATCHED') {
      throw this.badRequest('RECOMMENDATION_NOT_AGREED', '모두 동의한 작품만 고를 수 있어요.');
    }
    Object.assign(session, {
      status: 'CLOSED' as const,
      decidedExposureId: exposure.id,
      closedAt: this.now(),
    });
    await this.sessions.save(session);
    return this.sessionView(session, accountId);
  }

  /** "그만 고르기": only the person who started a pick ends it without a title. */
  async close(sessionId: string, accountId: string): Promise<GroupRecommendationSessionResponse> {
    const session = await this.loadSession(sessionId, accountId);
    if (session.status !== 'CLOSED') {
      if (session.requesterAccountId !== accountId) {
        throw new ForbiddenException(
          response(
            403,
            'RECOMMENDATION_CLOSE_FORBIDDEN',
            '함께 고르기를 시작한 사람만 끝낼 수 있어요.',
          ),
        );
      }
      Object.assign(session, { status: 'CLOSED' as const, closedAt: this.now() });
      await this.sessions.save(session);
    }
    return this.sessionView(session, accountId);
  }

  /**
   * The title the viewer's latest pick in this space settled on, for home's "오늘 밤 후보".
   * It stays for a few days and goes as soon as someone in the pick records that title.
   */
  async decidedPick(
    spaceId: string,
    accountId: string,
  ): Promise<GroupRecommendationDecidedPickResponse> {
    await this.assertSpaceMembers(spaceId, [accountId]);
    const since = this.now().getTime() - DECIDED_PICK_DAYS * DAY_MS;
    const sessions = await this.sessions.find({
      where: { spaceId },
      order: { createdAt: 'DESC' },
      take: 30,
      relations: { exposures: { content: true } },
    });
    const decided = sessions
      .filter(
        (session) =>
          session.decidedExposureId &&
          session.closedAt &&
          session.closedAt.getTime() >= since &&
          (session.requesterAccountId === accountId ||
            session.participantAccountIds.includes(accountId)),
      )
      .sort((left, right) => right.closedAt!.getTime() - left.closedAt!.getTime())[0];
    const exposure = decided?.exposures?.find((item) => item.id === decided.decidedExposureId);
    if (!decided || !exposure?.content) return { pick: null };
    const people = [...new Set([decided.requesterAccountId, ...decided.participantAccountIds])];
    const records = await this.diaries.find({
      where: { mediaId: exposure.contentId, userId: In(people) },
    });
    const recorded = records.some(
      (diary) => !diary.deletedAt && diary.createdAt.getTime() >= decided.closedAt!.getTime(),
    );
    if (recorded) return { pick: null };
    const media = exposure.content;
    return {
      pick: {
        sessionId: decided.id,
        decidedAt: decided.closedAt!.toISOString(),
        media: {
          id: media.id,
          title: media.title,
          mediaType: media.mediaType,
          posterUrl: media.posterUrl ?? null,
          releaseYear: media.releaseDate?.slice(0, 4) ?? null,
          genres: media.genres ?? [],
        },
      },
    };
  }

  private async loadSession(sessionId: string, accountId: string) {
    const session = await this.sessions.findOne({
      where: { id: sessionId },
      relations: { exposures: { content: true, feedback: true } },
    });
    if (!session) throw this.notFound();
    await this.assertSessionAudience(session, accountId);
    return session;
  }

  /** CLOSED once someone ended it, or once it has been open for a week. */
  private status(session: RecommendationSessionEntity) {
    if (session.status === 'CLOSED') return 'CLOSED' as const;
    const age = this.now().getTime() - (session.createdAt?.getTime() ?? this.now().getTime());
    return age > SESSION_OPEN_DAYS * DAY_MS ? ('CLOSED' as const) : session.status;
  }

  private closedAt(session: RecommendationSessionEntity) {
    if (session.closedAt) return session.closedAt.toISOString();
    if (this.status(session) !== 'CLOSED' || !session.createdAt) return null;
    return new Date(session.createdAt.getTime() + SESSION_OPEN_DAYS * DAY_MS).toISOString();
  }

  private normalizeRequest(dto: CreateRecommendationSessionDto): SessionRequest {
    const participantAccountIds = [...new Set(dto.participantAccountIds)];
    if (
      participantAccountIds.length < SPACE_MIN_MEMBERS ||
      participantAccountIds.length > SPACE_MAX_MEMBERS ||
      participantAccountIds.length !== dto.participantAccountIds.length
    ) {
      throw this.badRequest(
        'RECOMMENDATION_PARTICIPANTS_INVALID',
        `추천 참여자는 중복 없이 ${SPACE_MIN_MEMBERS}명에서 ${SPACE_MAX_MEMBERS}명이어야 해요.`,
      );
    }
    const runtimeMin = dto.runtime?.minMinutes ?? null;
    const runtimeMax = dto.runtime?.maxMinutes ?? null;
    if (runtimeMin !== null && runtimeMax !== null && runtimeMin > runtimeMax) {
      throw this.badRequest(
        'RECOMMENDATION_RUNTIME_INVALID',
        '최소 러닝타임은 최대 러닝타임보다 클 수 없어요.',
      );
    }
    const services = this.normalizeList(dto.services);
    const moodTags = this.normalizeList(dto.moodTags ?? []);
    const avoidTags = this.normalizeList(dto.avoidTags ?? []);
    if (!services.length) {
      throw this.badRequest(
        'RECOMMENDATION_SERVICES_REQUIRED',
        '하나 이상의 시청 서비스를 선택해 주세요.',
      );
    }
    const overlap = moodTags.find((tag) => avoidTags.includes(tag));
    if (overlap) {
      throw this.badRequest(
        'RECOMMENDATION_CONSTRAINT_CONFLICT',
        `원하는 분위기와 피할 조건에 '${overlap}' 항목이 함께 있어요.`,
      );
    }
    const minimumApprovals =
      dto.decisionRule === 'ALL' ? participantAccountIds.length : (dto.minimumApprovals ?? 0);
    if (minimumApprovals < 1 || minimumApprovals > participantAccountIds.length) {
      throw this.badRequest(
        'RECOMMENDATION_DECISION_RULE_INVALID',
        '최소 동의 인원은 참여자 수 안에서 정해야 해요.',
      );
    }
    return {
      spaceId: dto.spaceId,
      participantAccountIds: [...participantAccountIds].sort(),
      region: dto.region.trim().toUpperCase(),
      services,
      contentTypes: [...new Set(dto.contentTypes)].sort() as Array<'MOVIE' | 'TV'>,
      runtimeMin,
      runtimeMax,
      moodTags,
      avoidTags,
      rewatchPolicy: dto.rewatchPolicy,
      decisionRule: dto.decisionRule,
      minimumApprovals,
    };
  }

  private normalizeList(values: string[]) {
    return [...new Set(values.map(normalized).filter(Boolean))].sort();
  }

  private async rankCandidates(request: SessionRequest, seed: string) {
    const history = await this.tasteHistory.read(request.participantAccountIds, {
      spaceId: request.spaceId,
    });
    const excluded = new Set([
      ...history.rejected,
      ...(request.rewatchPolicy === 'EXCLUDE' ? history.watched : []),
    ]);
    await this.pool.warm(request, excluded);
    const now = this.now();
    const media = await this.pool.unseen(request, excluded);
    // Taste is read against every known title of the requested types, not only what is left.
    const universe = featureShare(
      (await this.pool.known(request)).map((item) => ({
        features: tasteFeatures(item.genres ?? []),
      })),
    );
    const profiles = new Map(
      request.participantAccountIds.map((accountId) => [
        accountId,
        buildTasteProfile(history.signals.get(accountId) ?? [], now),
      ]),
    );
    const fresh = await this.pool.freshFor(
      media.map((item) => item.id),
      request.region,
    );

    const candidates = this.toCandidates(media, fresh).filter(({ candidate }) =>
      passesHardFilters(candidate, request, now, history.rejected, history.watched),
    );
    const mediaById = new Map(candidates.map((item) => [item.candidate.id, item.media]));
    const channels = assignCandidateChannels(
      candidates.map((item) => item.candidate),
      favoriteFeatures(buildTasteProfile(history.shared, now), universe),
      seed,
    ).map(({ candidate, channels }) => ({
      candidate,
      media: mediaById.get(candidate.id)!,
      channels,
    }));
    const mostPopular = Math.max(0, ...candidates.map((item) => item.candidate.popularity ?? 0));
    const scored = channels.map((item) =>
      this.scoreCandidate(item, request, profiles, universe, now, mostPopular),
    );
    const reranked = diversityRerank(
      scored.map((item) => item.ranked),
      Math.min(scored.length, 30),
    );
    const scoredById = new Map(scored.map((item) => [item.media.id, item]));
    const result = [];
    for (const ranked of reranked) {
      if (result.length >= 10) break;
      const item = scoredById.get(ranked.candidate.id)!;
      const finalAvailability = await this.finalAvailability(ranked.candidate.id, request);
      if (!finalAvailability) continue;
      const reasons = this.reasons(item, request, finalAvailability.providers);
      result.push({
        ...item,
        ranked,
        reasonCodes: reasons.codes,
        reasonParams: reasons.params,
        availabilitySnapshot: finalAvailability,
      });
    }
    return result;
  }

  private toCandidates(media: MediaEntity[], fresh: ReadonlyMap<string, LatestAvailability>) {
    return media.map((item) => {
      const latest = fresh.get(item.id);
      return {
        media: item,
        candidate: {
          id: item.id,
          mediaType: item.mediaType,
          title: item.title,
          runtime: item.runtime,
          genres: item.genres ?? [],
          director: item.director,
          releaseDate: item.releaseDate,
          rating: item.tmdbRating === null ? null : Number(item.tmdbRating),
          voteCount: item.tmdbVoteCount ?? 0,
          popularity: item.tmdbPopularity ?? null,
          availability: {
            status: latest?.status ?? 'UNKNOWN',
            observedAt: latest?.observedAt ?? new Date(0),
            expiresAt: latest?.expiresAt ?? new Date(0),
            // Renting or buying is not "on a service we subscribe to".
            offers: (latest?.offers ?? []).filter((offer) =>
              SUBSCRIPTION_OFFER_TYPES.has(offer.offerType),
            ),
          },
        } satisfies RecommendationCandidate,
      };
    });
  }

  private scoreCandidate(
    item: CandidateWithChannels,
    request: SessionRequest,
    profiles: ReadonlyMap<string, TasteProfile>,
    universe: ReadonlyMap<string, number>,
    now: Date,
    mostPopular: number,
  ) {
    const participantScores = request.participantAccountIds.map((accountId) =>
      scoreParticipant(
        accountId,
        item.candidate,
        profiles.get(accountId)!,
        universe,
        request.moodTags,
      ),
    );
    const ranked = rankCandidate(item.candidate, participantScores, {
      moodTags: request.moodTags,
      channels: item.channels,
      now,
      mostPopular,
    });
    return { media: item.media, ranked };
  }

  private async finalAvailability(contentId: string, request: SessionRequest) {
    try {
      const current = await this.availability.getCurrent(contentId, request.region);
      const offers = current.offers.filter((offer) => onChosenService(offer, request.services));
      if (
        current.state !== 'AVAILABLE' ||
        offers.length === 0 ||
        !current.observedAt ||
        !current.expiresAt
      ) {
        return null;
      }
      return {
        region: current.region,
        providers: [...new Set(offers.map((offer) => offer.provider))].sort(),
        observedAt: current.observedAt,
        expiresAt: current.expiresAt,
        confidence: current.confidence,
      };
    } catch {
      return null;
    }
  }

  private reasons(
    item: { media: MediaEntity; ranked: RankedCandidate },
    request: SessionRequest,
    providers: string[],
  ) {
    const codes = ['AVAILABLE_ON_SELECTED_SERVICES'];
    if (item.ranked.channels.includes('CONTENT_AFFINITY')) codes.push('GROUP_CONTENT_AFFINITY');
    // "Little is known about your taste, so quality and popularity helped" only when true.
    const uncertainty =
      item.ranked.participantScores.reduce((sum, person) => sum + person.uncertainty, 0) /
      item.ranked.participantScores.length;
    if (item.ranked.channels.includes('QUALITY_POPULAR') && uncertainty >= 0.6) {
      codes.push('QUALITY_COLD_START');
    }
    if (item.ranked.channels.includes('FRESH_RELEASE')) codes.push('RECENT_RELEASE');
    if (request.moodTags.some((tag) => tagMatchesGenres(tag, item.media.genres)))
      codes.push('MATCHES_REQUESTED_MOOD');
    // Popularity counts in the ranking, so it can be a reason when it really is high.
    if ((item.ranked.scoreParts.popularityBonus ?? 0) >= 0.2 * POPULAR_NOW_THRESHOLD) {
      codes.push('POPULAR_NOW');
    }
    if ((item.ranked.diversityPenalty ?? 0) > 0) codes.push('DIVERSITY_RERANKED');
    return {
      codes,
      params: {
        region: request.region,
        services: providers,
        ...(codes.includes('MATCHES_REQUESTED_MOOD') ? { moodTags: request.moodTags } : {}),
      },
    };
  }

  private async validateWatchLink(
    exposure: RecommendationExposureEntity,
    accountId: string,
    dto: RecommendationFeedbackDto,
  ) {
    if (dto.kind !== 'WATCHED') {
      if (dto.watchEventId) {
        throw this.badRequest(
          'RECOMMENDATION_WATCH_LINK_INVALID',
          '감상 완료 피드백에만 감상 기록을 연결할 수 있어요.',
        );
      }
      return null;
    }
    if (!dto.watchEventId) {
      throw this.badRequest(
        'RECOMMENDATION_WATCH_LINK_REQUIRED',
        '감상 완료 피드백에는 감상 기록이 필요해요.',
      );
    }
    const watchEvent = await this.diaries.findOne({
      where: { id: dto.watchEventId },
    });
    if (!watchEvent || watchEvent.mediaId !== exposure.contentId) {
      throw this.notFound();
    }
    if (watchEvent.userId !== accountId) {
      const participant = await this.watchParticipants.findOne({
        where: {
          diaryId: watchEvent.id,
          accountId,
          status: 'CONFIRMED',
        },
      });
      if (!participant) throw this.notFound();
    }
    return watchEvent.id;
  }

  private consensus(
    session: RecommendationSessionEntity,
    rows: RecommendationFeedbackEntity[],
  ): GroupRecommendationConsensus {
    const participantFeedback = rows.filter((row) =>
      session.participantAccountIds.includes(row.accountId),
    );
    const approvals = participantFeedback.filter((row) =>
      ['INTERESTED', 'WATCHED'].includes(row.kind),
    ).length;
    const rejections = participantFeedback.filter((row) => row.kind === 'REJECTED').length;
    const required = session.minimumApprovals;
    const possible = session.participantAccountIds.length - rejections;
    const status = approvals >= required ? 'MATCHED' : possible < required ? 'REJECTED' : 'PENDING';
    return {
      status,
      interestedCount: approvals,
      respondedCount: participantFeedback.length,
      requiredCount: required,
      participantCount: session.participantAccountIds.length,
    };
  }

  private async assertSessionAudience(session: RecommendationSessionEntity, accountId: string) {
    if (
      session.requesterAccountId !== accountId &&
      !session.participantAccountIds.includes(accountId)
    ) {
      throw this.notFound();
    }
    await this.assertSpaceMembers(session.spaceId, [accountId]);
  }

  private async assertSpaceMembers(
    spaceId: string,
    accountIds: string[],
    repository?: Repository<SpaceMembershipEntity>,
  ) {
    try {
      await this.spaceAccess.assertActiveMembers(spaceId, accountIds, repository);
    } catch (error) {
      if (error instanceof NotFoundException) throw this.notFound();
      throw error;
    }
  }

  private constraintsSnapshot(request: SessionRequest) {
    return {
      region: request.region,
      services: request.services,
      contentTypes: request.contentTypes,
      runtime: {
        minMinutes: request.runtimeMin,
        maxMinutes: request.runtimeMax,
      },
      moodTags: request.moodTags,
      avoidTags: request.avoidTags,
      rewatchPolicy: request.rewatchPolicy,
      decisionRule: request.decisionRule,
      minimumApprovals: request.minimumApprovals,
    };
  }

  private sessionSummary(
    session: RecommendationSessionEntity,
    accountId: string,
  ): GroupRecommendationSessionSummary {
    const exposures = [...(session.exposures ?? [])].sort((left, right) => left.rank - right.rank);
    const matched = exposures.find(
      (exposure) => this.consensus(session, exposure.feedback ?? []).status === 'MATCHED',
    );
    const decided = exposures.find((exposure) => exposure.id === session.decidedExposureId);
    return {
      id: session.id,
      requesterAccountId: session.requesterAccountId,
      participantAccountIds: session.participantAccountIds,
      status: this.status(session),
      decidedTitle: decided?.content?.title ?? null,
      createdAt: session.createdAt?.toISOString(),
      itemCount: exposures.length,
      answeredByMe: exposures.filter((exposure) =>
        (exposure.feedback ?? []).some((row) => row.accountId === accountId),
      ).length,
      matchedTitle: matched?.content?.title ?? null,
    };
  }

  private sessionView(
    session: RecommendationSessionEntity,
    viewerAccountId: string,
  ): GroupRecommendationSessionResponse {
    const items = (session.exposures ?? [])
      .sort((left, right) => left.rank - right.rank)
      .map((exposure) => ({
        exposureId: exposure.id,
        rank: exposure.rank,
        content: {
          id: exposure.contentId,
          title: exposure.content?.title,
          mediaType: exposure.content?.mediaType,
          posterUrl: exposure.content?.posterUrl ?? null,
          releaseDate: exposure.content?.releaseDate ?? null,
          runtime: exposure.content?.runtime ?? null,
          genres: exposure.content?.genres ?? [],
        },
        reasons: exposure.reasonCodes.map((code) => ({
          reasonCode: code,
          params: exposure.reasonParams,
        })),
        availability: exposure.availabilitySnapshot,
        consensus: this.consensus(session, exposure.feedback ?? []),
        myFeedback:
          exposure.feedback?.find((row) => row.accountId === viewerAccountId)?.kind ?? null,
      }));
    return {
      session: {
        id: session.id,
        spaceId: session.spaceId,
        requesterAccountId: session.requesterAccountId,
        participantAccountIds: session.participantAccountIds,
        constraints: session.constraintsSnapshot,
        algorithmVersion: session.algorithmVersion,
        status: this.status(session),
        createdAt: session.createdAt?.toISOString(),
        closedAt: this.closedAt(session),
        decidedExposureId: session.decidedExposureId ?? null,
      },
      items,
      emptyReason: items.length === 0 ? 'NO_HARD_FILTER_MATCHES' : null,
    };
  }

  private badRequest(code: string, message: string) {
    return new BadRequestException(response(400, code, message));
  }

  private closed() {
    return new ConflictException(
      response(409, 'RECOMMENDATION_CLOSED', '이미 끝난 함께 고르기예요.'),
    );
  }

  private notFound() {
    return new NotFoundException(
      response(404, 'RECOMMENDATION_NOT_FOUND', '추천을 찾을 수 없어요.'),
    );
  }
}
