import { Body, Controller, Get, Param, Patch, Put, Req } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import type { AuthenticatedRequest } from '../auth/jwt-cookie-auth.guard';
import { NotificationsService } from './notifications.service';
import { UpdateNotificationPreferenceDto } from './dto/update-notification-preference.dto';

@ApiTags('Notifications')
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notifications: NotificationsService) {}

  @Get()
  list(@Req() request: AuthenticatedRequest) {
    return this.notifications.listForUser(request.user.id);
  }

  @Get('unread-count')
  async unreadCount(@Req() request: AuthenticatedRequest) {
    return { unreadCount: await this.notifications.unreadCount(request.user.id) };
  }

  @Patch('read-all')
  markAllRead(@Req() request: AuthenticatedRequest) {
    return this.notifications.markAllRead(request.user.id);
  }

  @Get('preferences')
  async listPreferences(@Req() request: AuthenticatedRequest) {
    return { items: await this.notifications.listPreferences(request.user.id) };
  }

  @Put('preferences')
  updatePreference(
    @Req() request: AuthenticatedRequest,
    @Body() body: UpdateNotificationPreferenceDto,
  ) {
    return this.notifications.setPreference(request.user.id, body.category, body.enabled);
  }

  @Patch(':id/read')
  markRead(@Req() request: AuthenticatedRequest, @Param('id') id: string) {
    return this.notifications.markRead(id, request.user.id);
  }
}
