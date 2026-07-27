import { Module } from '@nestjs/common';
import { TmdbClient } from '../media/tmdb.client';
import { RecommendationsController } from './recommendations.controller';
import { RecommendationsService } from './recommendations.service';

@Module({
  controllers: [RecommendationsController],
  providers: [RecommendationsService, TmdbClient],
})
export class RecommendationsModule {}
