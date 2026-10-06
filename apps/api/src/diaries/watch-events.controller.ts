import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Req } from '@nestjs/common';
import type { AuthenticatedRequest } from '../auth/jwt-cookie-auth.guard';
import {
  CreateWatchEventDto,
  SaveWatchReactionDto,
  UpdateWatchEventDto,
  WatchParticipantResponseDto,
} from './dto/watch-event.dto';
import { WatchEventsService } from './watch-events.service';

@Controller('v1/watch-events')
export class WatchEventsController {
  constructor(private readonly watchEvents: WatchEventsService) {}

  @Post()
  async create(@Req() request: AuthenticatedRequest, @Body() body: CreateWatchEventDto) {
    return {
      watchEvent: await this.watchEvents.create(request.user.id, body),
    };
  }

  @Get(':watchEventId')
  async detail(@Req() request: AuthenticatedRequest, @Param('watchEventId') watchEventId: string) {
    return {
      watchEvent: await this.watchEvents.detail(request.user.id, watchEventId),
    };
  }

  @Patch(':watchEventId')
  async update(
    @Req() request: AuthenticatedRequest,
    @Param('watchEventId') watchEventId: string,
    @Body() body: UpdateWatchEventDto,
  ) {
    return {
      watchEvent: await this.watchEvents.update(request.user.id, watchEventId, body),
    };
  }

  @Delete(':watchEventId')
  async remove(@Req() request: AuthenticatedRequest, @Param('watchEventId') watchEventId: string) {
    return this.watchEvents.remove(request.user.id, watchEventId);
  }

  @Patch(':watchEventId/participants/me')
  async respond(
    @Req() request: AuthenticatedRequest,
    @Param('watchEventId') watchEventId: string,
    @Body() body: WatchParticipantResponseDto,
  ) {
    return {
      participant: await this.watchEvents.respondToParticipation(
        watchEventId,
        request.user.id,
        body.status,
      ),
    };
  }

  @Put(':watchEventId/reaction')
  async saveReaction(
    @Req() request: AuthenticatedRequest,
    @Param('watchEventId') watchEventId: string,
    @Body() body: SaveWatchReactionDto,
  ) {
    return {
      reaction: await this.watchEvents.upsertReaction(watchEventId, request.user.id, body),
    };
  }
}
