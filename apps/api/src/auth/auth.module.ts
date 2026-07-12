import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FriendInviteEntity, FriendshipEntity, InviteCodeEntity, InviteUseEntity, UserConsentEntity, UserEntity } from '../database/entities';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, UserConsentEntity, FriendInviteEntity, FriendshipEntity, InviteCodeEntity, InviteUseEntity]),
    JwtModule.register({
      secret: process.env.JWT_ACCESS_SECRET ?? 'dev-only-secret',
      signOptions: { expiresIn: process.env.JWT_ACCESS_EXPIRES_IN ?? '7d' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
