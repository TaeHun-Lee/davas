import { Body, Controller, Get, Param, Post, Req } from '@nestjs/common';
import type { AuthenticatedRequest } from '../auth/jwt-cookie-auth.guard';
import {
  CreateRecommendationSessionDto,
  RecommendationFeedbackDto,
} from './group-recommendations.dto';
import { GroupRecommendationsService } from './group-recommendations.service';

@Controller('v1')
export class GroupRecommendationsController {
  constructor(private readonly recommendations: GroupRecommendationsService) {}

  @Post('recommendation-sessions')
  async create(@Req() request: AuthenticatedRequest, @Body() body: CreateRecommendationSessionDto) {
    return this.recommendations.create(request.user.id, body);
  }

  @Get('recommendation-sessions/:sessionId')
  async get(@Req() request: AuthenticatedRequest, @Param('sessionId') sessionId: string) {
    return this.recommendations.get(sessionId, request.user.id);
  }

  @Post('recommendation-exposures/:exposureId/feedback')
  async feedback(
    @Req() request: AuthenticatedRequest,
    @Param('exposureId') exposureId: string,
    @Body() body: RecommendationFeedbackDto,
  ) {
    return this.recommendations.recordFeedback(exposureId, request.user.id, body);
  }
}
