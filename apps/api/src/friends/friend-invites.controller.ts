import { Controller, Get, Param, Post, Req } from '@nestjs/common';
import type { AuthenticatedRequest } from '../auth/jwt-cookie-auth.guard';
import { Public } from '../auth/public.decorator';
import { FriendInvitesService } from './friend-invites.service';

@Controller('friends/invites')
export class FriendInvitesController {
  constructor(private readonly invites: FriendInvitesService) {}

  @Post()
  create(@Req() request: AuthenticatedRequest) {
    return this.invites.create(request.user!.id);
  }

  @Public()
  @Get(':token')
  inspect(@Param('token') token: string) {
    return this.invites.inspect(token, undefined);
  }

  @Post(':token/accept')
  accept(@Req() request: AuthenticatedRequest, @Param('token') token: string) {
    return this.invites.accept(token, request.user!.id);
  }
}
