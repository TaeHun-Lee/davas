import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import type { SpaceCalendar, SpaceMemories, SpaceRecap } from '@davas/shared';
import { IsNull, Repository } from 'typeorm';
import { DiaryEntity, WatchShareEntity } from '../database/entities';
import { seoulToday } from '../common/seoul-date';
import { SpaceAccessService } from '../spaces/space-access.service';
import { hiddenReviewAccountIds } from './blind-review';
import { WatchPhotosService } from './watch-photos.service';

const TOP_GENRES = 5;
const ON_THIS_DAY_LIMIT = 3;
const IN_PROGRESS_LIMIT = 5;
const TOP_RATED = 3;
const RECAP_COVERS = 4;

/** The most frequent non-empty value and how often it appears; ties go to the first seen. */
function mostFrequent(values: Array<string | null | undefined>) {
  const counts = new Map<string, number>();
  for (const value of values) {
    const name = value?.trim();
    if (name) counts.set(name, (counts.get(name) ?? 0) + 1);
  }
  let best: { name: string; count: number } | null = null;
  for (const [name, count] of counts) if (!best || count > best.count) best = { name, count };
  return best;
}

const newestFirst = (left: DiaryEntity, right: DiaryEntity) =>
  right.watchedDate.localeCompare(left.watchedDate) ||
  (right.createdAt?.getTime() ?? 0) - (left.createdAt?.getTime() ?? 0);

/**
 * "우리 기록 모아보기": what a space watched in a year, what it watched on this day in
 * earlier years, and which series it is part-way through. Only records shared to the space
 * count, so a personal record never shows up here. A record by someone who has left the space
 * still counts as a title watched, but their photos and where and how far they watched do not
 * show, matching the record view.
 */
@Injectable()
export class SpaceMemoriesService {
  constructor(
    @InjectRepository(WatchShareEntity)
    private readonly shares: Repository<WatchShareEntity>,
    private readonly spaceAccess: SpaceAccessService,
    private readonly photos: WatchPhotosService,
  ) {}

  async memories(
    spaceId: string,
    viewerId: string,
    requestedYear?: number,
    now = new Date(),
  ): Promise<SpaceMemories> {
    await this.spaceAccess.assertActiveMember(spaceId, viewerId);
    const [shares, memberships] = await Promise.all([
      this.shares.find({
        where: { spaceId, revokedAt: IsNull(), diary: { deletedAt: IsNull() } },
        relations: {
          diary: {
            media: true,
            watchSource: true,
            watchPhotos: true,
            watchReactions: true,
            watchParticipants: true,
          },
        },
      }),
      this.spaceAccess.activeMembersInSpaces([spaceId]),
    ]);
    const memberIds = new Set(memberships.map((membership) => membership.accountId));
    const authorStayed = (diary: DiaryEntity) => memberIds.has(diary.userId);
    const sourceOf = (diary: DiaryEntity) => (authorStayed(diary) ? diary.watchSource : null);
    const diaries = [
      ...new Map(
        shares.filter((share) => share.diary).map((share) => [share.diaryId, share.diary]),
      ).values(),
    ];
    const today = seoulToday(now);
    const currentYear = Number(today.slice(0, 4));
    const year = requestedYear ?? currentYear;
    const inYear = diaries.filter((diary) => diary.watchedDate.startsWith(`${year}-`));

    const genreCounts = new Map<string, number>();
    for (const diary of inYear) {
      for (const genre of new Set(diary.media?.genres ?? [])) {
        genreCounts.set(genre, (genreCounts.get(genre) ?? 0) + 1);
      }
    }
    // Where a record was watched is only known while its author is still in the space.
    const withSource = inYear.filter(authorStayed);
    const kindCount = (kind: string) =>
      withSource.filter((diary) => diary.watchSource?.kind === kind).length;
    const theater = kindCount('THEATER');
    const ott = kindCount('OTT');

    // Each photo follows its uploader, as on the record: someone who left takes theirs along.
    const attachedPhotos = (diary: DiaryEntity) =>
      (diary.watchPhotos ?? [])
        .filter((photo) => photo.diaryId === diary.id && memberIds.has(photo.uploaderId))
        .sort((left, right) => left.position - right.position);

    const onThisDay = diaries
      .filter(
        (diary) =>
          diary.watchedDate.slice(5) === today.slice(5) &&
          Number(diary.watchedDate.slice(0, 4)) < currentYear,
      )
      .sort(newestFirst)
      .slice(0, ON_THIS_DAY_LIMIT)
      .map((diary) => {
        const photos = attachedPhotos(diary);
        return {
          watchEventId: diary.id,
          title: diary.media?.title ?? diary.title,
          posterUrl: diary.media?.posterUrl ?? null,
          watchedDate: diary.watchedDate,
          yearsAgo: currentYear - Number(diary.watchedDate.slice(0, 4)),
          sourceKind: sourceOf(diary)?.kind ?? null,
          photoCount: photos.length,
          coverPhoto: photos[0] ? this.photos.view(photos[0], viewerId) : null,
        };
      });

    const latestBySeries = new Map<string, DiaryEntity>();
    for (const diary of diaries.filter(authorStayed).sort(newestFirst)) {
      if (diary.media?.mediaType !== 'TV' || latestBySeries.has(diary.mediaId)) continue;
      latestBySeries.set(diary.mediaId, diary);
    }
    const inProgress = [...latestBySeries.values()]
      .filter((diary) => {
        const source = diary.watchSource;
        if (!source?.episodeWatched || source.completed) return false;
        return !source.episodeTotal || source.episodeWatched < source.episodeTotal;
      })
      .slice(0, IN_PROGRESS_LIMIT)
      .map((diary) => ({
        watchEventId: diary.id,
        mediaId: diary.mediaId,
        title: diary.media?.title ?? diary.title,
        posterUrl: diary.media?.posterUrl ?? null,
        episodeWatched: diary.watchSource!.episodeWatched!,
        episodeTotal: diary.watchSource!.episodeTotal ?? null,
        providerName: diary.watchSource!.providerName ?? null,
        watchedDate: diary.watchedDate,
      }));

    return {
      year,
      totals: {
        records: inYear.length,
        movies: inYear.filter((diary) => diary.media?.mediaType === 'MOVIE').length,
        series: inYear.filter((diary) => diary.media?.mediaType === 'TV').length,
        photos: inYear.reduce((sum, diary) => sum + attachedPhotos(diary).length, 0),
      },
      genres: [...genreCounts.entries()]
        .sort((left, right) => right[1] - left[1] || left[0].localeCompare(right[0]))
        .slice(0, TOP_GENRES)
        .map(([name, count]) => ({ name, count })),
      sources: { theater, ott, other: withSource.length - theater - ott },
      onThisDay,
      inProgress,
      recap: this.recap(inYear, viewerId, memberIds, withSource, attachedPhotos),
    };
  }

  private recap(
    inYear: DiaryEntity[],
    viewerId: string,
    memberIds: Set<string>,
    withSource: DiaryEntity[],
    attachedPhotos: (diary: DiaryEntity) => DiaryEntity['watchPhotos'],
  ): SpaceRecap {
    const monthly = Array.from(
      { length: 12 },
      (_, index) =>
        inYear.filter((diary) => Number(diary.watchedDate.slice(5, 7)) === index + 1).length,
    );
    const busiest = monthly.reduce<{ month: number; count: number } | null>(
      (best, count, index) =>
        count && (!best || count > best.count) ? { month: index + 1, count } : best,
      null,
    );
    const chronological = [...inYear].sort((left, right) => -newestFirst(left, right));
    const brief = (diary: DiaryEntity | undefined) =>
      diary
        ? {
            watchEventId: diary.id,
            title: diary.media?.title ?? diary.title,
            watchedDate: diary.watchedDate,
          }
        : null;

    // Ratings by the people still in the space who were there, as the viewer may see them.
    const byTitle = new Map<
      string,
      { title: string; posterUrl: string | null; ratings: number[] }
    >();
    for (const diary of inYear) {
      const participants = [...(diary.watchParticipants ?? [])];
      if (!participants.some((participant) => participant.accountId === diary.userId)) {
        participants.push({ accountId: diary.userId, status: 'CONFIRMED' } as never);
      }
      const watched = new Set(
        participants
          .filter((participant) => participant.status === 'CONFIRMED')
          .map((participant) => participant.accountId),
      );
      const reactions = (diary.watchReactions ?? []).filter(
        (reaction) => memberIds.has(reaction.accountId) && watched.has(reaction.accountId),
      );
      const hidden = hiddenReviewAccountIds({ viewerId, reactions, participants });
      const ratings = reactions
        .filter((reaction) => reaction.ratingScale !== null && !hidden.has(reaction.accountId))
        .map((reaction) => reaction.ratingScale! / 2);
      if (!ratings.length) continue;
      const entry = byTitle.get(diary.mediaId) ?? {
        title: diary.media?.title ?? diary.title,
        posterUrl: diary.media?.posterUrl ?? null,
        ratings: [],
      };
      entry.ratings.push(...ratings);
      byTitle.set(diary.mediaId, entry);
    }
    const topRated = [...byTitle.entries()]
      .map(([mediaId, entry]) => ({
        mediaId,
        title: entry.title,
        posterUrl: entry.posterUrl,
        averageRating:
          Math.round(
            (entry.ratings.reduce((sum, value) => sum + value, 0) / entry.ratings.length) * 10,
          ) / 10,
        ratingCount: entry.ratings.length,
      }))
      .sort(
        (left, right) =>
          right.averageRating - left.averageRating ||
          right.ratingCount - left.ratingCount ||
          left.title.localeCompare(right.title),
      )
      .slice(0, TOP_RATED);

    return {
      monthly,
      busiestMonth: busiest,
      firstWatch: brief(chronological[0]),
      latestWatch: brief(chronological.at(-1)),
      topRated,
      favoritePlace: mostFrequent(withSource.map((diary) => diary.watchSource?.placeText)),
      favoriteService: mostFrequent(
        withSource
          .filter((diary) => diary.watchSource?.kind === 'OTT')
          .map((diary) => diary.watchSource?.providerName),
      ),
      coverPhotos: [...inYear]
        .sort(newestFirst)
        .flatMap((diary) => (attachedPhotos(diary) ?? []).slice(0, 1))
        .slice(0, RECAP_COVERS)
        .map((photo) => this.photos.view(photo, viewerId)),
    };
  }

  /**
   * A month of the space's shared records by the day they were watched. A space holds a few
   * hundred records at most, so they are read whole and grouped here.
   */
  async calendar(spaceId: string, viewerId: string, month: string): Promise<SpaceCalendar> {
    await this.spaceAccess.assertActiveMember(spaceId, viewerId);
    const [shares, memberships] = await Promise.all([
      this.shares.find({
        where: { spaceId, revokedAt: IsNull(), diary: { deletedAt: IsNull() } },
        relations: { diary: { media: true, watchSource: true, watchPhotos: true } },
      }),
      this.spaceAccess.activeMembersInSpaces([spaceId]),
    ]);
    const memberIds = new Set(memberships.map((membership) => membership.accountId));
    const diaries = [
      ...new Map(
        shares
          .filter((share) => share.diary?.watchedDate.startsWith(`${month}-`))
          .map((share) => [share.diaryId, share.diary]),
      ).values(),
    ].sort((left, right) => -newestFirst(left, right));
    const days = new Map<string, SpaceCalendar['days'][number]['records']>();
    for (const diary of diaries) {
      const cover = (diary.watchPhotos ?? [])
        .filter((photo) => photo.diaryId === diary.id && memberIds.has(photo.uploaderId))
        .sort((left, right) => left.position - right.position)[0];
      const records = days.get(diary.watchedDate) ?? [];
      records.push({
        watchEventId: diary.id,
        title: diary.media?.title ?? diary.title,
        posterUrl: diary.media?.posterUrl ?? null,
        mediaType: diary.media?.mediaType ?? null,
        // How it was watched is only known while its author is still in the space.
        sourceKind: memberIds.has(diary.userId) ? (diary.watchSource?.kind ?? null) : null,
        isMine: diary.userId === viewerId,
        coverPhoto: cover ? this.photos.view(cover, viewerId) : null,
      });
      days.set(diary.watchedDate, records);
    }
    return { month, days: [...days.entries()].map(([date, records]) => ({ date, records })) };
  }
}
