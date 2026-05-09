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
  isFavorite: boolean;
};

export type MediaFavoriteResponse = {
  mediaId: string;
  isFavorite: boolean;
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

    const myDiary = await this.findMyDiary(id, userId);
    const isFavorite = await this.isFavorite(id, userId);

    if (media.externalProvider !== 'TMDB') {
      return { ...this.fromCachedMedia(media), myDiary, isFavorite };
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

  private async isFavorite(mediaId: string, userId?: string) {
    if (!userId || !this.favoriteRepository) {
      return false;
    }
    return Boolean(await this.favoriteRepository.findOne({ where: { userId, mediaId } }));
  }

  private async findMyDiary(mediaId: string, userId?: string): Promise<MyMediaDiary | null> {
    if (!userId || !this.diaryRepository) {
      return null;
    }

    const diary = await this.diaryRepository.findOne({
      where: { userId, mediaId },
      order: { updatedAt: 'DESC', createdAt: 'DESC' },
    });
    if (!diary) {
      return null;
    }

    return {
      id: diary.id,
      rating: Number(diary.rating),
      title: diary.title,
      contentPreview: buildContentPreview(diary.content),
      watchedDate: formatWatchedDate(diary.watchedDate),
      updatedAt: diary.updatedAt.toISOString(),
    };
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
      isFavorite: false,
    };
  }
}
