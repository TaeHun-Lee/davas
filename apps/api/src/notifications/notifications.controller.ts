import { Controller, Get, Param, Patch, Req } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import type { Request } from 'express';
import { AuthService } from '../auth/auth.service';
import { NotificationsService } from './notifications.service';

const ACCESS_TOKEN_COOKIE = 'davas_access_token';

@ApiTags('Notifications')
@Controller('notifications')
export class NotificationsController {
  constructor(
    private readonly auth: AuthService,
    private readonly notifications: NotificationsService,
  ) {}

  @Get()
  async list(@Req() request: Request) {
    const viewer = await this.auth.findMe(this.readCookie(request, ACCESS_TOKEN_COOKIE));
    return this.notifications.listForUser(viewer.id);
  }

  @Patch(':id/read')
  async markRead(@Req() request: Request, @Param('id') id: string) {
    const viewer = await this.auth.findMe(this.readCookie(request, ACCESS_TOKEN_COOKIE));
    return this.notifications.markRead(id, viewer.id);
  }

  private readCookie(request: Request, name: string): string | undefined {
    const cookieHeader = request.headers.cookie;
    if (!cookieHeader) return undefined;
    return cookieHeader
      .split(';')
      .map((part) => part.trim())
      .map((part) => part.split('='))
      .find(([key]) => key === name)?.[1];
  }
}
