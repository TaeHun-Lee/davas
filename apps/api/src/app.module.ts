import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { CommentsModule } from './comments/comments.module';
import { CommunityModule } from './community/community.module';
import { createTypeOrmOptions } from './database/typeorm.config';
import { DiariesModule } from './diaries/diaries.module';
import { HealthController } from './health.controller';
import { MediaModule } from './media/media.module';
import { NotificationsModule } from './notifications/notifications.module';
import { RecommendationsModule } from './recommendations/recommendations.module';
import { SpacesModule } from './spaces/spaces.module';
import { UsersModule } from './users/users.module';
import { InvitesModule } from './invites/invites.module';
import { FriendsModule } from './friends/friends.module';
import { WatchlistModule } from './watchlist/watchlist.module';
import { ReactionsModule } from './reactions/reactions.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({ useFactory: createTypeOrmOptions }),
    AuthModule,
    InvitesModule,
    FriendsModule,
    WatchlistModule,
    ReactionsModule,
    UsersModule,
    MediaModule,
    RecommendationsModule,
    DiariesModule,
    CommentsModule,
    CommunityModule,
    NotificationsModule,
    SpacesModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}
