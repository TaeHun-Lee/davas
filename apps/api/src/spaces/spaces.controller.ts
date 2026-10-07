import { Body, Controller, Delete, Get, Param, Patch, Post, Req } from '@nestjs/common';
import type { AuthenticatedRequest } from '../auth/jwt-cookie-auth.guard';
import {
  CreateSpaceDto,
  CreateSpaceInviteDto,
  RenameSpaceDto,
  TransferSpaceOwnershipDto,
} from './spaces.dto';
import { SpacesService } from './spaces.service';

@Controller('v1/spaces')
export class SpacesController {
  constructor(private readonly spaces: SpacesService) {}

  @Post()
  async create(@Req() request: AuthenticatedRequest, @Body() body: CreateSpaceDto) {
    return this.spaces.create(request.user.id, body);
  }

  @Get()
  async list(@Req() request: AuthenticatedRequest) {
    return this.spaces.list(request.user.id);
  }

  @Get(':spaceId')
  async get(@Req() request: AuthenticatedRequest, @Param('spaceId') spaceId: string) {
    return this.spaces.get(spaceId, request.user.id);
  }

  @Patch(':spaceId')
  async rename(
    @Req() request: AuthenticatedRequest,
    @Param('spaceId') spaceId: string,
    @Body() body: RenameSpaceDto,
  ) {
    return this.spaces.rename(spaceId, request.user.id, body.name);
  }

  @Post(':spaceId/invites')
  async createInvite(
    @Req() request: AuthenticatedRequest,
    @Param('spaceId') spaceId: string,
    @Body() body: CreateSpaceInviteDto,
  ) {
    return this.spaces.createInvite(spaceId, request.user.id, body);
  }

  @Delete(':spaceId/invites/:inviteId')
  async cancelInvite(
    @Req() request: AuthenticatedRequest,
    @Param('spaceId') spaceId: string,
    @Param('inviteId') inviteId: string,
  ) {
    return this.spaces.cancelInvite(spaceId, inviteId, request.user.id);
  }

  @Patch(':spaceId/owner')
  async transferOwnership(
    @Req() request: AuthenticatedRequest,
    @Param('spaceId') spaceId: string,
    @Body() body: TransferSpaceOwnershipDto,
  ) {
    return this.spaces.transferOwnership(spaceId, request.user.id, body.newOwnerAccountId);
  }

  @Delete(':spaceId/members/me')
  async leave(@Req() request: AuthenticatedRequest, @Param('spaceId') spaceId: string) {
    return this.spaces.leave(spaceId, request.user.id);
  }

  @Delete(':spaceId')
  async close(@Req() request: AuthenticatedRequest, @Param('spaceId') spaceId: string) {
    return this.spaces.close(spaceId, request.user.id);
  }
}
