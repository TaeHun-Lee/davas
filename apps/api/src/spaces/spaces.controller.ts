import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
} from '@nestjs/common';
import type { Request } from 'express';
import { AuthService } from '../auth/auth.service';
import {
  CreateSpaceDto,
  CreateSpaceInviteDto,
  TransferSpaceOwnershipDto,
} from './spaces.dto';
import { SpacesService } from './spaces.service';

@Controller('v1/spaces')
export class SpacesController {
  constructor(
    private readonly spaces: SpacesService,
    private readonly auth: AuthService,
  ) {}

  @Post()
  async create(@Req() request: Request, @Body() body: CreateSpaceDto) {
    return this.spaces.create((await this.user(request)).id, body);
  }

  @Get()
  async list(@Req() request: Request) {
    return this.spaces.list((await this.user(request)).id);
  }

  @Get(':spaceId')
  async get(@Req() request: Request, @Param('spaceId') spaceId: string) {
    return this.spaces.get(spaceId, (await this.user(request)).id);
  }

  @Post(':spaceId/invites')
  async createInvite(
    @Req() request: Request,
    @Param('spaceId') spaceId: string,
    @Body() body: CreateSpaceInviteDto,
  ) {
    return this.spaces.createInvite(
      spaceId,
      (await this.user(request)).id,
      body,
    );
  }

  @Delete(':spaceId/invites/:inviteId')
  async cancelInvite(
    @Req() request: Request,
    @Param('spaceId') spaceId: string,
    @Param('inviteId') inviteId: string,
  ) {
    return this.spaces.cancelInvite(
      spaceId,
      inviteId,
      (await this.user(request)).id,
    );
  }

  @Patch(':spaceId/owner')
  async transferOwnership(
    @Req() request: Request,
    @Param('spaceId') spaceId: string,
    @Body() body: TransferSpaceOwnershipDto,
  ) {
    return this.spaces.transferOwnership(
      spaceId,
      (await this.user(request)).id,
      body.newOwnerAccountId,
    );
  }

  @Delete(':spaceId/members/me')
  async leave(@Req() request: Request, @Param('spaceId') spaceId: string) {
    return this.spaces.leave(spaceId, (await this.user(request)).id);
  }

  @Delete(':spaceId')
  async close(@Req() request: Request, @Param('spaceId') spaceId: string) {
    return this.spaces.close(spaceId, (await this.user(request)).id);
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
