import { Controller, Get, Param, Query, Req } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import type { AuthenticatedRequest } from '../auth/jwt-cookie-auth.guard';
import { CommunityService, type CommunityTab } from './community.service';

@ApiTags('Community')
@Controller('community')
export class CommunityController {
  constructor(private readonly communityService: CommunityService) {}

  @Get('dashboard')
  dashboard(
    @Req() request: AuthenticatedRequest,
    @Query('tab') tab?: CommunityTab,
    @Query('q') query?: string,
    @Query('topic') topic?: string,
  ) {
    return this.communityService.getDashboard({
      tab,
      q: query,
      topic,
      userId: request.user.id,
    });
  }

  @Get('diaries/:id')
  diary(@Req() request: AuthenticatedRequest, @Param('id') id: string) {
    return this.communityService.getPublicDiary(id, request.user.id);
  }

  @Get('authors/:id')
  authorProfile(@Req() request: AuthenticatedRequest, @Param('id') id: string) {
    return this.communityService.getAuthorProfile(id, request.user.id);
  }
}
