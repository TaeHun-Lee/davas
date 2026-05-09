import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MediaEntity } from '../database/entities/media.entity';
import { MediaSelectionDto } from './dto/media-selection.dto';
import { resolveTmdbGenreLabels } from './tmdb-genres';

@Injectable()
export class MediaSelectionService {
  constructor(
    @InjectRepository(MediaEntity)
    private readonly mediaRepository: Repository<MediaEntity>,
  ) {}

  async select(selection: MediaSelectionDto) {
    const existing = await this.mediaRepository.findOne({
      where: {
        externalProvider: selection.externalProvider,
        externalId: selection.externalId,
      },
    });

    if (existing) {
      return existing;
    }

    const media = this.mediaRepository.create({
      externalProvider: selection.externalProvider,
      externalId: selection.externalId,
      mediaType: selection.mediaType,
      title: selection.title,
      originalTitle: selection.originalTitle ?? null,
      overview: selection.overview ?? null,
      shortPlot: selection.overview ?? null,
      posterUrl: selection.posterUrl ?? null,
      backdropUrl: selection.backdropUrl ?? null,
      releaseDate: selection.releaseDate ?? null,
      genres: resolveTmdbGenreLabels(selection.genreIds ?? []),
      country: selection.country ?? null,
      runtime: null,
    });

    return this.mediaRepository.save(media);
  }
}
