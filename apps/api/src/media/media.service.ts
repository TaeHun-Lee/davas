import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DiaryEntity } from '../database/entities/diary.entity';
import { MediaFavoriteEntity } from '../database/entities/media-favorite.entity';
import { MediaEntity } from '../database/entities/media.entity';
import { MediaSearchQueryDto } from './dto/media-search-query.dto';
import { TmdbClient } from './tmdb.client';

export type MyMediaDiary = {
  id: string;
  rating: number;
  title: string;
  contentPreview: string;
  watchedDate: string;
  updatedAt: string;
};

export type MediaDetailResponse = {
  id: string;
  externalProvider: string;
  externalId: string;
  mediaType: string;
  title: string;
  originalTitle: string | null;
  overview: string | null;
  tagline: string | null;
  posterUrl: string | null;
  backdropUrl: string | null;
  releaseDate: string | null;
  runtime: number | null;
  genres: string[];
  country: string | null;
  countries: string[];
  tmdbRating: number | null;
  tmdbVoteCount: number | null;
  director: string | null;
  creators: string[];
  numberOfEpisodes: number | null;
  numberOfSeasons: number | null;
  cast: string[];
  stillCuts: string[];
  certification: string | null;
  myDiary: MyMediaDiary | null;
  myDiaries: MyMediaDiary[];
  myAverageRating: number | null;
  isFavorite: boolean;
};

export type MediaFavoriteResponse = {
  mediaId: string;
  isFavorite: boolean;
};

export type FavoriteMediaItem = {
  id: string;
  mediaType: string;
  title: string;
  originalTitle: string | null;
  posterUrl: string | null;
  backdropUrl: string | null;
  releaseDate: string | null;
  genres: string[];
  favoritedAt: string;
};

export type FavoriteMediaResponse = {
  items: FavoriteMediaItem[];
};

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
    @InjectRepository(MediaFavoriteEntity)
    private readonly favoriteRepository?: Repository<MediaFavoriteEntity>,
  ) {}

  async search(query: MediaSearchQueryDto) {
    const normalizedQuery = (query.query ?? query.q ?? '').trim();
    return this.tmdbClient.search({
      query: normalizedQuery,
      type: query.type ?? 'multi',
      page: query.page ?? 1,
      language: query.language ?? 'ko-KR',
      region: query.region ?? 'KR',
    });
  }

  async searchPeople(query: { q?: string; query?: string; page?: number; language?: string }) {
    const normalizedQuery = (query.query ?? query.q ?? '').trim();
    return this.tmdbClient.searchPeople({
      query: normalizedQuery,
      page: query.page ?? 1,
      language: query.language ?? 'ko-KR',
    });
  }

  async findPersonCredits(personId: string, language = 'ko-KR') {
    return this.tmdbClient.personCredits({ personId, language });
  }

  async findDetail(id: string, userId?: string): Promise<MediaDetailResponse> {
    const media = await this.mediaRepository?.findOne({ where: { id } });
    if (!media) {
      throw new NotFoundException('Media not found');
    }

    const myDiaries = await this.findMyDiaries(id, userId);
    const myDiary = myDiaries[0] ?? null;
    const myAverageRating = this.calculateAverageRating(myDiaries);
    const isFavorite = await this.isFavorite(id, userId);

    if (media.externalProvider !== 'TMDB') {
      return { ...this.fromCachedMedia(media), myDiary, myDiaries, myAverageRating, isFavorite };
    }

    const detail = await this.tmdbClient.detail({
      externalId: media.externalId,
      mediaType: media.mediaType,
      language: 'ko-KR',
    });

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
      isFavorite,
    };
  }

  async toggleFavorite(mediaId: string, userId: string): Promise<MediaFavoriteResponse> {
    const media = await this.mediaRepository?.findOne({ where: { id: mediaId } });
    if (!media) {
      throw new NotFoundException('Media not found');
    }
    if (!this.favoriteRepository) {
      return { mediaId, isFavorite: false };
    }

    const existing = await this.favoriteRepository.findOne({ where: { userId, mediaId } });
    if (existing) {
      await this.favoriteRepository.delete({ userId, mediaId });
      return { mediaId, isFavorite: false };
    }

    await this.favoriteRepository.save(this.favoriteRepository.create({ userId, mediaId }));
    return { mediaId, isFavorite: true };
  }

  async findFavorites(userId: string): Promise<FavoriteMediaResponse> {
    if (!this.favoriteRepository) {
      return { items: [] };
    }

    const favorites = await this.favoriteRepository.find({
      where: { userId },
      relations: { media: true },
      order: { createdAt: 'DESC' },
    });

    return {
      items: favorites
        .filter((favorite) => Boolean(favorite.media))
        .map((favorite) => ({
          id: favorite.media.id,
          mediaType: favorite.media.mediaType,
          title: favorite.media.title,
          originalTitle: favorite.media.originalTitle,
          posterUrl: favorite.media.posterUrl,
          backdropUrl: favorite.media.backdropUrl,
          releaseDate: favorite.media.releaseDate,
          genres: favorite.media.genres,
          favoritedAt: favorite.createdAt.toISOString(),
        })),
    };
  }

  private async isFavorite(mediaId: string, userId?: string) {
    if (!userId || !this.favoriteRepository) {
      return false;
    }
    return Boolean(await this.favoriteRepository.findOne({ where: { userId, mediaId } }));
  }

  private async findMyDiaries(mediaId: string, userId?: string): Promise<MyMediaDiary[]> {
    if (!userId || !this.diaryRepository) {
      return [];
    }

    const options = {
      where: { userId, mediaId },
      order: { updatedAt: 'DESC', createdAt: 'DESC' },
    } as const;
    const repository = this.diaryRepository as Repository<DiaryEntity> & { find?: Repository<DiaryEntity>['find'] };
    const diaries = repository.find ? await repository.find(options) : [];

    return diaries.map((diary) => ({
      id: diary.id,
      rating: Number(diary.rating),
      title: diary.title,
      contentPreview: buildContentPreview(diary.content),
      watchedDate: formatWatchedDate(diary.watchedDate),
      updatedAt: diary.updatedAt.toISOString(),
    }));
  }

  private calculateAverageRating(diaries: MyMediaDiary[]) {
    if (diaries.length === 0) {
      return null;
    }
    const total = diaries.reduce((sum, diary) => sum + diary.rating, 0);
    return Math.round((total / diaries.length) * 10) / 10;
  }

  private fromCachedMedia(media: MediaEntity): MediaDetailResponse {
    return {
      id: media.id,
      externalProvider: media.externalProvider,
      externalId: media.externalId,
      mediaType: media.mediaType,
      title: media.title,
      originalTitle: media.originalTitle,
      overview: media.overview,
      tagline: null,
      posterUrl: media.posterUrl,
      backdropUrl: media.backdropUrl,
      releaseDate: media.releaseDate,
      runtime: media.runtime,
      genres: media.genres,
      country: media.country,
      countries: media.country ? [media.country] : [],
      tmdbRating: null,
      tmdbVoteCount: null,
      director: null,
      creators: [],
      numberOfEpisodes: null,
      numberOfSeasons: null,
      cast: [],
      stillCuts: [],
      certification: null,
      myDiary: null,
      myDiaries: [],
      myAverageRating: null,
      isFavorite: false,
    };
  }
}
