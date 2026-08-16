import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import {
  DiaryCompanionEntity,
  DiaryEntity,
  DiaryShareEntity,
  FriendshipEntity,
  MediaEntity,
  WatchlistItemEntity,
  WatchParticipantEntity,
  WatchReactionEntity,
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
    ]),
  ],
  controllers: [DiariesController, WatchEventsController, SpaceWatchController],
  providers: [
    DiariesDashboardService,
    DiariesService,
    DiaryAccessService,
    WatchEventsService,
  ],
  exports: [DiaryAccessService, WatchEventsService],
})
export class DiariesModule {}
