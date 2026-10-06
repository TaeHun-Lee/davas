import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import type { SpaceMemories } from '@davas/shared';
import { IsNull, Repository } from 'typeorm';
import { DiaryEntity, WatchShareEntity } from '../database/entities';
import { seoulToday } from '../common/seoul-date';
import { SpaceAccessService } from '../spaces/space-access.service';
import { WatchPhotosService } from './watch-photos.service';

const TOP_GENRES = 5;
const ON_THIS_DAY_LIMIT = 3;
const IN_PROGRESS_LIMIT = 5;

const newestFirst = (left: DiaryEntity, right: DiaryEntity) =>
  right.watchedDate.localeCompare(left.watchedDate) ||
  (right.createdAt?.getTime() ?? 0) - (left.createdAt?.getTime() ?? 0);

/**
 * "우리 기록 모아보기": what a space watched in a year, what it watched on this day in
 * earlier years, and which series it is part-way through. Only records shared to the space
 * count, so a personal record never shows up here.
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
    const shares = await this.shares.find({
      where: { spaceId, revokedAt: IsNull(), diary: { deletedAt: IsNull() } },
      relations: { diary: { media: true, watchSource: true, watchPhotos: true } },
    });
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
    const kindCount = (kind: string) =>
      inYear.filter((diary) => diary.watchSource?.kind === kind).length;
    const theater = kindCount('THEATER');
    const ott = kindCount('OTT');

    const attachedPhotos = (diary: DiaryEntity) =>
      (diary.watchPhotos ?? [])
        .filter((photo) => photo.diaryId === diary.id)
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
          sourceKind: diary.watchSource?.kind ?? null,
          photoCount: photos.length,
          coverPhoto: photos[0] ? this.photos.view(photos[0], viewerId) : null,
        };
      });

    const latestBySeries = new Map<string, DiaryEntity>();
    for (const diary of [...diaries].sort(newestFirst)) {
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
      sources: { theater, ott, other: inYear.length - theater - ott },
      onThisDay,
      inProgress,
    };
  }
}
