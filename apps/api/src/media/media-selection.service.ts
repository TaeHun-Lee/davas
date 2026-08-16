import { Injectable, Optional } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MediaEntity } from '../database/entities/media.entity';
import { ExternalContentRefEntity } from '../database/entities/external-content-ref.entity';
import { MediaSelectionDto } from './dto/media-selection.dto';
import { resolveTmdbGenreLabels } from './tmdb-genres';

@Injectable()
export class MediaSelectionService {
  constructor(
    @InjectRepository(MediaEntity)
    private readonly mediaRepository: Repository<MediaEntity>,
    @Optional()
    @InjectRepository(ExternalContentRefEntity)
    private readonly externalRefRepository?: Repository<ExternalContentRefEntity>,
  ) {}

  async select(selection: MediaSelectionDto) {
    const existing = await this.mediaRepository.findOne({
      where: {
        externalProvider: selection.externalProvider,
        externalId: selection.externalId,
      },
    });

    if (existing) {
      await this.recordExternalRef(existing.id, selection);
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

    const saved = await this.mediaRepository.save(media);
    await this.recordExternalRef(saved.id, selection);
    return saved;
  }

  private async recordExternalRef(
    contentId: string,
    selection: MediaSelectionDto,
  ) {
    if (!this.externalRefRepository) {
      return;
    }
    const existing = await this.externalRefRepository.findOne({
      where: {
        provider: selection.externalProvider,
        externalId: selection.externalId,
      },
    });
    if (existing) {
      existing.lastSyncedAt = new Date();
      await this.externalRefRepository.save(existing);
      return;
    }
    await this.externalRefRepository.save(
      this.externalRefRepository.create({
        contentId,
        provider: selection.externalProvider,
        externalId: selection.externalId,
        source: selection.externalProvider,
        lastSyncedAt: new Date(),
      }),
    );
  }
}
