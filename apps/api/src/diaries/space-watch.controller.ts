import { Controller, Get, Param, Query, Req } from '@nestjs/common';
import type { AuthenticatedRequest } from '../auth/jwt-cookie-auth.guard';
import { WatchTimelineQueryDto } from './dto/watch-event.dto';
import { WatchEventsService } from './watch-events.service';

@Controller('v1/spaces')
export class SpaceWatchController {
  constructor(private readonly watchEvents: WatchEventsService) {}

  @Get(':spaceId/timeline')
  async timeline(
    @Req() request: AuthenticatedRequest,
    @Param('spaceId') spaceId: string,
    @Query() query: WatchTimelineQueryDto,
  ) {
    return this.watchEvents.timeline(spaceId, request.user.id, query);
  }

  @Get(':spaceId/titles/:mediaId/reactions')
  async compareReactions(
    @Req() request: AuthenticatedRequest,
    @Param('spaceId') spaceId: string,
    @Param('mediaId') mediaId: string,
  ) {
    return this.watchEvents.compareReactions(spaceId, mediaId, request.user.id);
  }
}
