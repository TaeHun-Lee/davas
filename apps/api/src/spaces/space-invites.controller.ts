import { Controller, Get, Param, Post, Req } from '@nestjs/common';
import type { Request } from 'express';
import { AuthService } from '../auth/auth.service';
import { SpacesService } from './spaces.service';

@Controller('v1/invites')
export class SpaceInvitesController {
  constructor(
    private readonly spaces: SpacesService,
    private readonly auth: AuthService,
  ) {}

  @Get(':token')
  async inspect(@Req() request: Request, @Param('token') token: string) {
    return this.spaces.inspectInvite(token, await this.optionalUserId(request));
  }

  @Post(':token/accept')
  async accept(@Req() request: Request, @Param('token') token: string) {
    return this.spaces.acceptInvite(
      token,
      (await this.auth.findMe(this.token(request))).id,
    );
  }

  private token(request: Request) {
    return request.headers.cookie
      ?.split(';')
      .map((entry) => entry.trim())
      .find((entry) => entry.startsWith('davas_access_token='))
      ?.split('=')[1];
  }

  private async optionalUserId(request: Request) {
    try {
      return (await this.auth.findMe(this.token(request))).id;
    } catch {
      return undefined;
    }
  }
}
