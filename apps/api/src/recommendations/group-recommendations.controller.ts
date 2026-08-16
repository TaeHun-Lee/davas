import { Body, Controller, Get, Param, Post, Req } from '@nestjs/common';
import type { Request } from 'express';
import { AuthService } from '../auth/auth.service';
import {
  CreateRecommendationSessionDto,
  RecommendationFeedbackDto,
} from './group-recommendations.dto';
import { GroupRecommendationsService } from './group-recommendations.service';

@Controller('v1')
export class GroupRecommendationsController {
  constructor(
    private readonly recommendations: GroupRecommendationsService,
    private readonly auth: AuthService,
  ) {}

  @Post('recommendation-sessions')
  async create(
    @Req() request: Request,
    @Body() body: CreateRecommendationSessionDto,
  ) {
    return this.recommendations.create((await this.user(request)).id, body);
  }

  @Get('recommendation-sessions/:sessionId')
  async get(
    @Req() request: Request,
    @Param('sessionId') sessionId: string,
  ) {
    return this.recommendations.get(sessionId, (await this.user(request)).id);
  }

  @Post('recommendation-exposures/:exposureId/feedback')
  async feedback(
    @Req() request: Request,
    @Param('exposureId') exposureId: string,
    @Body() body: RecommendationFeedbackDto,
  ) {
    return this.recommendations.recordFeedback(
      exposureId,
      (await this.user(request)).id,
      body,
    );
  }

  private user(request: Request) {
    return this.auth.findMe(this.token(request));
  }

  private token(request: Request) {
    return request.headers.cookie
      ?.split(';')
      .map((entry) => entry.trim())
      .find((entry) => entry.startsWith('davas_access_token='))
      ?.split('=')[1];
  }
}
