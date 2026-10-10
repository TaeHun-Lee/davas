import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { DiaryEntity } from '../database/entities/diary.entity';
import { AvailabilityObservationEntity } from '../database/entities/availability-observation.entity';
import { ExternalContentRefEntity } from '../database/entities/external-content-ref.entity';
import { MediaEntity } from '../database/entities/media.entity';
import { MediaController } from './media.controller';
import { TmdbAvailabilityAdapter } from './adapters/tmdb-availability.adapter';
import { AvailabilityService } from './availability.service';
import { MediaSelectionService } from './media-selection.service';
import { MediaService } from './media.service';
import { WatchlistItemEntity } from '../database/entities';
import { TmdbClient } from './tmdb.client';
import { AVAILABILITY_PROVIDER } from './ports/availability-provider.port';

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([
      MediaEntity,
      DiaryEntity,
      WatchlistItemEntity,
      ExternalContentRefEntity,
      AvailabilityObservationEntity,
    ]),
  ],
  controllers: [MediaController],
  providers: [
    MediaService,
    MediaSelectionService,
    AvailabilityService,
    TmdbClient,
    TmdbAvailabilityAdapter,
    { provide: AVAILABILITY_PROVIDER, useExisting: TmdbAvailabilityAdapter },
  ],
  exports: [AvailabilityService, MediaSelectionService],
})
export class MediaModule {}
