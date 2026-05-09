import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DiaryEntity } from '../database/entities/diary.entity';
import { CommunityController } from './community.controller';
import { CommunityService } from './community.service';

@Module({
  imports: [TypeOrmModule.forFeature([DiaryEntity])],
  controllers: [CommunityController],
  providers: [CommunityService],
})
export class CommunityModule {}
