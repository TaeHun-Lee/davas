import { Body, Controller, Delete, Param, Post, Req } from '@nestjs/common';
import type { AuthenticatedRequest } from '../auth/jwt-cookie-auth.guard';
import { CreateWatchlistDto } from './watchlist.dto';
import { WatchlistService } from './watchlist.service';

@Controller('watchlist')
export class WatchlistController {
  constructor(private readonly watchlist: WatchlistService) {}

  @Post()
  create(@Req() request: AuthenticatedRequest, @Body() body: CreateWatchlistDto) {
    return this.watchlist.create(request.user.id, body.mediaId);
  }

  @Delete(':id')
  remove(@Req() request: AuthenticatedRequest, @Param('id') id: string) {
    return this.watchlist.remove(request.user.id, id);
  }
}
