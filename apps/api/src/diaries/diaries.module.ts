import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { DiaryEntity } from '../database/entities/diary.entity';
import { MediaEntity } from '../database/entities/media.entity';
import { DiariesDashboardService } from './diaries-dashboard.service';
import { DiariesController } from './diaries.controller';

@Module({
  imports: [AuthModule, TypeOrmModule.forFeature([DiaryEntity, MediaEntity])],
  controllers: [DiariesController],
  providers: [DiariesDashboardService],
})
export class DiariesModule {}
