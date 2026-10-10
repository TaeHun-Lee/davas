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
import { NotificationsModule } from '../notifications/notifications.module';
import { TmdbClient } from '../media/tmdb.client';
import { ShowtimesModule } from '../showtimes/showtimes.module';
import { SpacesModule } from '../spaces/spaces.module';
import { GroupRecommendationsController } from './group-recommendations.controller';
import { GroupRecommendationPool } from './group-recommendation-pool';
import { GroupRecommendationsService } from './group-recommendations.service';
import { RecommendationsController } from './recommendations.controller';
import { RecommendationsService } from './recommendations.service';
import { SpaceWishesController } from './space-wishes.controller';
import { SpaceWishesService } from './space-wishes.service';
import { TasteHistory } from './taste-history';

@Module({
  imports: [
    AuthModule,
    MediaModule,
    NotificationsModule,
    ShowtimesModule,
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
  providers: [
    RecommendationsService,
    GroupRecommendationsService,
    GroupRecommendationPool,
    SpaceWishesService,
    TasteHistory,
    TmdbClient,
  ],
})
export class RecommendationsModule {}
