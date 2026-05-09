import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DiaryEntity } from '../database/entities/diary.entity';
import { DiaryLikeEntity } from '../database/entities/diary-like.entity';
import { UserEntity } from '../database/entities/user.entity';
import { UserFollowEntity } from '../database/entities/user-follow.entity';
import { AuthModule } from '../auth/auth.module';
import { CommunityController } from './community.controller';
import { CommunityService } from './community.service';

@Module({
  imports: [AuthModule, TypeOrmModule.forFeature([DiaryEntity, UserFollowEntity, DiaryLikeEntity, UserEntity])],
  controllers: [CommunityController],
  providers: [CommunityService],
})
export class CommunityModule {}
