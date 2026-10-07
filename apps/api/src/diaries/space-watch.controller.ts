import { Controller, Get, Param, ParseUUIDPipe, Query, Req } from '@nestjs/common';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, Matches, Max, Min } from 'class-validator';
import type { AuthenticatedRequest } from '../auth/jwt-cookie-auth.guard';
import { WatchTimelineQueryDto } from './dto/watch-event.dto';
import { SpaceMemoriesService } from './space-memories.service';
import { WatchEventsService } from './watch-events.service';

export class SpaceMemoriesQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1900)
  @Max(2100)
  year?: number;
}

export class SpaceCalendarQueryDto {
  /** `2026-10` */
  @Matches(/^\d{4}-(0[1-9]|1[0-2])$/)
  month!: string;
}

@Controller('v1/spaces')
export class SpaceWatchController {
  constructor(
    private readonly watchEvents: WatchEventsService,
    private readonly memories: SpaceMemoriesService,
  ) {}

  @Get(':spaceId/memories')
  async spaceMemories(
    @Req() request: AuthenticatedRequest,
    @Param('spaceId', ParseUUIDPipe) spaceId: string,
    @Query() query: SpaceMemoriesQueryDto,
  ) {
    return this.memories.memories(spaceId, request.user.id, query.year);
  }

  @Get(':spaceId/calendar')
  async spaceCalendar(
    @Req() request: AuthenticatedRequest,
    @Param('spaceId', ParseUUIDPipe) spaceId: string,
    @Query() query: SpaceCalendarQueryDto,
  ) {
    return this.memories.calendar(spaceId, request.user.id, query.month);
  }

  @Get(':spaceId/timeline')
  async timeline(
    @Req() request: AuthenticatedRequest,
    @Param('spaceId') spaceId: string,
    @Query() query: WatchTimelineQueryDto,
  ) {
    return this.watchEvents.timeline(spaceId, request.user.id, query);
  }

  @Get(':spaceId/pending-confirmations')
  async pendingConfirmations(
    @Req() request: AuthenticatedRequest,
    @Param('spaceId', ParseUUIDPipe) spaceId: string,
  ) {
    return this.watchEvents.pendingConfirmations(spaceId, request.user.id);
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
