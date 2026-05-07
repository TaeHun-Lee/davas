import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MediaEntity } from '../database/entities/media.entity';
import { MediaSearchQueryDto } from './dto/media-search-query.dto';
import { TmdbClient } from './tmdb.client';

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
};

@Injectable()
export class MediaService {
  constructor(
    private readonly tmdbClient: TmdbClient,
    @InjectRepository(MediaEntity)
    private readonly mediaRepository?: Repository<MediaEntity>,
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

  async findDetail(id: string): Promise<MediaDetailResponse> {
    const media = await this.mediaRepository?.findOne({ where: { id } });
    if (!media) {
      throw new NotFoundException('Media not found');
    }

    if (media.externalProvider !== 'TMDB') {
      return this.fromCachedMedia(media);
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
    };
  }
}
