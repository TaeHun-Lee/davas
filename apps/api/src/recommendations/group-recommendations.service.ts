import { createHash } from 'node:crypto';
import type {
  GroupRecommendationConsensus,
  GroupRecommendationFeedbackResponse,
  GroupRecommendationSessionResponse,
} from '@davas/shared';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, In, Repository } from 'typeorm';
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
import { AvailabilityService } from '../media/availability.service';
import { SpaceAccessService } from '../spaces/space-access.service';
import {
  CreateRecommendationSessionDto,
  RecommendationFeedbackDto,
} from './group-recommendations.dto';
import {
  assignCandidateChannels,
  calculateGroupBase,
  DEFAULT_GROUP_GAMMA,
  DEFAULT_GROUP_LAMBDA,
  diversityRerank,
  GROUP_RECOMMENDATION_ALGORITHM_VERSION,
  NormalizedRecommendationRequest,
  passesHardFilters,
  qualityPrior,
  RankedCandidate,
  RecommendationCandidate,
  RatingSignal,
  scoreParticipant,
} from './group-recommendation.algorithm';

const response = (statusCode: number, code: string, message: string) => ({
  statusCode,
  code,
  message,
});
const normalized = (value: string) => value.trim().toLocaleLowerCase('en-US');
const clamp01 = (value: number) => Math.min(Math.max(value, 0), 1);
const round = (value: number) => Number(value.toFixed(5));

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
    @InjectRepository(RecommendationFeedbackEntity)
    private readonly feedback: Repository<RecommendationFeedbackEntity>,
    @InjectRepository(MediaEntity)
    private readonly media: Repository<MediaEntity>,
    @InjectRepository(AvailabilityObservationEntity)
    private readonly observations: Repository<AvailabilityObservationEntity>,
    @InjectRepository(DiaryEntity)
    private readonly diaries: Repository<DiaryEntity>,
    @InjectRepository(WatchParticipantEntity)
    private readonly watchParticipants: Repository<WatchParticipantEntity>,
    @InjectRepository(WatchReactionEntity)
    private readonly watchReactions: Repository<WatchReactionEntity>,
    private readonly availability: AvailabilityService,
    private readonly spaceAccess: SpaceAccessService,
    private readonly dataSource: DataSource,
  ) {}

  async create(
    accountId: string,
    dto: CreateRecommendationSessionDto,
  ): Promise<GroupRecommendationSessionResponse> {
    const request = this.normalizeRequest(dto);
    await this.assertSpaceMembers(
      request.spaceId,
      [accountId, ...request.participantAccountIds],
    );

    const seed = createHash('sha256')
      .update(JSON.stringify(request))
      .digest('hex');
    const ranked = await this.rankCandidates(request, seed);

    const saved = await this.dataSource.transaction(async (manager) => {
      await this.assertSpaceMembers(
        request.spaceId,
        [accountId, ...request.participantAccountIds],
        manager.getRepository(SpaceMembershipEntity),
      );
      const sessionRepository = manager.getRepository(
        RecommendationSessionEntity,
      );
      const exposureRepository = manager.getRepository(
        RecommendationExposureEntity,
      );
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
      const persisted = exposureRows.length
        ? await exposureRepository.save(exposureRows)
        : [];
      session.exposures = persisted;
      return session;
    });

    return this.sessionView(saved);
  }

  async get(
    sessionId: string,
    accountId: string,
  ): Promise<GroupRecommendationSessionResponse> {
    const session = await this.sessions.findOne({
      where: { id: sessionId },
      relations: { exposures: { content: true, feedback: true } },
    });
    if (!session) throw this.notFound();
    await this.assertSessionAudience(session, accountId);
    return this.sessionView(session);
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
    await this.assertSpaceMembers(
      exposure.session.spaceId,
      [accountId],
    );
    const watchEventId = await this.validateWatchLink(
      exposure,
      accountId,
      dto,
    );

    const saved = await this.dataSource.transaction(async (manager) => {
      const feedbackRepository = manager.getRepository(
        RecommendationFeedbackEntity,
      );
      let row = await feedbackRepository.findOne({
        where: { exposureId, accountId },
      });
      row = Object.assign(
        row ?? feedbackRepository.create({ exposureId, accountId }),
        { kind: dto.kind, watchEventId },
      );
      await feedbackRepository.save(row);
      const all = await feedbackRepository.find({ where: { exposureId } });
      const consensus = this.consensus(exposure.session, all);
      if (consensus.status === 'MATCHED') {
        exposure.session.status = 'MATCHED';
        await manager
          .getRepository(RecommendationSessionEntity)
          .save(exposure.session);
      }
      return { row, consensus };
    });

    return {
      feedback: {
        exposureId,
        kind: saved.row.kind,
        watchEventId: saved.row.watchEventId,
      },
      consensus: saved.consensus,
    };
  }

  private normalizeRequest(dto: CreateRecommendationSessionDto): SessionRequest {
    const participantAccountIds = [...new Set(dto.participantAccountIds)];
    if (
      participantAccountIds.length < 2 ||
      participantAccountIds.length > 5 ||
      participantAccountIds.length !== dto.participantAccountIds.length
    ) {
      throw this.badRequest(
        'RECOMMENDATION_PARTICIPANTS_INVALID',
        '추천 참여자는 중복 없이 2명에서 5명이어야 해요.',
      );
    }
    const runtimeMin = dto.runtime?.minMinutes ?? null;
    const runtimeMax = dto.runtime?.maxMinutes ?? null;
    if (
      runtimeMin !== null &&
      runtimeMax !== null &&
      runtimeMin > runtimeMax
    ) {
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
      dto.decisionRule === 'ALL'
        ? participantAccountIds.length
        : (dto.minimumApprovals ?? 0);
    if (
      minimumApprovals < 1 ||
      minimumApprovals > participantAccountIds.length
    ) {
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
      contentTypes: [...new Set(dto.contentTypes)].sort() as Array<
        'MOVIE' | 'TV'
      >,
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
    const now = new Date();
    const [media, observations, reactions, diaries, participations, feedback] =
      await Promise.all([
        this.media.find({
          order: { tmdbVoteCount: 'DESC', id: 'ASC' },
          take: 250,
        }),
        this.observations.find({
          where: { region: request.region },
          order: { observedAt: 'DESC', provider: 'ASC' },
          take: 5000,
        }),
        this.watchReactions.find({
          where: { accountId: In(request.participantAccountIds) },
          relations: { diary: { media: true } },
        }),
        this.diaries.find({
          where: { userId: In(request.participantAccountIds) },
        }),
        this.watchParticipants.find({
          where: {
            accountId: In(request.participantAccountIds),
            status: 'CONFIRMED',
          },
          relations: { diary: true },
        }),
        this.feedback.find({
          where: {
            accountId: In(request.participantAccountIds),
            kind: In(['REJECTED', 'ALREADY_WATCHED']),
          },
          relations: { exposure: true },
        }),
      ]);

    const ratings = this.ratingSignals(request.participantAccountIds, reactions);
    const positiveGenres = new Set<string>();
    for (const signals of ratings.values()) {
      for (const signal of signals) {
        if (signal.ratingScale >= 7) {
          signal.genres.forEach((genre) => positiveGenres.add(normalized(genre)));
        }
      }
    }
    const explicitlyRejected = new Set(
      feedback
        .filter((item) => item.kind === 'REJECTED')
        .map((item) => item.exposure?.contentId)
        .filter((contentId): contentId is string => Boolean(contentId)),
    );
    const watched = new Set([
      ...diaries.map((diary) => diary.mediaId),
      ...participations.map((participant) => participant.diary?.mediaId),
      ...feedback
        .filter((item) => item.kind === 'ALREADY_WATCHED')
        .map((item) => item.exposure?.contentId),
    ].filter((contentId): contentId is string => Boolean(contentId)));

    const candidates = this.toCandidates(media, observations).filter(
      ({ candidate }) =>
        passesHardFilters(
          candidate,
          request,
          now,
          explicitlyRejected,
          watched,
        ),
    );
    const mediaById = new Map(candidates.map((item) => [item.candidate.id, item.media]));
    const channels = assignCandidateChannels(
      candidates.map((item) => item.candidate),
      positiveGenres,
      seed,
    ).map(({ candidate, channels }) => ({
      candidate,
      media: mediaById.get(candidate.id)!,
      channels,
    }));
    const scored = channels.map((item) =>
      this.scoreCandidate(item, request, ratings, now),
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
      const finalAvailability = await this.finalAvailability(
        ranked.candidate.id,
        request,
      );
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

  private toCandidates(
    media: MediaEntity[],
    observations: AvailabilityObservationEntity[],
  ) {
    const latest = new Map<string, AvailabilityObservationEntity[]>();
    for (const observation of observations) {
      const current = latest.get(observation.contentId);
      if (!current) {
        latest.set(observation.contentId, [observation]);
      } else if (
        current[0].observedAt.getTime() === observation.observedAt.getTime()
      ) {
        current.push(observation);
      }
    }
    return media.map((item) => {
      const contentObservations = latest.get(item.id) ?? [];
      const first = contentObservations[0];
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
          availability: {
            status: first?.status ?? 'UNKNOWN',
            observedAt: first?.observedAt ?? new Date(0),
            expiresAt: first?.expiresAt ?? new Date(0),
            offers: contentObservations
              .filter((observation) => observation.status === 'AVAILABLE')
              .map((observation) => ({
                provider: observation.provider,
                offerType: observation.offerType,
                confidence: Number(observation.confidence),
              })),
          },
        } satisfies RecommendationCandidate,
      };
    });
  }

  private ratingSignals(
    participantIds: string[],
    reactions: WatchReactionEntity[],
  ) {
    const result = new Map<string, RatingSignal[]>(
      participantIds.map((accountId) => [accountId, []]),
    );
    for (const reaction of reactions) {
      if (reaction.ratingScale === null || !reaction.diary?.media) continue;
      result.get(reaction.accountId)?.push({
        genres: reaction.diary.media.genres ?? [],
        ratingScale: reaction.ratingScale,
      });
    }
    return result;
  }

  private scoreCandidate(
    item: CandidateWithChannels,
    request: SessionRequest,
    ratings: Map<string, RatingSignal[]>,
    now: Date,
  ) {
    const participantScores = request.participantAccountIds.map((accountId) =>
      scoreParticipant(
        accountId,
        item.candidate,
        ratings.get(accountId) ?? [],
        request.moodTags,
      ),
    );
    const group = calculateGroupBase(
      participantScores.map(({ score }) => score),
    );
    const contextFit = request.moodTags.some((tag) =>
      item.candidate.genres.some((genre) => normalized(genre) === tag),
    )
      ? 0.04
      : 0;
    const qualityBonus = qualityPrior(item.candidate) * 0.06;
    const releaseYear = Number(item.candidate.releaseDate?.slice(0, 4));
    const freshnessBonus =
      Number.isFinite(releaseYear) && releaseYear >= now.getUTCFullYear() - 3
        ? 0.03
        : 0;
    const explorationBonus = item.channels.includes('SAFE_EXPLORATION')
      ? 0.015
      : 0;
    const uncertaintyRisk =
      (participantScores.reduce(
        (total, prediction) => total + prediction.uncertainty,
        0,
      ) /
        participantScores.length) *
      0.06;
    const finalScore = round(
      clamp01(
        group.groupBase +
          contextFit +
          qualityBonus +
          freshnessBonus +
          explorationBonus -
          uncertaintyRisk,
      ),
    );
    const ranked: RankedCandidate = {
      candidate: item.candidate,
      participantScores,
      groupBase: group.groupBase,
      finalScore,
      channels: item.channels,
      scoreParts: {
        mean: group.mean,
        floor: group.floor,
        dispersion: group.dispersion,
        contextFit: round(contextFit),
        qualityPrior: round(qualityBonus),
        freshnessBonus: round(freshnessBonus),
        explorationBonus: round(explorationBonus),
        uncertaintyRisk: round(uncertaintyRisk),
      },
    };
    return { media: item.media, ranked };
  }

  private async finalAvailability(
    contentId: string,
    request: SessionRequest,
  ) {
    try {
      const current = await this.availability.getCurrent(
        contentId,
        request.region,
      );
      const allowed = new Set(request.services);
      const offers = current.offers.filter((offer) =>
        allowed.has(normalized(offer.provider)),
      );
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
    if (item.ranked.channels.includes('CONTENT_AFFINITY'))
      codes.push('GROUP_CONTENT_AFFINITY');
    if (item.ranked.channels.includes('QUALITY_POPULAR'))
      codes.push('QUALITY_COLD_START');
    if (item.ranked.channels.includes('FRESH_RELEASE'))
      codes.push('RECENT_RELEASE');
    if (
      request.moodTags.some((tag) =>
        item.media.genres.some((genre) => normalized(genre) === tag),
      )
    )
      codes.push('MATCHES_REQUESTED_MOOD');
    if ((item.ranked.diversityPenalty ?? 0) > 0)
      codes.push('DIVERSITY_RERANKED');
    return {
      codes,
      params: {
        region: request.region,
        services: providers,
        ...(codes.includes('MATCHES_REQUESTED_MOOD')
          ? { moodTags: request.moodTags }
          : {}),
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
    const rejections = participantFeedback.filter(
      (row) => row.kind === 'REJECTED',
    ).length;
    const required = session.minimumApprovals;
    const possible = session.participantAccountIds.length - rejections;
    const status =
      approvals >= required
        ? 'MATCHED'
        : possible < required
          ? 'REJECTED'
          : 'PENDING';
    return {
      status,
      interestedCount: approvals,
      respondedCount: participantFeedback.length,
      requiredCount: required,
      participantCount: session.participantAccountIds.length,
    };
  }

  private async assertSessionAudience(
    session: RecommendationSessionEntity,
    accountId: string,
  ) {
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
      await this.spaceAccess.assertActiveMembers(
        spaceId,
        accountIds,
        repository,
      );
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

  private sessionView(
    session: RecommendationSessionEntity,
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
      }));
    return {
      session: {
        id: session.id,
        spaceId: session.spaceId,
        requesterAccountId: session.requesterAccountId,
        participantAccountIds: session.participantAccountIds,
        constraints: session.constraintsSnapshot,
        algorithmVersion: session.algorithmVersion,
        status: session.status,
        createdAt: session.createdAt?.toISOString(),
      },
      items,
      emptyReason: items.length === 0 ? 'NO_HARD_FILTER_MATCHES' : null,
    };
  }

  private badRequest(code: string, message: string) {
    return new BadRequestException(response(400, code, message));
  }

  private notFound() {
    return new NotFoundException(
      response(404, 'RECOMMENDATION_NOT_FOUND', '추천을 찾을 수 없어요.'),
    );
  }
}
