import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { DiaryEntity } from '../database/entities/diary.entity';
import { MediaFavoriteEntity } from '../database/entities/media-favorite.entity';
import { MediaEntity } from '../database/entities/media.entity';
import { MediaController } from './media.controller';
import { MediaSelectionService } from './media-selection.service';
import { MediaService } from './media.service';
import { TmdbClient } from './tmdb.client';

@Module({
  imports: [AuthModule, TypeOrmModule.forFeature([MediaEntity, DiaryEntity, MediaFavoriteEntity])],
  controllers: [MediaController],
  providers: [MediaService, MediaSelectionService, TmdbClient],
})
export class MediaModule {}
