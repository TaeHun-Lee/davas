import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { JwtCookieAuthGuard } from './auth/jwt-cookie-auth.guard';
import { OriginGuard } from './common/app-security';
import { createTypeOrmOptions } from './database/typeorm.config';
import { DiariesModule } from './diaries/diaries.module';
import { FriendsModule } from './friends/friends.module';
import { HealthController } from './health.controller';
import { InvitesModule } from './invites/invites.module';
import { MediaModule } from './media/media.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRoot([
      {
        name: 'default',
        ttl: 60_000,
        limit: 120,
        blockDuration: 60_000,
      },
    ]),
    TypeOrmModule.forRootAsync({ useFactory: createTypeOrmOptions }),
    AuthModule,
    InvitesModule,
    FriendsModule,
    UsersModule,
    MediaModule,
    DiariesModule,
  ],
  controllers: [HealthController],
  providers: [
    { provide: APP_GUARD, useClass: ThrottlerGuard },
    { provide: APP_GUARD, useClass: OriginGuard },
    { provide: APP_GUARD, useClass: JwtCookieAuthGuard },
  ],
})
export class AppModule {}
