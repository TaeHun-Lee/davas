import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  FriendInviteEntity,
  FriendshipEntity,
  InviteCodeEntity,
  InviteUseEntity,
  UserConsentEntity,
  UserEntity,
} from '../database/entities';
import { AuthController } from './auth.controller';
import { parseJwtExpirySeconds } from './jwt-config';
import { JwtCookieAuthGuard } from './jwt-cookie-auth.guard';
import { OptionalJwtCookieAuthGuard } from './optional-jwt-cookie-auth.guard';
import { AuthService } from './auth.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserEntity,
      UserConsentEntity,
      FriendInviteEntity,
      FriendshipEntity,
      InviteCodeEntity,
      InviteUseEntity,
    ]),
    JwtModule.register({
      secret: process.env.JWT_ACCESS_SECRET ?? 'dev-secret-change-me',
      signOptions: {
        expiresIn: parseJwtExpirySeconds(process.env.JWT_ACCESS_EXPIRES_IN),
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtCookieAuthGuard, OptionalJwtCookieAuthGuard],
  exports: [AuthService, JwtCookieAuthGuard, OptionalJwtCookieAuthGuard],
})
export class AuthModule {}
