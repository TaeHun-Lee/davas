import { BadGatewayException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MediaEntity } from '../database/entities/media.entity';
import { MediaSelectionDto } from './dto/media-selection.dto';
import { TmdbClient } from './tmdb.client';

@Injectable()
export class MediaSelectionService {
  constructor(
    @InjectRepository(MediaEntity)
    private readonly mediaRepository: Repository<MediaEntity>,
    private readonly tmdbClient: TmdbClient,
  ) {}

  async select(selection: MediaSelectionDto) {
    const where = {
      externalProvider: selection.externalProvider,
      externalId: selection.externalId,
      mediaType: selection.mediaType,
    } as const;
    const existing = await this.mediaRepository.findOne({ where });

    const detail = await this.tmdbClient.detail({
      externalId: selection.externalId,
      mediaType: selection.mediaType,
      language: 'ko-KR',
    });
    if (
      detail.externalProvider !== selection.externalProvider ||
      detail.externalId !== selection.externalId ||
      detail.mediaType !== selection.mediaType ||
      !detail.title.trim()
    ) {
      throw new BadGatewayException('TMDB returned mismatched media identity.');
    }

    const canonical = {
      externalProvider: detail.externalProvider,
      externalId: detail.externalId,
      mediaType: detail.mediaType,
      title: detail.title,
      originalTitle: detail.originalTitle || null,
      overview: detail.overview || null,
      shortPlot: detail.overview || null,
      posterUrl: detail.posterUrl,
      backdropUrl: detail.backdropUrl,
      tagline: detail.tagline,
      releaseDate: detail.releaseDate,
      genres: detail.genres,
      country: detail.country,
      countries: detail.countries,
      runtime: detail.runtime,
      tmdbRating: detail.tmdbRating == null ? null : String(detail.tmdbRating),
      tmdbVoteCount: detail.tmdbVoteCount,
      director: detail.director,
      creators: detail.creators,
      cast: detail.cast,
      certification: detail.certification,
    };

    if (existing) {
      Object.assign(existing, canonical);
      return this.mediaRepository.save(existing);
    }

    const media = this.mediaRepository.create(canonical);

    try {
      return await this.mediaRepository.save(media);
    } catch (error) {
      if ((error as { code?: string }).code !== '23505') throw error;
      const raced = await this.mediaRepository.findOne({ where });
      if (raced) {
        Object.assign(raced, canonical);
        return this.mediaRepository.save(raced);
      }
      throw error;
    }
  }
}
