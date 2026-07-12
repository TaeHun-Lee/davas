import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { DiaryCompanionEntity, DiaryEntity, DiaryShareEntity, FriendshipEntity, MediaEntity, WatchlistItemEntity } from '../database/entities';
import { DiaryAccessService } from './diary-access.service';
import { DiariesDashboardService } from './diaries-dashboard.service';
import { DiariesController } from './diaries.controller';
import { DiariesService } from './diaries.service';

@Module({
  imports: [AuthModule, TypeOrmModule.forFeature([DiaryEntity, MediaEntity, DiaryCompanionEntity, DiaryShareEntity, FriendshipEntity, WatchlistItemEntity])],
  controllers: [DiariesController],
  providers: [DiariesDashboardService, DiariesService, DiaryAccessService],
  exports: [DiaryAccessService],
})
export class DiariesModule {}
