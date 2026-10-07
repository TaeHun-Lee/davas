import { Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import type { AuthenticatedRequest } from '../auth/jwt-cookie-auth.guard';
import {
  OptionalJwtCookieAuthGuard,
  type OptionallyAuthenticatedRequest,
} from '../auth/optional-jwt-cookie-auth.guard';
import { Public } from '../auth/public.decorator';
import { SpacesService } from './spaces.service';

@Controller('v1/invites')
export class SpaceInvitesController {
  constructor(private readonly spaces: SpacesService) {}

  // Anonymous visitors must see the invite context before choosing login or signup.
  @Get(':token')
  @Public()
  @UseGuards(OptionalJwtCookieAuthGuard)
  inspect(@Req() request: OptionallyAuthenticatedRequest, @Param('token') token: string) {
    return this.spaces.inspectInvite(token, request.user?.id);
  }

  @Post(':token/accept')
  accept(@Req() request: AuthenticatedRequest, @Param('token') token: string) {
    return this.spaces.acceptInvite(token, request.user.id);
  }

  @Post(':token/decline')
  decline(@Req() request: AuthenticatedRequest, @Param('token') token: string) {
    return this.spaces.declineInvite(token, request.user.id);
  }
}
