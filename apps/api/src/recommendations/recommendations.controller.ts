import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { ROUTE_RATE_LIMITS } from '../common/request-limits';
import { RecommendationsService } from './recommendations.service';

@ApiTags('Recommendations')
@Throttle({ default: ROUTE_RATE_LIMITS.tmdbRead })
@Controller('recommendations')
export class RecommendationsController {
  constructor(private readonly recommendationsService: RecommendationsService) {}

  @Get('trending')
  trending(
    @Query()
    query: {
      period?: 'daily' | 'weekly';
      page?: number;
      limit?: number;
      language?: string;
    },
  ) {
    return this.recommendationsService.trending(query);
  }

  @Get('genres')
  genrePresets() {
    return this.recommendationsService.genrePresets();
  }

  @Get('genres/random')
  randomGenreRecommendations(
    @Query()
    query: {
      seed?: string;
      page?: number;
      limit?: number;
      language?: string;
      region?: string;
    },
  ) {
    return this.recommendationsService.randomGenreRecommendations(query);
  }

  @Get('genres/:presetId')
  genreRecommendations(
    @Param('presetId') presetId: string,
    @Query()
    query: {
      page?: number;
      limit?: number;
      language?: string;
      region?: string;
    },
  ) {
    return this.recommendationsService.genreRecommendations(presetId, query);
  }

  @Get('today/carousel')
  todayCarousel(
    @Query()
    query: {
      limit?: number;
      language?: string;
      region?: string;
    },
  ) {
    return this.recommendationsService.todayCarousel(query);
  }

  @Get('today')
  today(
    @Query()
    query: {
      limit?: number;
      language?: string;
      region?: string;
    },
  ) {
    return this.recommendationsService.today(query);
  }
}
