import { Controller, Get, Param, Query, Req } from '@nestjs/common';
import type { Request } from 'express';
import { AuthService } from '../auth/auth.service';
import { WatchTimelineQueryDto } from './dto/watch-event.dto';
import { WatchEventsService } from './watch-events.service';

@Controller('v1/spaces')
export class SpaceWatchController {
  constructor(
    private readonly watchEvents: WatchEventsService,
    private readonly auth: AuthService,
  ) {}

  @Get(':spaceId/timeline')
  async timeline(
    @Req() request: Request,
    @Param('spaceId') spaceId: string,
    @Query() query: WatchTimelineQueryDto,
  ) {
    return this.watchEvents.timeline(
      spaceId,
      (await this.user(request)).id,
      query,
    );
  }

  @Get(':spaceId/titles/:mediaId/reactions')
  async compareReactions(
    @Req() request: Request,
    @Param('spaceId') spaceId: string,
    @Param('mediaId') mediaId: string,
  ) {
    return this.watchEvents.compareReactions(
      spaceId,
      mediaId,
      (await this.user(request)).id,
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
