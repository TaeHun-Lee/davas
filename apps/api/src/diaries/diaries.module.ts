import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import {
  CommentEntity,
  DiaryCompanionEntity,
  DiaryEntity,
  DiaryShareEntity,
  FriendshipEntity,
  MediaEntity,
  WatchlistItemEntity,
  WatchParticipantEntity,
  WatchPhotoEntity,
  WatchReactionEntity,
  WatchReviewLikeEntity,
  WatchShareEntity,
  WatchSourceEntity,
} from '../database/entities';
import { OutboxModule } from '../outbox/outbox.module';
import { SpacesModule } from '../spaces/spaces.module';
import { DiaryAccessService } from './diary-access.service';
import { DiariesDashboardService } from './diaries-dashboard.service';
import { DiariesController } from './diaries.controller';
import { DiariesService } from './diaries.service';
import { SpaceWatchController } from './space-watch.controller';
import { WatchEventsController } from './watch-events.controller';
import { WatchEventsService } from './watch-events.service';
import { WatchPhotosController } from './watch-photos.controller';
import { WatchPhotosService } from './watch-photos.service';

@Module({
  imports: [
    AuthModule,
    OutboxModule,
    SpacesModule,
    TypeOrmModule.forFeature([
      DiaryEntity,
      MediaEntity,
      DiaryCompanionEntity,
      DiaryShareEntity,
      FriendshipEntity,
      WatchlistItemEntity,
      WatchParticipantEntity,
      WatchReactionEntity,
      WatchSourceEntity,
      WatchShareEntity,
      WatchPhotoEntity,
      WatchReviewLikeEntity,
      CommentEntity,
    ]),
  ],
  controllers: [
    DiariesController,
    WatchEventsController,
    WatchPhotosController,
    SpaceWatchController,
  ],
  providers: [
    DiariesDashboardService,
    DiariesService,
    DiaryAccessService,
    WatchEventsService,
    WatchPhotosService,
  ],
  exports: [DiaryAccessService, WatchEventsService],
})
export class DiariesModule {}
