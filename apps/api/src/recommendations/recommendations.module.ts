import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import {
  AvailabilityObservationEntity,
  DiaryEntity,
  MediaEntity,
  RecommendationExposureEntity,
  RecommendationFeedbackEntity,
  RecommendationSessionEntity,
  WatchParticipantEntity,
  WatchReactionEntity,
} from '../database/entities';
import { MediaModule } from '../media/media.module';
import { TmdbClient } from '../media/tmdb.client';
import { SpacesModule } from '../spaces/spaces.module';
import { GroupRecommendationsController } from './group-recommendations.controller';
import { GroupRecommendationsService } from './group-recommendations.service';
import { RecommendationsController } from './recommendations.controller';
import { RecommendationsService } from './recommendations.service';

@Module({
  imports: [
    AuthModule,
    MediaModule,
    SpacesModule,
    TypeOrmModule.forFeature([
      RecommendationSessionEntity,
      RecommendationExposureEntity,
      RecommendationFeedbackEntity,
      MediaEntity,
      AvailabilityObservationEntity,
      DiaryEntity,
      WatchParticipantEntity,
      WatchReactionEntity,
    ]),
  ],
  controllers: [RecommendationsController, GroupRecommendationsController],
  providers: [
    RecommendationsService,
    GroupRecommendationsService,
    TmdbClient,
  ],
})
export class RecommendationsModule {}
