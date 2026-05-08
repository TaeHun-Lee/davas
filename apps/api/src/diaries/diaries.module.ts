import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DiaryEntity } from '../database/entities/diary.entity';
import { DiariesDashboardService } from './diaries-dashboard.service';
import { DiariesController } from './diaries.controller';

@Module({
  imports: [TypeOrmModule.forFeature([DiaryEntity])],
  controllers: [DiariesController],
  providers: [DiariesDashboardService],
})
export class DiariesModule {}
