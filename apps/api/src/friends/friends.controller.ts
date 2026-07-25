import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req } from '@nestjs/common';
import type { Request } from 'express';
import { AuthService } from '../auth/auth.service';
import { FriendsService } from './friends.service';
import { CreateFriendRequestDto } from './friends.dto';

@Controller('friends')
export class FriendsController {
  constructor(private readonly friends: FriendsService, private readonly auth: AuthService) {}
  @Get() async list(@Req() req: Request) { return this.friends.list((await this.user(req)).id); }
  @Get('search') async search(@Req() req: Request, @Query('q') q = '') { return this.friends.search((await this.user(req)).id, q); }
  @Post('requests') async request(@Req() req: Request, @Body() body: CreateFriendRequestDto) { return this.friends.request((await this.user(req)).id, body.userId); }
  @Patch('requests/:id/accept') async accept(@Req() req: Request, @Param('id') id: string) { return this.friends.respond(id, (await this.user(req)).id, 'ACCEPTED'); }
  @Patch('requests/:id/reject') async reject(@Req() req: Request, @Param('id') id: string) { return this.friends.respond(id, (await this.user(req)).id, 'REJECTED'); }
  @Delete('requests/:id') async cancel(@Req() req: Request, @Param('id') id: string) { return this.friends.cancel(id, (await this.user(req)).id); }
  @Delete(':id') async remove(@Req() req: Request, @Param('id') id: string) { return this.friends.remove(id, (await this.user(req)).id); }
  private user(req: Request) { return this.auth.findMe(req.headers.cookie?.split(';').map((x) => x.trim()).find((x) => x.startsWith('davas_access_token='))?.split('=')[1]); }
}
