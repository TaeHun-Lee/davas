import { Controller, Get, Param, ParseUUIDPipe, Req } from '@nestjs/common';
import type { AuthenticatedRequest } from '../auth/jwt-cookie-auth.guard';
import { ShowtimesService } from './showtimes.service';

@Controller('media')
export class ShowtimesController {
  constructor(private readonly showtimes: ShowtimesService) {}

  /** Where a stored film plays in Seoul and Gyeonggi this week (KOBIS). */
  @Get(':id/showtimes')
  forMedia(@Req() request: AuthenticatedRequest, @Param('id', ParseUUIDPipe) id: string) {
    return this.showtimes.forMedia(id, request.user.id);
  }
}
