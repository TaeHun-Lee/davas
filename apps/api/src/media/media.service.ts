import type { MediaDetail, MyMediaDiary } from '@davas/shared';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DiaryEntity } from '../database/entities/diary.entity';
import { MediaEntity } from '../database/entities/media.entity';
import { WatchlistItemEntity } from '../database/entities';
import { MediaSearchQueryDto } from './dto/media-search-query.dto';
import { TmdbClient } from './tmdb.client';
import type { TmdbMediaDetail } from './tmdb-detail.mapper';
import { resolveTmdbGenreLabels } from './tmdb-genres';

function formatWatchedDate(dateString: string) {
  return dateString.split('-').join('.');
}

function buildContentPreview(content: string) {
  return content.trim().slice(0, 120);
}

@Injectable()
export class MediaService {
  constructor(
    private readonly tmdbClient: TmdbClient,
    @InjectRepository(MediaEntity)
    private readonly mediaRepository?: Repository<MediaEntity>,
    @InjectRepository(DiaryEntity)
    private readonly diaryRepository?: Repository<DiaryEntity>,
    @InjectRepository(WatchlistItemEntity)
    private readonly watchlistRepository?: Repository<WatchlistItemEntity>,
  ) {}

  async search(query: MediaSearchQueryDto) {
    const normalizedQuery = (query.query ?? query.q ?? '').trim();
    const input = {
      query: normalizedQuery,
      type: query.type ?? 'multi',
      page: query.page ?? 1,
      language: query.language ?? 'ko-KR',
      region: query.region ?? 'KR',
    } as const;
    return this.tmdbClient.search(input);
  }

  async findDetail(id: string, userId?: string): Promise<MediaDetail> {
    const media = await this.mediaRepository?.findOne({ where: { id } });
    if (!media) {
      throw new NotFoundException('Media not found');
    }

    const myDiaries = await this.findMyDiaries(id, userId);
    const myDiary = myDiaries[0] ?? null;
    const myAverageRating = this.calculateAverageRating(myDiaries);
    const watchlist = userId
      ? await this.watchlistRepository?.findOne({
          where: { userId, mediaId: id },
        })
      : null;

    if (media.externalProvider !== 'TMDB') {
      return {
        ...this.fromCachedMedia(media),
        myDiary,
        myDiaries,
        myAverageRating,
        watchlistItemId: watchlist?.id ?? null,
        watchlistStatus: watchlist?.status ?? null,
      };
    }

    let detail: TmdbMediaDetail;
    try {
      detail = await this.tmdbClient.detail({
        externalId: media.externalId,
        mediaType: media.mediaType,
        language: 'ko-KR',
      });
    } catch {
      return {
        ...this.fromCachedMedia(media),
        myDiary,
        myDiaries,
        myAverageRating,
        watchlistItemId: watchlist?.id ?? null,
        watchlistStatus: watchlist?.status ?? null,
      };
    }

    return {
      id: media.id,
      externalProvider: media.externalProvider,
      externalId: media.externalId,
      mediaType: media.mediaType,
      title: detail.title || media.title,
      originalTitle: detail.originalTitle || media.originalTitle,
      overview: detail.overview || media.overview,
      tagline: detail.tagline,
      posterUrl: detail.posterUrl || media.posterUrl,
      backdropUrl: detail.backdropUrl || media.backdropUrl,
      releaseDate: detail.releaseDate || media.releaseDate,
      runtime: detail.runtime ?? media.runtime,
      genres: detail.genres.length > 0 ? detail.genres : media.genres,
      country: detail.country ?? media.country,
      countries: detail.countries,
      tmdbRating: detail.tmdbRating,
      tmdbVoteCount: detail.tmdbVoteCount,
      director: detail.director,
      creators: detail.creators,
      numberOfEpisodes: detail.numberOfEpisodes,
      numberOfSeasons: detail.numberOfSeasons,
      cast: detail.cast,
      stillCuts: detail.stillCuts,
      certification: detail.certification,
      myDiary,
      myDiaries,
      myAverageRating,
      watchlistItemId: watchlist?.id ?? null,
      watchlistStatus: watchlist?.status ?? null,
    };
  }

  private async findMyDiaries(mediaId: string, userId?: string): Promise<MyMediaDiary[]> {
    if (!userId || !this.diaryRepository) {
      return [];
    }

    const options = {
      where: { userId, mediaId },
      order: { updatedAt: 'DESC', createdAt: 'DESC' },
    } as const;
    const repository = this.diaryRepository as Repository<DiaryEntity> & {
      find?: Repository<DiaryEntity>['find'];
    };
    const diaries = repository.find ? await repository.find(options) : [];

    return diaries.map((diary) => ({
      id: diary.id,
      rating: diary.rating === null ? null : Number(diary.rating),
      title: diary.title,
      contentPreview: buildContentPreview(diary.content),
      watchedDate: formatWatchedDate(diary.watchedDate),
      updatedAt: diary.updatedAt.toISOString(),
    }));
  }

  private calculateAverageRating(diaries: MyMediaDiary[]) {
    const ratings = diaries.flatMap((diary) => (diary.rating === null ? [] : [diary.rating]));
    if (ratings.length === 0) {
      return null;
    }
    const total = ratings.reduce((sum, rating) => sum + rating, 0);
    return Math.round((total / ratings.length) * 10) / 10;
  }

  private fromCachedMedia(media: MediaEntity): MediaDetail {
    return {
      id: media.id,
      externalProvider: media.externalProvider,
      externalId: media.externalId,
      mediaType: media.mediaType,
      title: media.title,
      originalTitle: media.originalTitle,
      overview: media.overview,
      tagline: media.tagline,
      posterUrl: media.posterUrl,
      backdropUrl: media.backdropUrl,
      releaseDate: media.releaseDate,
      runtime: media.runtime,
      genres: media.genres,
      country: media.country,
      countries: media.countries?.length ? media.countries : media.country ? [media.country] : [],
      tmdbRating: media.tmdbRating ? Number(media.tmdbRating) : null,
      tmdbVoteCount: media.tmdbVoteCount,
      director: media.director,
      creators: media.creators ?? [],
      numberOfEpisodes: null,
      numberOfSeasons: null,
      cast: media.cast ?? [],
      stillCuts: [],
      certification: media.certification,
      myDiary: null,
      myDiaries: [],
      myAverageRating: null,
      watchlistItemId: null,
      watchlistStatus: null,
    };
  }
}
