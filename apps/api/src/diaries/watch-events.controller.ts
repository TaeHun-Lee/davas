import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Put,
  Query,
  Req,
} from '@nestjs/common';
import type { AuthenticatedRequest } from '../auth/jwt-cookie-auth.guard';
import {
  CreateWatchEventDto,
  SaveWatchReactionDto,
  SetWatchPhotosDto,
  UpdateWatchEventDto,
  WatchSearchQueryDto,
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

  // Declared before ':watchEventId' so "search" is never read as a record id.
  @Get('search')
  async search(@Req() request: AuthenticatedRequest, @Query() query: WatchSearchQueryDto) {
    return this.watchEvents.search(request.user.id, query);
  }

  @Get('progress/:mediaId')
  async progress(
    @Req() request: AuthenticatedRequest,
    @Param('mediaId', ParseUUIDPipe) mediaId: string,
  ) {
    return { progress: await this.watchEvents.progress(request.user.id, mediaId) };
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

  @Put(':watchEventId/photos')
  async setPhotos(
    @Req() request: AuthenticatedRequest,
    @Param('watchEventId', ParseUUIDPipe) watchEventId: string,
    @Body() body: SetWatchPhotosDto,
  ) {
    return {
      watchEvent: await this.watchEvents.setMyPhotos(watchEventId, request.user.id, body.photoIds),
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

  @Put(':watchEventId/reactions/:reactionId/like')
  like(
    @Req() request: AuthenticatedRequest,
    @Param('watchEventId', ParseUUIDPipe) watchEventId: string,
    @Param('reactionId', ParseUUIDPipe) reactionId: string,
  ) {
    return this.watchEvents.setReviewLike(watchEventId, reactionId, request.user.id, true);
  }

  @Delete(':watchEventId/reactions/:reactionId/like')
  unlike(
    @Req() request: AuthenticatedRequest,
    @Param('watchEventId', ParseUUIDPipe) watchEventId: string,
    @Param('reactionId', ParseUUIDPipe) reactionId: string,
  ) {
    return this.watchEvents.setReviewLike(watchEventId, reactionId, request.user.id, false);
  }
}
