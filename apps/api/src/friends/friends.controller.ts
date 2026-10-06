import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import type { AuthenticatedRequest } from '../auth/jwt-cookie-auth.guard';
import { ROUTE_RATE_LIMITS } from '../common/request-limits';
import { CreateFriendRequestDto } from './friends.dto';
import { FriendsService } from './friends.service';

@Controller('friends')
export class FriendsController {
  constructor(private readonly friends: FriendsService) {}

  @Get()
  list(@Req() request: AuthenticatedRequest) {
    return this.friends.list(request.user.id);
  }

  @Get('search')
  @Throttle({ default: ROUTE_RATE_LIMITS.localSearch })
  search(@Req() request: AuthenticatedRequest, @Query('q') query = '') {
    return this.friends.search(request.user.id, query);
  }

  @Post('requests')
  createRequest(@Req() request: AuthenticatedRequest, @Body() body: CreateFriendRequestDto) {
    return this.friends.request(request.user.id, body.userId);
  }

  @Patch('requests/:id/accept')
  accept(@Req() request: AuthenticatedRequest, @Param('id') id: string) {
    return this.friends.respond(id, request.user.id, 'ACCEPTED');
  }

  @Patch('requests/:id/reject')
  reject(@Req() request: AuthenticatedRequest, @Param('id') id: string) {
    return this.friends.respond(id, request.user.id, 'REJECTED');
  }

  @Delete('requests/:id')
  cancel(@Req() request: AuthenticatedRequest, @Param('id') id: string) {
    return this.friends.cancel(id, request.user.id);
  }

  @Delete(':id')
  remove(@Req() request: AuthenticatedRequest, @Param('id') id: string) {
    return this.friends.remove(id, request.user.id);
  }
}
