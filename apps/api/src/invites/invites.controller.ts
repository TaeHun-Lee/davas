import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import type { Request } from 'express';
import { AuthService } from '../auth/auth.service';
import { InvitesService } from './invites.service';
import { CreateInviteDto, ValidateInviteDto } from './invites.dto';

@Controller('invites')
export class InvitesController {
  constructor(private readonly invites: InvitesService, private readonly auth: AuthService) {}
  @Post('validate') validate(@Body() body: ValidateInviteDto) { return this.invites.validate(body.code); }
  @Post() async create(@Req() req: Request, @Body() body: CreateInviteDto) { return this.invites.create((await this.user(req)).id, body); }
  @Get() async list(@Req() req: Request) { return { items: await this.invites.list((await this.user(req)).id) }; }
  private user(req: Request) { return this.auth.findMe(req.headers.cookie?.split(';').map((x) => x.trim()).find((x) => x.startsWith('davas_access_token='))?.split('=')[1]); }
}
