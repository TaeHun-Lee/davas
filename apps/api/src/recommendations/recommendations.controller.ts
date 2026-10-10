import { Controller, Get, Param, Query, Req } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import type { AuthenticatedRequest } from '../auth/jwt-cookie-auth.guard';
import { ROUTE_RATE_LIMITS } from '../common/request-limits';
import { RecommendationsService } from './recommendations.service';

@ApiTags('Recommendations')
@Throttle({ default: ROUTE_RATE_LIMITS.tmdbRead })
@Controller('recommendations')
export class RecommendationsController {
  constructor(private readonly recommendationsService: RecommendationsService) {}

  @Get('trending')
  trending(@Req() request: AuthenticatedRequest, @Query('limit') limit?: number) {
    return this.recommendationsService.trending(request.user.id, limit);
  }

  @Get('genres/:presetId')
  genreRecommendations(
    @Req() request: AuthenticatedRequest,
    @Param('presetId') presetId: string,
    @Query('limit') limit?: number,
  ) {
    return this.recommendationsService.genreRecommendations(request.user.id, presetId, limit);
  }
}
