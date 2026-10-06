import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req } from '@nestjs/common';
import type { AuthenticatedRequest } from '../auth/jwt-cookie-auth.guard';
import { CreateWatchlistDto, ListWatchlistQueryDto, UpdateWatchlistDto } from './watchlist.dto';
import { WatchlistService } from './watchlist.service';

@Controller('watchlist')
export class WatchlistController {
  constructor(private readonly watchlist: WatchlistService) {}

  @Post()
  create(@Req() request: AuthenticatedRequest, @Body() body: CreateWatchlistDto) {
    return this.watchlist.create(request.user.id, body.mediaId);
  }

  @Get()
  list(@Req() request: AuthenticatedRequest, @Query() query: ListWatchlistQueryDto) {
    return this.watchlist.list(request.user.id, query.status);
  }

  @Patch(':id')
  update(
    @Req() request: AuthenticatedRequest,
    @Param('id') id: string,
    @Body() body: UpdateWatchlistDto,
  ) {
    return this.watchlist.update(request.user.id, id, body);
  }

  @Delete(':id')
  remove(@Req() request: AuthenticatedRequest, @Param('id') id: string) {
    return this.watchlist.remove(request.user.id, id);
  }

  @Post(':id/complete')
  complete(@Req() request: AuthenticatedRequest, @Param('id') id: string) {
    return this.watchlist.complete(request.user.id, id);
  }
}
