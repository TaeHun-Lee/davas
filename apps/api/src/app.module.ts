import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { JwtCookieAuthGuard } from './auth/jwt-cookie-auth.guard';
import { CommentsModule } from './comments/comments.module';
import { OriginGuard } from './common/app-security';
import { DEFAULT_RATE_LIMIT } from './common/request-limits';
import { createTypeOrmOptions } from './database/typeorm.config';
import { DiariesModule } from './diaries/diaries.module';
import { FriendsModule } from './friends/friends.module';
import { HealthController } from './health.controller';
import { InvitesModule } from './invites/invites.module';
import { MediaModule } from './media/media.module';
import { NotificationsModule } from './notifications/notifications.module';
import { RecommendationsModule } from './recommendations/recommendations.module';
import { ShowtimesModule } from './showtimes/showtimes.module';
import { SpacesModule } from './spaces/spaces.module';
import { UsersModule } from './users/users.module';
import { WatchlistModule } from './watchlist/watchlist.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRoot([{ name: 'default', ...DEFAULT_RATE_LIMIT }]),
    TypeOrmModule.forRootAsync({ useFactory: createTypeOrmOptions }),
    AuthModule,
    InvitesModule,
    FriendsModule,
    WatchlistModule,
    UsersModule,
    MediaModule,
    RecommendationsModule,
    ShowtimesModule,
    DiariesModule,
    CommentsModule,
    NotificationsModule,
    SpacesModule,
  ],
  controllers: [HealthController],
  providers: [
    { provide: APP_GUARD, useClass: ThrottlerGuard },
    { provide: APP_GUARD, useClass: OriginGuard },
    { provide: APP_GUARD, useClass: JwtCookieAuthGuard },
  ],
})
export class AppModule {}
