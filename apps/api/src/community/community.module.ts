import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DiaryEntity } from '../database/entities/diary.entity';
import { UserFollowEntity } from '../database/entities/user-follow.entity';
import { AuthModule } from '../auth/auth.module';
import { CommunityController } from './community.controller';
import { CommunityService } from './community.service';

@Module({
  imports: [AuthModule, TypeOrmModule.forFeature([DiaryEntity, UserFollowEntity])],
  controllers: [CommunityController],
  providers: [CommunityService],
})
export class CommunityModule {}
