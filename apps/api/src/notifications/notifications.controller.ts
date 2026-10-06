import { Controller, Get, Param, Patch, Req } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import type { AuthenticatedRequest } from '../auth/jwt-cookie-auth.guard';
import { NotificationsService } from './notifications.service';

@ApiTags('Notifications')
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notifications: NotificationsService) {}

  @Get()
  list(@Req() request: AuthenticatedRequest) {
    return this.notifications.listForUser(request.user.id);
  }

  @Patch(':id/read')
  markRead(@Req() request: AuthenticatedRequest, @Param('id') id: string) {
    return this.notifications.markRead(id, request.user.id);
  }
}
