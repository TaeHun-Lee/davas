import { randomUUID } from 'node:crypto';
import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
  Optional,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  DataSource,
  Equal,
  EntityManager,
  FindOptionsWhere,
  In,
  IsNull,
  LessThan,
  Repository,
} from 'typeorm';
import {
  CommentEntity,
  DiaryEntity,
  MediaEntity,
  SpaceMembershipEntity,
  WatchParticipantEntity,
  WatchReactionEntity,
  WatchReviewLikeEntity,
  WatchShareEntity,
  WatchSourceEntity,
} from '../database/entities';
import { NotificationsService } from '../notifications/notifications.service';
import { TransactionOutboxService } from '../outbox/transaction-outbox.service';
import { SpaceAccessService } from '../spaces/space-access.service';
import type { WatchProgress } from '@davas/shared';
import { hiddenReviewAccountIds } from './blind-review';
import { DiaryAccessService } from './diary-access.service';
import { WatchPhotosService } from './watch-photos.service';
import {
  CreateWatchEventDto,
  SaveWatchReactionDto,
  UpdateWatchEventDto,
  WatchSourceDto,
  WatchTimelineQueryDto,
} from './dto/watch-event.dto';

const response = (statusCode: number, code: string, message: string) => ({
  statusCode,
  code,
  message,
});

const ratingScale = (rating: number | null | undefined) =>
  rating === null || rating === undefined ? null : Math.round(rating * 2);

const REVIEW_FIELDS = ['rating', 'headline', 'review', 'hasSpoiler', 'isBlind'] as const;
const hasReviewFields = (dto: SaveWatchReactionDto) =>
  REVIEW_FIELDS.some((field) => dto[field] !== undefined);

// Relations every watch-record view needs; the timeline loads the same tree under `diary`.
const WATCH_VIEW_RELATIONS = {
  media: true,
  user: true,
  watchParticipants: { account: true },
  watchReactions: { account: true, likes: true },
  watchSource: true,
  spaceShares: true,
  watchPhotos: true,
} as const;

@Injectable()
export class WatchEventsService {
  private readonly logger = new Logger(WatchEventsService.name);

  constructor(
    @InjectRepository(DiaryEntity)
    private readonly diaries: Repository<DiaryEntity>,
    @InjectRepository(MediaEntity)
    private readonly media: Repository<MediaEntity>,
    @InjectRepository(WatchParticipantEntity)
    private readonly participants: Repository<WatchParticipantEntity>,
    @InjectRepository(WatchReactionEntity)
    private readonly reactions: Repository<WatchReactionEntity>,
    @InjectRepository(WatchSourceEntity)
    private readonly sources: Repository<WatchSourceEntity>,
    @InjectRepository(WatchShareEntity)
    private readonly spaceShares: Repository<WatchShareEntity>,
    @InjectRepository(WatchReviewLikeEntity)
    private readonly reviewLikes: Repository<WatchReviewLikeEntity>,
    @InjectRepository(CommentEntity)
    private readonly comments: Repository<CommentEntity>,
    private readonly access: DiaryAccessService,
    private readonly spaceAccess: SpaceAccessService,
    private readonly outbox: TransactionOutboxService,
    private readonly dataSource: DataSource,
    private readonly photos: WatchPhotosService,
    @Optional() private readonly notifications?: NotificationsService,
  ) {}

  /**
   * In-app notifications are a courtesy: they are written after the record is saved and a
   * failure is logged, never surfaced as a failed save.
   */
  private async notifySafely(work: () => Promise<unknown>) {
    if (!this.notifications) return;
    try {
      await work();
    } catch (error) {
      this.logger.warn(`notification skipped: ${String(error)}`);
    }
  }

  private notifyNewRecord(
    diaryId: string,
    authorId: string,
    spaceIds: string[],
    participantIds: string[],
  ) {
    return this.notifySafely(async () => {
      for (const recipientId of participantIds) {
        await this.notifications!.notifyWatchParticipationRequested({
          recipientId,
          actorId: authorId,
          diaryId,
        });
      }
      const members = await this.spaceAccess.activeMembersInSpaces(spaceIds);
      const others = new Set(
        members
          .map((membership) => membership.accountId)
          .filter((accountId) => accountId !== authorId && !participantIds.includes(accountId)),
      );
      for (const recipientId of others) {
        await this.notifications!.notifyWatchShared({ recipientId, actorId: authorId, diaryId });
      }
    });
  }

  /** Whose blind reviews are still hidden from `viewerId` on this record. */
  private async hiddenFrom(diaryId: string, viewerId: string) {
    const [diary, participants, reactions] = await Promise.all([
      this.diaries.findOne({ where: { id: diaryId } }),
      this.participants.find({ where: { diaryId } }),
      this.reactions.find({ where: { diaryId } }),
    ]);
    if (!diary) return new Set<string>();
    return hiddenReviewAccountIds({
      viewerId,
      reactions,
      participants: this.withAuthorParticipant(diary, participants),
    });
  }

  async create(accountId: string, dto: CreateWatchEventDto) {
    this.assertNotFuture(dto.watchedDate);
    let shared: { spaceIds: string[]; participantIds: string[] } = {
      spaceIds: [],
      participantIds: [],
    };
    const diaryId = await this.dataSource.transaction(async (manager) => {
      const media = await manager
        .getRepository(MediaEntity)
        .findOne({ where: { id: dto.mediaId } });
      if (!media) throw this.mediaNotFound();

      const spaceIds = [...new Set(dto.spaceIds ?? [])];
      const participantIds = [...new Set(dto.participantAccountIds ?? [])].filter(
        (id) => id !== accountId,
      );
      if (participantIds.length && !spaceIds.length) {
        throw new BadRequestException(
          response(
            400,
            'WATCH_PARTICIPANTS_REQUIRE_SPACE',
            '공간에 공유할 때만 참여자를 요청할 수 있어요.',
          ),
        );
      }
      await this.spaceAccess.assertAccountsInEverySpace(
        spaceIds,
        [accountId, ...participantIds],
        manager.getRepository(SpaceMembershipEntity),
      );

      const diaries = manager.getRepository(DiaryEntity);
      const diary = await diaries.save(
        diaries.create({
          userId: accountId,
          mediaId: media.id,
          title: media.title,
          content: dto.review?.trim() ?? '',
          watchedDate: dto.watchedDate,
          rating: dto.rating === null || dto.rating === undefined ? null : dto.rating.toFixed(1),
          visibility: 'PRIVATE',
          hasSpoiler: dto.hasSpoiler ?? false,
          viewingMethod: this.legacyViewingMethod(dto.source),
          sharedAt: null,
          clientRequestId: randomUUID(),
          clientRequestFingerprint: null,
          watchedPlace: dto.source?.placeText?.trim() || null,
          mood: null,
          memoryNote: dto.memoryNote?.trim() || null,
        }),
      );

      const now = new Date();
      const participants = manager.getRepository(WatchParticipantEntity);
      await participants.save(
        participants.create({
          diaryId: diary.id,
          accountId,
          status: 'CONFIRMED',
          requestedAt: now,
          respondedAt: now,
        }),
      );
      if (participantIds.length) {
        await participants.save(
          participantIds.map((participantAccountId) =>
            participants.create({
              diaryId: diary.id,
              accountId: participantAccountId,
              status: 'PENDING',
              requestedAt: now,
              respondedAt: null,
            }),
          ),
        );
        for (const participantAccountId of participantIds) {
          await this.outbox.enqueue(manager, {
            eventType: 'WatchParticipationRequested',
            aggregateType: 'WatchEvent',
            aggregateId: diary.id,
            idempotencyKey: `watch-participation-requested:${diary.id}:${participantAccountId}`,
            payload: {
              watchEventId: diary.id,
              requesterAccountId: accountId,
              participantAccountId,
            },
          });
          await this.outbox.enqueueNotification(manager, {
            recipientId: participantAccountId,
            actorId: accountId,
            notificationType: 'WATCH_PARTICIPATION_REQUESTED',
            subjectId: diary.id,
            idempotencyKey: `watch-participation-notification:${diary.id}:${participantAccountId}`,
          });
        }
      }

      if (spaceIds.length) {
        const shares = manager.getRepository(WatchShareEntity);
        await shares.save(
          spaceIds.map((spaceId) =>
            shares.create({
              diaryId: diary.id,
              spaceId,
              sharedAt: now,
              revokedAt: null,
            }),
          ),
        );
      }
      if (dto.source) {
        await this.saveSource(manager.getRepository(WatchSourceEntity), diary.id, dto.source);
      }
      if (hasReviewFields(dto)) {
        await this.saveReaction(
          manager.getRepository(WatchReactionEntity),
          diary.id,
          accountId,
          dto,
        );
      }
      if (dto.photoIds?.length) {
        await this.photos.replaceForDiary(manager, diary.id, accountId, dto.photoIds);
      }
      shared = { spaceIds, participantIds };
      return diary.id;
    });
    await this.notifyNewRecord(diaryId, accountId, shared.spaceIds, shared.participantIds);
    return this.detail(accountId, diaryId);
  }

  async detail(accountId: string, diaryId: string) {
    const diary = await this.loadDiary(diaryId);
    await this.access.assertCanView(diary, accountId);
    return this.toView(diary!, accountId);
  }

  async update(accountId: string, diaryId: string, dto: UpdateWatchEventDto) {
    if (dto.watchedDate) this.assertNotFuture(dto.watchedDate);
    await this.dataSource.transaction(async (manager) => {
      const diaries = manager.getRepository(DiaryEntity);
      const diary = await diaries.findOne({
        where: { id: diaryId, userId: accountId },
      });
      if (!diary) throw this.recordNotFound();

      if (dto.mediaId && dto.mediaId !== diary.mediaId) {
        const media = await manager
          .getRepository(MediaEntity)
          .findOne({ where: { id: dto.mediaId } });
        if (!media) throw this.mediaNotFound();
        diary.mediaId = media.id;
        diary.title = media.title;
      }
      if (dto.watchedDate !== undefined) diary.watchedDate = dto.watchedDate;
      if (dto.memoryNote !== undefined) diary.memoryNote = dto.memoryNote?.trim() || null;
      if (dto.photoIds !== undefined) {
        await this.photos.replaceForDiary(manager, diaryId, accountId, dto.photoIds);
      }

      if (dto.spaceIds !== undefined) {
        const spaceIds = [...new Set(dto.spaceIds)];
        const participants = await manager
          .getRepository(WatchParticipantEntity)
          .find({ where: { diaryId } });
        await this.spaceAccess.assertAccountsInEverySpace(
          spaceIds,
          participants.map((participant) => participant.accountId),
          manager.getRepository(SpaceMembershipEntity),
        );
        await this.replaceShares(manager.getRepository(WatchShareEntity), diaryId, spaceIds);
      }

      if (dto.source !== undefined) {
        const sources = manager.getRepository(WatchSourceEntity);
        if (dto.source === null) {
          await sources.delete({ diaryId });
          diary.viewingMethod = null;
          diary.watchedPlace = null;
        } else {
          await this.saveSource(sources, diaryId, dto.source);
          diary.viewingMethod = this.legacyViewingMethod(dto.source);
          diary.watchedPlace = dto.source.placeText?.trim() || null;
        }
      }

      if (hasReviewFields(dto)) {
        await this.saveReaction(
          manager.getRepository(WatchReactionEntity),
          diaryId,
          accountId,
          dto,
        );
        this.syncLegacyReview(diary, dto);
      }
      await diaries.save(diary);
    });
    return this.detail(accountId, diaryId);
  }

  async remove(accountId: string, diaryId: string) {
    const diary = await this.diaries.findOne({
      where: { id: diaryId, userId: accountId },
    });
    if (!diary) throw this.recordNotFound();
    await this.diaries.softDelete({ id: diaryId, userId: accountId });
    return { id: diaryId, deleted: true };
  }

  async respondToParticipation(
    diaryId: string,
    accountId: string,
    status: 'CONFIRMED' | 'DECLINED',
  ) {
    const diary = await this.diaries.findOne({ where: { id: diaryId } });
    await this.access.assertCanView(diary, accountId);
    const participant = await this.dataSource.transaction(async (manager) => {
      const participants = manager.getRepository(WatchParticipantEntity);
      const row = await participants.findOne({ where: { diaryId, accountId } });
      if (!row) throw this.participationNotFound();
      if (row.status === status) return row;
      if (row.status !== 'PENDING') {
        throw new ConflictException(
          response(409, 'WATCH_PARTICIPATION_FINALIZED', '이미 응답한 참여 요청이에요.'),
        );
      }
      row.status = status;
      row.respondedAt = new Date();
      const saved = await participants.save(row);
      await this.outbox.enqueue(manager, {
        eventType: 'WatchParticipationResponded',
        aggregateType: 'WatchEvent',
        aggregateId: diaryId,
        idempotencyKey: `watch-participation-responded:${diaryId}:${accountId}`,
        payload: {
          watchEventId: diaryId,
          participantAccountId: accountId,
          status,
          respondedAt: row.respondedAt.toISOString(),
        },
      });
      return saved;
    });
    return this.participantView(participant);
  }

  async upsertReaction(diaryId: string, accountId: string, dto: SaveWatchReactionDto) {
    if (!hasReviewFields(dto)) {
      throw new BadRequestException(
        response(400, 'WATCH_REACTION_EMPTY', '별점 또는 리뷰를 입력해 주세요.'),
      );
    }
    const diary = await this.diaries.findOne({ where: { id: diaryId } });
    await this.access.assertCanView(diary, accountId);
    const participant = await this.participants.findOne({
      where: { diaryId, accountId },
    });
    if (participant?.status !== 'CONFIRMED' && diary?.userId !== accountId) {
      throw this.participationNotFound();
    }

    const hiddenBefore = this.notifications ? await this.hiddenFrom(diaryId, accountId) : null;
    const reaction = await this.saveReaction(this.reactions, diaryId, accountId, dto);
    if (diary?.userId === accountId) {
      this.syncLegacyReview(diary, dto);
      await this.diaries.save(diary);
    }
    if (hiddenBefore?.size) {
      const hiddenAfter = await this.hiddenFrom(diaryId, accountId);
      await this.notifySafely(async () => {
        for (const recipientId of hiddenBefore) {
          if (hiddenAfter.has(recipientId)) continue;
          await this.notifications!.notifyReviewRevealed({
            recipientId,
            actorId: accountId,
            diaryId,
            idempotencyKey: `REVIEW_REVEALED:${recipientId}:${accountId}:${diaryId}`,
          });
        }
      });
    }
    return this.reactionView(reaction, accountId, false);
  }

  /**
   * 따봉 on someone else's review. The review must be visible to the liker: a blind review
   * that is still locked cannot be liked, and nobody can like their own.
   */
  async setReviewLike(diaryId: string, reactionId: string, accountId: string, liked: boolean) {
    const diary = await this.loadDiary(diaryId);
    await this.access.assertCanView(diary, accountId);
    const view = await this.toView(diary!, accountId);
    const reaction = view.reactions.find((item) => item.id === reactionId);
    if (!reaction) {
      throw new NotFoundException(response(404, 'REVIEW_NOT_FOUND', '리뷰를 찾을 수 없어요.'));
    }
    if (reaction.accountId === accountId) {
      throw new BadRequestException(
        response(400, 'OWN_REVIEW_LIKE', '내 리뷰에는 좋아요를 누를 수 없어요.'),
      );
    }
    if (reaction.locked) {
      throw new ConflictException(
        response(409, 'REVIEW_LOCKED', '잠긴 리뷰에는 좋아요를 누를 수 없어요.'),
      );
    }
    if (liked) {
      await this.reviewLikes
        .createQueryBuilder()
        .insert()
        .values({ reactionId, accountId })
        .orIgnore()
        .execute();
      await this.notifySafely(() =>
        this.notifications!.notifyReviewLiked({
          recipientId: reaction.accountId,
          actorId: accountId,
          diaryId,
          idempotencyKey: `REVIEW_LIKED:${reactionId}:${accountId}`,
        }),
      );
    } else {
      await this.reviewLikes.delete({ reactionId, accountId });
    }
    return {
      reactionId,
      liked,
      likeCount: await this.reviewLikes.count({ where: { reactionId } }),
    };
  }

  async timeline(spaceId: string, accountId: string, query: WatchTimelineQueryDto) {
    await this.access.assertActiveSpaceMember(spaceId, accountId);
    const limit = Math.min(50, Math.max(1, query.limit ?? 20));
    const base: FindOptionsWhere<WatchShareEntity> = {
      spaceId,
      revokedAt: IsNull(),
      diary: { deletedAt: IsNull() },
    };
    let where: FindOptionsWhere<WatchShareEntity>[] | FindOptionsWhere<WatchShareEntity> = base;
    if (query.cursor) {
      const cursor = this.decodeCursor(query.cursor);
      where = [
        { ...base, sharedAt: LessThan(new Date(cursor.sharedAt)) },
        {
          ...base,
          sharedAt: Equal(new Date(cursor.sharedAt)),
          id: LessThan(cursor.id),
        },
      ];
    }
    const rows = await this.spaceShares.find({
      where,
      relations: { diary: WATCH_VIEW_RELATIONS },
      order: { sharedAt: 'DESC', id: 'DESC' },
      take: limit + 1,
    });
    const hasMore = rows.length > limit;
    const page = rows.slice(0, limit);
    const items = await Promise.all(page.map((share) => this.toView(share.diary, accountId)));
    const last = page.at(-1);
    return {
      items,
      hasMore,
      nextCursor:
        hasMore && last
          ? Buffer.from(
              JSON.stringify({
                sharedAt: last.sharedAt.toISOString(),
                id: last.id,
              }),
            ).toString('base64url')
          : null,
    };
  }

  /** Where the viewer is up to in a series: their latest record of it, written or joined. */
  async progress(accountId: string, mediaId: string): Promise<WatchProgress | null> {
    const [own, joined] = await Promise.all([
      this.diaries.find({
        where: { userId: accountId, mediaId },
        relations: { watchSource: true },
      }),
      this.participants.find({
        where: { accountId, status: 'CONFIRMED', diary: { mediaId, deletedAt: IsNull() } },
        relations: { diary: { watchSource: true } },
      }),
    ]);
    const records = [
      ...new Map(
        [...own, ...joined.map((participant) => participant.diary)]
          .filter((diary): diary is DiaryEntity => Boolean(diary))
          .map((diary) => [diary.id, diary]),
      ).values(),
    ].sort(
      (left, right) =>
        right.watchedDate.localeCompare(left.watchedDate) ||
        (right.createdAt?.getTime() ?? 0) - (left.createdAt?.getTime() ?? 0),
    );
    const latest = records[0];
    if (!latest) return null;
    const source = latest.watchSource;
    return {
      mediaId,
      episodeWatched: source?.episodeWatched ?? null,
      episodeTotal: source?.episodeTotal ?? null,
      completed: source?.completed ?? false,
      providerName: source?.providerName ?? null,
      sourceKind: source?.kind ?? null,
      watchedDate: latest.watchedDate,
    };
  }

  async compareReactions(spaceId: string, mediaId: string, accountId: string) {
    await this.access.assertActiveSpaceMember(spaceId, accountId);
    const shares = await this.spaceShares.find({
      where: {
        spaceId,
        revokedAt: IsNull(),
        diary: { mediaId, deletedAt: IsNull() },
      },
      relations: { diary: true },
      order: { sharedAt: 'DESC', id: 'DESC' },
    });
    const diaries = shares.map((share) => share.diary);
    const diaryIds = diaries.map((diary) => diary.id);
    const activeMemberships = await this.spaceAccess.activeMembersInSpaces([spaceId]);
    const activeAccountIds = activeMemberships.map((membership) => membership.accountId);
    const participants = diaryIds.length
      ? await this.participants.find({ where: { diaryId: In(diaryIds) } })
      : [];
    const reactions =
      diaryIds.length && activeAccountIds.length
        ? await this.reactions.find({
            where: {
              diaryId: In(diaryIds),
              accountId: In(activeAccountIds),
            },
            relations: { account: true, likes: true },
          })
        : [];

    return {
      spaceId,
      mediaId,
      events: diaries.map((diary) => {
        const eventParticipants = participants.filter(
          (participant) => participant.diaryId === diary.id,
        );
        const confirmed = new Set(
          eventParticipants
            .filter((participant) => participant.status === 'CONFIRMED')
            .map((participant) => participant.accountId),
        );
        confirmed.add(diary.userId);
        const eventReactions = reactions.filter(
          (reaction) => reaction.diaryId === diary.id && confirmed.has(reaction.accountId),
        );
        if (
          activeAccountIds.includes(diary.userId) &&
          !eventReactions.some((reaction) => reaction.accountId === diary.userId) &&
          (diary.rating !== null || diary.content.trim())
        ) {
          eventReactions.push(this.legacyAuthorReaction(diary));
        }
        const hidden = hiddenReviewAccountIds({
          viewerId: accountId,
          reactions: eventReactions,
          participants: this.withAuthorParticipant(diary, eventParticipants),
        });
        return {
          watchEventId: diary.id,
          watchedDate: diary.watchedDate,
          reactions: eventReactions.map((reaction) =>
            this.reactionView(reaction, accountId, hidden.has(reaction.accountId)),
          ),
        };
      }),
    };
  }

  private async loadDiary(diaryId: string) {
    return this.diaries.findOne({
      where: { id: diaryId },
      relations: WATCH_VIEW_RELATIONS,
    });
  }

  private async toView(diary: DiaryEntity, viewerId: string) {
    const activeShares = (diary.spaceShares ?? []).filter((share) => !share.revokedAt);
    const sharedSpaceIds = activeShares.map((share) => share.spaceId);
    const memberships = await this.spaceAccess.activeMembersInSpaces(sharedSpaceIds);
    const viewerSpaceIds = new Set(
      memberships
        .filter((membership) => membership.accountId === viewerId)
        .map((membership) => membership.spaceId),
    );
    const visibleAccountIds = new Set<string>([viewerId]);
    for (const membership of memberships) {
      if (viewerSpaceIds.has(membership.spaceId)) {
        visibleAccountIds.add(membership.accountId);
      }
    }

    const participants = this.withAuthorParticipant(
      diary,
      (diary.watchParticipants ?? []).filter((participant) =>
        visibleAccountIds.has(participant.accountId),
      ),
    ).filter((participant) => visibleAccountIds.has(participant.accountId));

    const confirmedIds = new Set(
      participants
        .filter((participant) => participant.status === 'CONFIRMED')
        .map((participant) => participant.accountId),
    );
    const reactions = (diary.watchReactions ?? []).filter(
      (reaction) =>
        visibleAccountIds.has(reaction.accountId) && confirmedIds.has(reaction.accountId),
    );
    const authorVisible = diary.userId === viewerId || visibleAccountIds.has(diary.userId);
    if (
      visibleAccountIds.has(diary.userId) &&
      !reactions.some((reaction) => reaction.accountId === diary.userId) &&
      (diary.rating !== null || diary.content.trim())
    ) {
      reactions.unshift(this.legacyAuthorReaction(diary));
    }
    const hidden = hiddenReviewAccountIds({ viewerId, reactions, participants });
    const source = diary.watchSource;

    return {
      id: diary.id,
      media: {
        id: diary.media?.id ?? diary.mediaId,
        title: diary.media?.title ?? diary.title,
        mediaType: diary.media?.mediaType,
        posterUrl: diary.media?.posterUrl ?? null,
      },
      author: {
        accountId: diary.userId,
        nickname: diary.user?.nickname,
        profileImageUrl: diary.user?.profileImageUrl ?? null,
      },
      watchedDate: diary.watchedDate,
      visibility: sharedSpaceIds.length ? 'SPACES' : 'PRIVATE',
      spaceIds:
        diary.userId === viewerId
          ? sharedSpaceIds
          : sharedSpaceIds.filter((spaceId) => viewerSpaceIds.has(spaceId)),
      source:
        authorVisible && source
          ? {
              kind: source.kind,
              providerName: source.providerName,
              placeText: source.placeText,
              theaterFormat: source.theaterFormat ?? null,
              seatText: source.seatText ?? null,
              episodeWatched: source.episodeWatched ?? null,
              episodeTotal: source.episodeTotal ?? null,
              completed: source.completed ?? false,
            }
          : null,
      participants: participants.map((participant) => this.participantView(participant)),
      reactions: reactions.map((reaction) =>
        this.reactionView(reaction, viewerId, hidden.has(reaction.accountId)),
      ),
      memoryNote: authorVisible ? (diary.memoryNote ?? null) : null,
      photos: authorVisible
        ? (diary.watchPhotos ?? [])
            .filter((photo) => photo.diaryId === diary.id)
            .sort((left, right) => left.position - right.position)
            .map((photo) => this.photos.view(photo, viewerId))
        : [],
      commentCount: await this.comments.count({ where: { diaryId: diary.id } }),
      createdAt: diary.createdAt?.toISOString(),
      updatedAt: diary.updatedAt?.toISOString(),
      isMine: diary.userId === viewerId,
    };
  }

  // Records written before participants existed have no row for their author.
  private withAuthorParticipant(diary: DiaryEntity, participants: WatchParticipantEntity[]) {
    if (participants.some((participant) => participant.accountId === diary.userId)) {
      return participants;
    }
    return [
      Object.assign(new WatchParticipantEntity(), {
        diaryId: diary.id,
        accountId: diary.userId,
        status: 'CONFIRMED',
        requestedAt: diary.createdAt,
        respondedAt: diary.createdAt,
      }),
      ...participants,
    ];
  }

  // Older records keep the author's review only on the diary row.
  private legacyAuthorReaction(diary: DiaryEntity) {
    return Object.assign(new WatchReactionEntity(), {
      diaryId: diary.id,
      accountId: diary.userId,
      ratingScale: diary.rating === null ? null : Math.round(Number(diary.rating) * 2),
      reviewText: diary.content.trim() || null,
      headline: null,
      hasSpoiler: diary.hasSpoiler,
      isBlind: false,
      likes: [],
    });
  }

  private async replaceShares(
    shares: Repository<WatchShareEntity>,
    diaryId: string,
    spaceIds: string[],
  ) {
    const existing = await shares.find({ where: { diaryId } });
    const now = new Date();
    for (const share of existing) {
      share.revokedAt = spaceIds.includes(share.spaceId) ? null : now;
      if (!share.revokedAt) share.sharedAt = now;
    }
    if (existing.length) await shares.save(existing);
    const existingSpaceIds = new Set(existing.map((share) => share.spaceId));
    const additions = spaceIds
      .filter((spaceId) => !existingSpaceIds.has(spaceId))
      .map((spaceId) =>
        shares.create({
          diaryId,
          spaceId,
          sharedAt: now,
          revokedAt: null,
        }),
      );
    if (additions.length) await shares.save(additions);
  }

  private async saveSource(
    sources: Repository<WatchSourceEntity>,
    diaryId: string,
    dto: WatchSourceDto,
  ) {
    const theater = dto.kind === 'THEATER';
    const episodeWatched = theater ? null : (dto.episodeWatched ?? null);
    const episodeTotal = theater ? null : (dto.episodeTotal ?? null);
    if (episodeWatched !== null && episodeTotal !== null && episodeWatched > episodeTotal) {
      throw new BadRequestException(
        response(400, 'WATCH_EPISODE_RANGE', '본 회차가 전체 회차보다 클 수 없어요.'),
      );
    }
    const source = (await sources.findOne({ where: { diaryId } })) ?? sources.create({ diaryId });
    source.kind = dto.kind;
    source.providerName = dto.providerName?.trim() || null;
    source.placeText = dto.placeText?.trim() || null;
    source.theaterFormat = theater ? (dto.theaterFormat ?? null) : null;
    source.seatText = theater ? dto.seatText?.trim() || null : null;
    source.episodeWatched = episodeWatched;
    source.episodeTotal = episodeTotal;
    source.completed = theater ? false : Boolean(dto.completed);
    return sources.save(source);
  }

  private async saveReaction(
    reactions: Repository<WatchReactionEntity>,
    diaryId: string,
    accountId: string,
    dto: SaveWatchReactionDto,
  ) {
    const reaction =
      (await reactions.findOne({ where: { diaryId, accountId } })) ??
      reactions.create({
        diaryId,
        accountId,
        ratingScale: null,
        reviewText: null,
        headline: null,
        hasSpoiler: false,
        isBlind: false,
      });
    // DTO instances carry every declared field (as undefined when absent), so "was it sent"
    // must be checked by value, not with `in`.
    if (dto.rating !== undefined) reaction.ratingScale = ratingScale(dto.rating);
    if (dto.review !== undefined) reaction.reviewText = dto.review?.trim() || null;
    if (dto.headline !== undefined) reaction.headline = dto.headline?.trim() || null;
    if (dto.hasSpoiler !== undefined) reaction.hasSpoiler = dto.hasSpoiler;
    if (dto.isBlind !== undefined) reaction.isBlind = dto.isBlind;
    return reactions.save(reaction);
  }

  // The diary row keeps a copy of the author's review for the older `/diaries` screens.
  private syncLegacyReview(diary: DiaryEntity, dto: SaveWatchReactionDto) {
    if (dto.rating !== undefined) {
      diary.rating = dto.rating === null ? null : dto.rating.toFixed(1);
    }
    if (dto.review !== undefined) diary.content = dto.review?.trim() ?? '';
    if (dto.hasSpoiler !== undefined) diary.hasSpoiler = dto.hasSpoiler;
  }

  private participantView(participant: WatchParticipantEntity) {
    return {
      accountId: participant.accountId,
      status: participant.status,
      nickname: participant.account?.nickname,
      requestedAt: participant.requestedAt?.toISOString(),
      respondedAt: participant.respondedAt?.toISOString() ?? null,
    };
  }

  private reactionView(reaction: WatchReactionEntity, viewerId: string, locked: boolean) {
    const base = {
      id: reaction.id ?? null,
      accountId: reaction.accountId,
      nickname: reaction.account?.nickname,
      isBlind: Boolean(reaction.isBlind),
      locked,
    };
    // A locked review reveals nothing, not even when it was last edited or how it was received.
    if (locked) {
      return {
        ...base,
        rating: null,
        headline: null,
        review: null,
        hasSpoiler: false,
        likeCount: 0,
        likedByMe: false,
      };
    }
    const likes = reaction.likes ?? [];
    return {
      ...base,
      rating: reaction.ratingScale === null ? null : reaction.ratingScale / 2,
      headline: reaction.headline ?? null,
      review: reaction.reviewText,
      hasSpoiler: Boolean(reaction.hasSpoiler),
      likeCount: likes.length,
      likedByMe: likes.some((like) => like.accountId === viewerId),
      updatedAt: reaction.updatedAt?.toISOString(),
    };
  }

  private legacyViewingMethod(source?: WatchSourceDto) {
    if (source?.kind === 'THEATER') return 'THEATER' as const;
    if (source?.kind === 'OTT') return 'OTT' as const;
    return null;
  }

  private decodeCursor(raw: string) {
    try {
      const value = JSON.parse(Buffer.from(raw, 'base64url').toString('utf8')) as {
        sharedAt?: string;
        id?: string;
      };
      if (!value.sharedAt || !value.id || Number.isNaN(Date.parse(value.sharedAt)))
        throw new Error('invalid');
      return { sharedAt: value.sharedAt, id: value.id };
    } catch {
      throw new BadRequestException(
        response(400, 'INVALID_CURSOR', '목록 위치 정보가 올바르지 않아요.'),
      );
    }
  }

  private assertNotFuture(value: string) {
    if (value > new Date().toISOString().slice(0, 10)) {
      throw new BadRequestException(
        response(400, 'WATCH_DATE_IN_FUTURE', '미래 날짜의 감상 기록은 저장할 수 없어요.'),
      );
    }
  }

  private recordNotFound() {
    return new NotFoundException(response(404, 'RECORD_NOT_FOUND', '기록을 찾을 수 없어요.'));
  }

  private mediaNotFound() {
    return new BadRequestException(
      response(400, 'MEDIA_NOT_FOUND', '선택한 작품을 찾을 수 없어요.'),
    );
  }

  private participationNotFound() {
    return new NotFoundException(
      response(404, 'WATCH_PARTICIPATION_NOT_FOUND', '참여 요청을 찾을 수 없어요.'),
    );
  }
}
