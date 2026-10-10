import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  KobisMovieEntity,
  KobisShowtimeEntity,
  KobisSyncRunEntity,
  KobisTheaterEntity,
  MediaEntity,
} from '../database/entities';
import { TmdbClient } from '../media/tmdb.client';
import { KobisApiClient } from './kobis-api.client';
import { KobisMovieMatcher } from './kobis-movie-matcher';
import { ShowtimeSyncService } from './showtime-sync.service';
import { ShowtimesController } from './showtimes.controller';
import { ShowtimesService } from './showtimes.service';

/** Theater showtimes in Seoul and Gyeonggi, read from KOBIS once a day. */
@Module({
  imports: [
    TypeOrmModule.forFeature([
      KobisTheaterEntity,
      KobisShowtimeEntity,
      KobisMovieEntity,
      KobisSyncRunEntity,
      MediaEntity,
    ]),
  ],
  controllers: [ShowtimesController],
  providers: [ShowtimesService, ShowtimeSyncService, KobisApiClient, KobisMovieMatcher, TmdbClient],
  exports: [ShowtimesService],
})
export class ShowtimesModule {}
