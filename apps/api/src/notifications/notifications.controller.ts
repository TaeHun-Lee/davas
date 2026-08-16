import { Body, Controller, Get, Param, Patch, Put, Req } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import type { Request } from 'express';
import { AuthService } from '../auth/auth.service';
import { NotificationsService } from './notifications.service';
import { UpdateNotificationPreferenceDto } from './dto/update-notification-preference.dto';

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

  @Get('preferences')
  async listPreferences(@Req() request: Request) {
    const viewer = await this.auth.findMe(this.readCookie(request, ACCESS_TOKEN_COOKIE));
    return { items: await this.notifications.listPreferences(viewer.id) };
  }

  @Put('preferences')
  async updatePreference(
    @Req() request: Request,
    @Body() body: UpdateNotificationPreferenceDto,
  ) {
    const viewer = await this.auth.findMe(this.readCookie(request, ACCESS_TOKEN_COOKIE));
    return this.notifications.setPreference(viewer.id, body.category, body.enabled);
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
