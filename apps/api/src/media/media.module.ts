import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MediaEntity } from '../database/entities/media.entity';
import { MediaController } from './media.controller';
import { MediaSelectionService } from './media-selection.service';
import { MediaService } from './media.service';
import { TmdbClient } from './tmdb.client';

@Module({
  imports: [TypeOrmModule.forFeature([MediaEntity])],
  controllers: [MediaController],
  providers: [MediaService, MediaSelectionService, TmdbClient],
})
export class MediaModule {}
