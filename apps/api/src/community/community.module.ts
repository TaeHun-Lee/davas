import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DiaryEntity } from '../database/entities/diary.entity';
import { UserEntity } from '../database/entities/user.entity';
import { AuthModule } from '../auth/auth.module';
import { CommunityController } from './community.controller';
import { CommunityService } from './community.service';
import { DiariesModule } from '../diaries/diaries.module';

@Module({
  imports: [AuthModule, DiariesModule, TypeOrmModule.forFeature([DiaryEntity, UserEntity])],
  controllers: [CommunityController],
  providers: [CommunityService],
})
export class CommunityModule {}
