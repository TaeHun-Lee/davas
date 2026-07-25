import { Controller, Get, Param, Post, Req } from '@nestjs/common';
import type { Request } from 'express';
import { AuthService } from '../auth/auth.service';
import { FriendInvitesService } from './friend-invites.service';

@Controller('friends/invites')
export class FriendInvitesController {
  constructor(private readonly invites: FriendInvitesService, private readonly auth: AuthService) {}
  @Post() async create(@Req() req: Request) { return this.invites.create((await this.auth.findMe(this.token(req))).id); }
  @Get(':token') async inspect(@Req() req: Request, @Param('token') token: string) { return this.invites.inspect(token, await this.optionalUserId(req)); }
  @Post(':token/accept') async accept(@Req() req: Request, @Param('token') token: string) { return this.invites.accept(token, (await this.auth.findMe(this.token(req))).id); }
  private token(req: Request) { return req.headers.cookie?.split(';').map((x) => x.trim()).find((x) => x.startsWith('davas_access_token='))?.split('=')[1]; }
  private async optionalUserId(req: Request) { try { return (await this.auth.findMe(this.token(req))).id; } catch { return undefined; } }
}
