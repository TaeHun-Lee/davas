import { randomUUID } from 'node:crypto';
import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
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
  DiaryEntity,
  MediaEntity,
  SpaceMembershipEntity,
  WatchParticipantEntity,
  WatchReactionEntity,
  WatchShareEntity,
  WatchSourceEntity,
} from '../database/entities';
import { TransactionOutboxService } from '../outbox/transaction-outbox.service';
import { SpaceAccessService } from '../spaces/space-access.service';
import { DiaryAccessService } from './diary-access.service';
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

@Injectable()
export class WatchEventsService {
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
    private readonly access: DiaryAccessService,
    private readonly spaceAccess: SpaceAccessService,
    private readonly outbox: TransactionOutboxService,
    private readonly dataSource: DataSource,
  ) {}

  async create(accountId: string, dto: CreateWatchEventDto) {
    this.assertNotFuture(dto.watchedDate);
    const diaryId = await this.dataSource.transaction(async (manager) => {
      const media = await manager
        .getRepository(MediaEntity)
        .findOne({ where: { id: dto.mediaId } });
      if (!media) throw this.mediaNotFound();

      const spaceIds = [...new Set(dto.spaceIds ?? [])];
      const participantIds = [
        ...new Set(dto.participantAccountIds ?? []),
      ].filter((id) => id !== accountId);
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
          rating:
            dto.rating === null || dto.rating === undefined
              ? null
              : dto.rating.toFixed(1),
          visibility: 'PRIVATE',
          hasSpoiler: false,
          viewingMethod: this.legacyViewingMethod(dto.source),
          sharedAt: null,
          clientRequestId: randomUUID(),
          clientRequestFingerprint: null,
          watchedPlace: dto.source?.placeText?.trim() || null,
          mood: null,
          memoryNote: null,
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
        await this.saveSource(
          manager.getRepository(WatchSourceEntity),
          diary.id,
          dto.source,
        );
      }
      if (dto.rating !== undefined || dto.review !== undefined) {
        await this.saveReaction(
          manager.getRepository(WatchReactionEntity),
          diary.id,
          accountId,
          { rating: dto.rating, review: dto.review },
        );
      }
      return diary.id;
    });
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
        await this.replaceShares(
          manager.getRepository(WatchShareEntity),
          diaryId,
          spaceIds,
        );
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

      if ('rating' in dto || 'review' in dto) {
        await this.saveReaction(
          manager.getRepository(WatchReactionEntity),
          diaryId,
          accountId,
          dto,
        );
        if ('rating' in dto) {
          diary.rating =
            dto.rating === null || dto.rating === undefined
              ? null
              : dto.rating.toFixed(1);
        }
        if ('review' in dto) diary.content = dto.review?.trim() ?? '';
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
          response(
            409,
            'WATCH_PARTICIPATION_FINALIZED',
            '이미 응답한 참여 요청이에요.',
          ),
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

  async upsertReaction(
    diaryId: string,
    accountId: string,
    dto: SaveWatchReactionDto,
  ) {
    if (!('rating' in dto) && !('review' in dto)) {
      throw new BadRequestException(
        response(
          400,
          'WATCH_REACTION_EMPTY',
          '별점 또는 리뷰를 입력해 주세요.',
        ),
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

    const reaction = await this.saveReaction(
      this.reactions,
      diaryId,
      accountId,
      dto,
    );
    if (diary?.userId === accountId) {
      if ('rating' in dto) {
        diary.rating =
          dto.rating === null || dto.rating === undefined
            ? null
            : dto.rating.toFixed(1);
      }
      if ('review' in dto) diary.content = dto.review?.trim() ?? '';
      await this.diaries.save(diary);
    }
    return this.reactionView(reaction);
  }

  async timeline(
    spaceId: string,
    accountId: string,
    query: WatchTimelineQueryDto,
  ) {
    await this.access.assertActiveSpaceMember(spaceId, accountId);
    const limit = Math.min(50, Math.max(1, query.limit ?? 20));
    const base: FindOptionsWhere<WatchShareEntity> = {
      spaceId,
      revokedAt: IsNull(),
      diary: { deletedAt: IsNull() },
    };
    let where:
      | FindOptionsWhere<WatchShareEntity>[]
      | FindOptionsWhere<WatchShareEntity> = base;
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
      relations: {
        diary: {
          media: true,
          user: true,
          watchParticipants: { account: true },
          watchReactions: { account: true },
          watchSource: true,
          spaceShares: true,
        },
      },
      order: { sharedAt: 'DESC', id: 'DESC' },
      take: limit + 1,
    });
    const hasMore = rows.length > limit;
    const page = rows.slice(0, limit);
    const items = await Promise.all(
      page.map((share) => this.toView(share.diary, accountId)),
    );
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
    const activeMemberships = await this.spaceAccess.activeMembersInSpaces([
      spaceId,
    ]);
    const activeAccountIds = activeMemberships.map(
      (membership) => membership.accountId,
    );
    const participants = diaryIds.length
      ? await this.participants.find({
          where: { diaryId: In(diaryIds), status: 'CONFIRMED' },
        })
      : [];
    const reactions =
      diaryIds.length && activeAccountIds.length
        ? await this.reactions.find({
            where: {
              diaryId: In(diaryIds),
              accountId: In(activeAccountIds),
            },
            relations: { account: true },
          })
        : [];

    return {
      spaceId,
      mediaId,
      events: diaries.map((diary) => {
        const confirmed = new Set(
          participants
            .filter((participant) => participant.diaryId === diary.id)
            .map((participant) => participant.accountId),
        );
        const eventReactions = reactions.filter(
          (reaction) =>
            reaction.diaryId === diary.id && confirmed.has(reaction.accountId),
        );
        if (
          activeAccountIds.includes(diary.userId) &&
          !eventReactions.some(
            (reaction) => reaction.accountId === diary.userId,
          ) &&
          (diary.rating !== null || diary.content.trim())
        ) {
          eventReactions.push(
            Object.assign(new WatchReactionEntity(), {
              diaryId: diary.id,
              accountId: diary.userId,
              ratingScale:
                diary.rating === null
                  ? null
                  : Math.round(Number(diary.rating) * 2),
              reviewText: diary.content.trim() || null,
            }),
          );
        }
        return {
          watchEventId: diary.id,
          watchedDate: diary.watchedDate,
          reactions: eventReactions.map((reaction) =>
            this.reactionView(reaction),
          ),
        };
      }),
    };
  }

  private async loadDiary(diaryId: string) {
    return this.diaries.findOne({
      where: { id: diaryId },
      relations: {
        media: true,
        user: true,
        watchParticipants: { account: true },
        watchReactions: { account: true },
        watchSource: true,
        spaceShares: true,
      },
    });
  }

  private async toView(diary: DiaryEntity, viewerId: string) {
    const activeShares = (diary.spaceShares ?? []).filter(
      (share) => !share.revokedAt,
    );
    const sharedSpaceIds = activeShares.map((share) => share.spaceId);
    const memberships = await this.spaceAccess.activeMembersInSpaces(
      sharedSpaceIds,
    );
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

    const participants = (diary.watchParticipants ?? []).filter((participant) =>
      visibleAccountIds.has(participant.accountId),
    );
    if (
      visibleAccountIds.has(diary.userId) &&
      !participants.some(
        (participant) => participant.accountId === diary.userId,
      )
    ) {
      participants.unshift(
        Object.assign(new WatchParticipantEntity(), {
          diaryId: diary.id,
          accountId: diary.userId,
          status: 'CONFIRMED',
          requestedAt: diary.createdAt,
          respondedAt: diary.createdAt,
        }),
      );
    }

    const confirmedIds = new Set(
      participants
        .filter((participant) => participant.status === 'CONFIRMED')
        .map((participant) => participant.accountId),
    );
    const reactions = (diary.watchReactions ?? []).filter(
      (reaction) =>
        visibleAccountIds.has(reaction.accountId) &&
        confirmedIds.has(reaction.accountId),
    );
    const authorVisible =
      diary.userId === viewerId || visibleAccountIds.has(diary.userId);
    if (
      visibleAccountIds.has(diary.userId) &&
      !reactions.some((reaction) => reaction.accountId === diary.userId) &&
      (diary.rating !== null || diary.content.trim())
    ) {
      reactions.unshift(
        Object.assign(new WatchReactionEntity(), {
          diaryId: diary.id,
          accountId: diary.userId,
          ratingScale:
            diary.rating === null ? null : Math.round(Number(diary.rating) * 2),
          reviewText: diary.content.trim() || null,
        }),
      );
    }

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
        authorVisible && diary.watchSource
          ? {
              kind: diary.watchSource.kind,
              providerName: diary.watchSource.providerName,
              placeText: diary.watchSource.placeText,
            }
          : null,
      participants: participants.map((participant) =>
        this.participantView(participant),
      ),
      reactions: reactions.map((reaction) => this.reactionView(reaction)),
      createdAt: diary.createdAt?.toISOString(),
      updatedAt: diary.updatedAt?.toISOString(),
      isMine: diary.userId === viewerId,
    };
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
    const source =
      (await sources.findOne({ where: { diaryId } })) ??
      sources.create({ diaryId });
    source.kind = dto.kind;
    source.providerName = dto.providerName?.trim() || null;
    source.placeText = dto.placeText?.trim() || null;
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
      });
    if ('rating' in dto) reaction.ratingScale = ratingScale(dto.rating);
    if ('review' in dto) reaction.reviewText = dto.review?.trim() || null;
    return reactions.save(reaction);
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

  private reactionView(reaction: WatchReactionEntity) {
    return {
      accountId: reaction.accountId,
      nickname: reaction.account?.nickname,
      rating: reaction.ratingScale === null ? null : reaction.ratingScale / 2,
      review: reaction.reviewText,
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
      const value = JSON.parse(
        Buffer.from(raw, 'base64url').toString('utf8'),
      ) as { sharedAt?: string; id?: string };
      if (
        !value.sharedAt ||
        !value.id ||
        Number.isNaN(Date.parse(value.sharedAt))
      )
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
        response(
          400,
          'WATCH_DATE_IN_FUTURE',
          '미래 날짜의 감상 기록은 저장할 수 없어요.',
        ),
      );
    }
  }

  private recordNotFound() {
    return new NotFoundException(
      response(404, 'RECORD_NOT_FOUND', '기록을 찾을 수 없어요.'),
    );
  }

  private mediaNotFound() {
    return new BadRequestException(
      response(400, 'MEDIA_NOT_FOUND', '선택한 작품을 찾을 수 없어요.'),
    );
  }

  private participationNotFound() {
    return new NotFoundException(
      response(
        404,
        'WATCH_PARTICIPATION_NOT_FOUND',
        '참여 요청을 찾을 수 없어요.',
      ),
    );
  }
}
