import { Controller, Delete, Get, Param, Post, Query, Req } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import type { Request } from 'express';
import { AuthService, type AuthenticatedUser } from '../auth/auth.service';
import { CommunityService, type CommunityTab } from './community.service';

const ACCESS_TOKEN_COOKIE = 'davas_access_token';

@ApiTags('Community')
@Controller('community')
export class CommunityController {
  constructor(
    private readonly communityService: CommunityService,
    private readonly auth: AuthService,
  ) {}

  @Get('dashboard')
  async dashboard(@Req() request: Request, @Query('tab') tab?: CommunityTab, @Query('q') q?: string, @Query('topic') topic?: string) {
    const viewer = await this.resolveOptionalUser(request);
    return this.communityService.getDashboard({ tab, q, topic, userId: viewer?.id });
  }

  @Get('diaries/:id')
  async diary(@Req() request: Request, @Param('id') id: string) {
    const viewer = await this.resolveOptionalUser(request);
    return this.communityService.getPublicDiary(id, viewer?.id);
  }

  @Post('diaries/:id/follow')
  async followDiaryAuthor(@Req() request: Request, @Param('id') id: string) {
    const viewer = await this.resolveRequiredUser(request);
    return this.communityService.followDiaryAuthor(id, viewer.id);
  }

  @Delete('diaries/:id/follow')
  async unfollowDiaryAuthor(@Req() request: Request, @Param('id') id: string) {
    const viewer = await this.resolveRequiredUser(request);
    return this.communityService.unfollowDiaryAuthor(id, viewer.id);
  }

  private async resolveOptionalUser(request: Request): Promise<AuthenticatedUser | undefined> {
    try {
      return await this.resolveRequiredUser(request);
    } catch {
      return undefined;
    }
  }

  private resolveRequiredUser(request: Request) {
    return this.auth.findMe(this.readCookie(request, ACCESS_TOKEN_COOKIE));
  }

  private readCookie(request: Request, name: string): string | undefined {
    const cookieHeader = request.headers.cookie;
    if (!cookieHeader) {
      return undefined;
    }

    return cookieHeader
      .split(';')
      .map((part) => part.trim())
      .map((part) => part.split('='))
      .find(([key]) => key === name)?.[1];
  }
}
