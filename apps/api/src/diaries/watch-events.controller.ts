import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Req,
} from '@nestjs/common';
import type { Request } from 'express';
import { AuthService } from '../auth/auth.service';
import {
  CreateWatchEventDto,
  SaveWatchReactionDto,
  UpdateWatchEventDto,
  WatchParticipantResponseDto,
} from './dto/watch-event.dto';
import { WatchEventsService } from './watch-events.service';

@Controller('v1/watch-events')
export class WatchEventsController {
  constructor(
    private readonly watchEvents: WatchEventsService,
    private readonly auth: AuthService,
  ) {}

  @Post()
  async create(@Req() request: Request, @Body() body: CreateWatchEventDto) {
    return {
      watchEvent: await this.watchEvents.create(
        (await this.user(request)).id,
        body,
      ),
    };
  }

  @Get(':watchEventId')
  async detail(
    @Req() request: Request,
    @Param('watchEventId') watchEventId: string,
  ) {
    return {
      watchEvent: await this.watchEvents.detail(
        (await this.user(request)).id,
        watchEventId,
      ),
    };
  }

  @Patch(':watchEventId')
  async update(
    @Req() request: Request,
    @Param('watchEventId') watchEventId: string,
    @Body() body: UpdateWatchEventDto,
  ) {
    return {
      watchEvent: await this.watchEvents.update(
        (await this.user(request)).id,
        watchEventId,
        body,
      ),
    };
  }

  @Delete(':watchEventId')
  async remove(
    @Req() request: Request,
    @Param('watchEventId') watchEventId: string,
  ) {
    return this.watchEvents.remove((await this.user(request)).id, watchEventId);
  }

  @Patch(':watchEventId/participants/me')
  async respond(
    @Req() request: Request,
    @Param('watchEventId') watchEventId: string,
    @Body() body: WatchParticipantResponseDto,
  ) {
    return {
      participant: await this.watchEvents.respondToParticipation(
        watchEventId,
        (await this.user(request)).id,
        body.status,
      ),
    };
  }

  @Put(':watchEventId/reaction')
  async saveReaction(
    @Req() request: Request,
    @Param('watchEventId') watchEventId: string,
    @Body() body: SaveWatchReactionDto,
  ) {
    return {
      reaction: await this.watchEvents.upsertReaction(
        watchEventId,
        (await this.user(request)).id,
        body,
      ),
    };
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
