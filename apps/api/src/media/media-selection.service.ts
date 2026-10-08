import { BadGatewayException, Injectable, Logger, Optional } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ExternalContentRefEntity } from '../database/entities/external-content-ref.entity';
import { MediaEntity } from '../database/entities/media.entity';
import { MediaSelectionDto } from './dto/media-selection.dto';
import { TmdbClient } from './tmdb.client';

@Injectable()
export class MediaSelectionService {
  private readonly logger = new Logger(MediaSelectionService.name);

  constructor(
    @InjectRepository(MediaEntity)
    private readonly mediaRepository: Repository<MediaEntity>,
    private readonly tmdbClient: TmdbClient,
    @Optional()
    @InjectRepository(ExternalContentRefEntity)
    private readonly externalRefRepository?: Repository<ExternalContentRefEntity>,
  ) {}

  // Client-supplied titles and image URLs are never trusted: the stored row always comes
  // from TMDB's own detail response for the selected identity.
  async select(selection: MediaSelectionDto) {
    const where = {
      externalProvider: selection.externalProvider,
      externalId: selection.externalId,
      mediaType: selection.mediaType,
    } as const;
    const existing = await this.mediaRepository.findOne({ where });

    let canonical: Partial<MediaEntity>;
    try {
      canonical = await this.fetchCanonical(selection);
    } catch (error) {
      // An already-stored row is still safe to reuse when TMDB is briefly unavailable.
      if (!existing || error instanceof BadGatewayException) throw error;
      this.logger.warn(`TMDB refresh skipped for media ${existing.id}: ${String(error)}`);
      await this.recordExternalRef(existing.id, selection);
      return existing;
    }

    if (existing) {
      Object.assign(existing, canonical);
      const refreshed = await this.mediaRepository.save(existing);
      await this.recordExternalRef(refreshed.id, selection);
      return refreshed;
    }

    let saved: MediaEntity;
    try {
      saved = await this.mediaRepository.save(this.mediaRepository.create(canonical));
    } catch (error) {
      if ((error as { code?: string }).code !== '23505') throw error;
      const raced = await this.mediaRepository.findOne({ where });
      if (!raced) throw error;
      Object.assign(raced, canonical);
      saved = await this.mediaRepository.save(raced);
    }
    await this.recordExternalRef(saved.id, selection);
    return saved;
  }

  private async fetchCanonical(selection: MediaSelectionDto): Promise<Partial<MediaEntity>> {
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

    return {
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
  }

  // One link per title and provider. Looking it up by the title (not the provider's number)
  // keeps a series from reusing the link of a movie that shares its TMDB id.
  private async recordExternalRef(contentId: string, selection: MediaSelectionDto) {
    if (!this.externalRefRepository) {
      return;
    }
    const existing = await this.externalRefRepository.findOne({
      where: { contentId, provider: selection.externalProvider },
    });
    if (existing) {
      existing.lastSyncedAt = new Date();
      await this.externalRefRepository.save(existing);
      return;
    }
    try {
      await this.externalRefRepository.save(
        this.externalRefRepository.create({
          contentId,
          provider: selection.externalProvider,
          mediaType: selection.mediaType,
          externalId: selection.externalId,
          source: selection.externalProvider,
          lastSyncedAt: new Date(),
        }),
      );
    } catch (error) {
      // Two people choosing the same title at once both try to add the link; one is enough.
      if ((error as { code?: string }).code !== '23505') throw error;
    }
  }
}
