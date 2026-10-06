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
  SpaceWishEntity,
  UserEntity,
  WatchParticipantEntity,
  WatchReactionEntity,
  WatchShareEntity,
} from '../database/entities';
import { MediaModule } from '../media/media.module';
import { TmdbClient } from '../media/tmdb.client';
import { SpacesModule } from '../spaces/spaces.module';
import { GroupRecommendationsController } from './group-recommendations.controller';
import { GroupRecommendationsService } from './group-recommendations.service';
import { RecommendationsController } from './recommendations.controller';
import { RecommendationsService } from './recommendations.service';
import { SpaceWishesController } from './space-wishes.controller';
import { SpaceWishesService } from './space-wishes.service';

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
      SpaceWishEntity,
      UserEntity,
      WatchShareEntity,
    ]),
  ],
  controllers: [RecommendationsController, GroupRecommendationsController, SpaceWishesController],
  providers: [RecommendationsService, GroupRecommendationsService, SpaceWishesService, TmdbClient],
})
export class RecommendationsModule {}
