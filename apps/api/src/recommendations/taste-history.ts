import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import {
  DiaryEntity,
  MediaEntity,
  RecommendationFeedbackEntity,
  SpaceWishEntity,
  WatchParticipantEntity,
  WatchReactionEntity,
} from '../database/entities';
import { tasteFeatures } from './group-recommendation.algorithm';
import type { TasteSignal } from './taste-profile';

export type TasteHistoryResult = {
  /** Each person's signals; they feed only that person's taste. */
  signals: Map<string, TasteSignal[]>;
  /** One entry per title, kind and day, however many people it came from. */
  shared: TasteSignal[];
  rejected: Set<string>;
  watched: Set<string>;
  /** The stored titles behind the signals, to match lists that name titles by TMDB id. */
  titles: Map<string, MediaEntity>;
};

/**
 * What people watched, rated, answered in picks and wished for, as taste signals. A pick reads
 * the wishes of its own space; anything else reads a person's wishes in every space.
 */
@Injectable()
export class TasteHistory {
  constructor(
    @InjectRepository(DiaryEntity)
    private readonly diaries: Repository<DiaryEntity>,
    @InjectRepository(WatchParticipantEntity)
    private readonly watchParticipants: Repository<WatchParticipantEntity>,
    @InjectRepository(WatchReactionEntity)
    private readonly watchReactions: Repository<WatchReactionEntity>,
    @InjectRepository(RecommendationFeedbackEntity)
    private readonly feedback: Repository<RecommendationFeedbackEntity>,
    @InjectRepository(SpaceWishEntity)
    private readonly wishes: Repository<SpaceWishEntity>,
  ) {}

  async read(ids: string[], options: { spaceId?: string } = {}): Promise<TasteHistoryResult> {
    const [reactions, diaries, participations, feedback, wishes] = await Promise.all([
      this.watchReactions.find({
        where: { accountId: In(ids) },
        relations: { diary: { media: true } },
      }),
      this.diaries.find({ where: { userId: In(ids) }, relations: { media: true } }),
      this.watchParticipants.find({
        where: { accountId: In(ids), status: 'CONFIRMED' },
        relations: { diary: { media: true } },
      }),
      this.feedback.find({
        where: {
          accountId: In(ids),
          kind: In(['INTERESTED', 'REJECTED', 'ALREADY_WATCHED']),
        },
        relations: { exposure: { content: true } },
      }),
      this.wishes.find({
        where: options.spaceId
          ? { spaceId: options.spaceId, accountId: In(ids) }
          : { accountId: In(ids) },
        relations: { media: true },
      }),
    ]);

    const signals = new Map<string, TasteSignal[]>(ids.map((accountId) => [accountId, []]));
    const titles = new Map<string, MediaEntity>();
    const add = (accountId: string, signal: TasteSignal, media: MediaEntity | null | undefined) => {
      signals.get(accountId)?.push(signal);
      if (media) titles.set(signal.contentId, media);
    };
    // A record's day, at noon so no time zone moves it; a record without one counts as today.
    const day = (date: string | null | undefined) =>
      date ? new Date(`${date}T12:00:00Z`) : new Date();
    // An author also has a confirmed participant row for their own record: one watch each.
    const watches = new Map<string, { accountId: string; diary: DiaryEntity }>();
    for (const diary of diaries)
      watches.set(`${diary.userId}:${diary.id}`, { accountId: diary.userId, diary });
    for (const participant of participations) {
      if (participant.diary) {
        watches.set(`${participant.accountId}:${participant.diaryId}`, {
          accountId: participant.accountId,
          diary: participant.diary,
        });
      }
    }
    for (const { accountId, diary } of watches.values()) {
      add(
        accountId,
        {
          contentId: diary.mediaId,
          features: tasteFeatures(diary.media?.genres ?? []),
          at: day(diary.watchedDate),
          kind: 'WATCHED',
        },
        diary.media,
      );
    }
    for (const reaction of reactions) {
      if (reaction.ratingScale === null || !reaction.diary) continue;
      add(
        reaction.accountId,
        {
          contentId: reaction.diary.mediaId,
          features: tasteFeatures(reaction.diary.media?.genres ?? []),
          at: day(reaction.diary.watchedDate),
          kind: 'RATED',
          rating: reaction.ratingScale,
        },
        reaction.diary.media,
      );
    }
    for (const item of feedback) {
      if (!item.exposure) continue;
      add(
        item.accountId,
        {
          contentId: item.exposure.contentId,
          features: tasteFeatures(item.exposure.content?.genres ?? []),
          at: item.updatedAt ?? item.createdAt ?? new Date(),
          kind:
            item.kind === 'ALREADY_WATCHED'
              ? 'WATCHED'
              : item.kind === 'INTERESTED'
                ? 'INTERESTED'
                : 'REJECTED',
        },
        item.exposure.content,
      );
    }
    for (const wish of wishes) {
      add(
        wish.accountId,
        {
          contentId: wish.mediaId,
          features: tasteFeatures(wish.media?.genres ?? []),
          at: wish.createdAt,
          kind: 'WISHED',
        },
        wish.media,
      );
    }

    const shared = new Map<string, TasteSignal>();
    for (const signal of [...signals.values()].flat()) {
      const key = `${signal.kind}:${signal.contentId}:${signal.at.toISOString().slice(0, 10)}`;
      if (!shared.has(key)) shared.set(key, signal);
    }
    const all = [...signals.values()].flat();
    return {
      signals,
      shared: [...shared.values()],
      rejected: new Set(
        all.filter((item) => item.kind === 'REJECTED').map((item) => item.contentId),
      ),
      watched: new Set(all.filter((item) => item.kind === 'WATCHED').map((item) => item.contentId)),
      titles,
    };
  }
}
