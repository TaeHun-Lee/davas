import { Body, Controller, Get, Param, Post, Req } from '@nestjs/common';
import type { AuthenticatedRequest } from '../auth/jwt-cookie-auth.guard';
import {
  CreateRecommendationSessionDto,
  DecideRecommendationDto,
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

  @Get('spaces/:spaceId/recommendation-sessions')
  async list(@Req() request: AuthenticatedRequest, @Param('spaceId') spaceId: string) {
    return this.recommendations.listForSpace(spaceId, request.user.id);
  }

  @Get('spaces/:spaceId/recommendation-sessions/decided')
  async decided(@Req() request: AuthenticatedRequest, @Param('spaceId') spaceId: string) {
    return this.recommendations.decidedPick(spaceId, request.user.id);
  }

  @Get('recommendation-sessions/:sessionId')
  async get(@Req() request: AuthenticatedRequest, @Param('sessionId') sessionId: string) {
    return this.recommendations.get(sessionId, request.user.id);
  }

  @Post('recommendation-sessions/:sessionId/decision')
  async decide(
    @Req() request: AuthenticatedRequest,
    @Param('sessionId') sessionId: string,
    @Body() body: DecideRecommendationDto,
  ) {
    return this.recommendations.decide(sessionId, request.user.id, body.exposureId);
  }

  @Post('recommendation-sessions/:sessionId/close')
  async close(@Req() request: AuthenticatedRequest, @Param('sessionId') sessionId: string) {
    return this.recommendations.close(sessionId, request.user.id);
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
