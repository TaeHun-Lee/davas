import { Body, Controller, Get, Param, Post, Query, Req } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import type { AuthenticatedRequest } from '../auth/jwt-cookie-auth.guard';
import { ROUTE_RATE_LIMITS } from '../common/request-limits';
import { MediaSearchQueryDto } from './dto/media-search-query.dto';
import { MediaSelectionDto } from './dto/media-selection.dto';
import { MediaSelectionService } from './media-selection.service';
import { MediaService } from './media.service';

@ApiTags('Media')
@Controller('media')
export class MediaController {
  constructor(
    private readonly mediaService: MediaService,
    private readonly mediaSelectionService: MediaSelectionService,
  ) {}

  @Get('search')
  @Throttle({ default: ROUTE_RATE_LIMITS.tmdbRead })
  search(@Query() query: MediaSearchQueryDto) {
    return this.mediaService.search(query);
  }

  @Post('selections')
  @Throttle({ default: ROUTE_RATE_LIMITS.tmdbSelection })
  select(@Body() selection: MediaSelectionDto, @Req() _request: AuthenticatedRequest) {
    return this.mediaSelectionService.select(selection);
  }

  @Get(':id')
  @Throttle({ default: ROUTE_RATE_LIMITS.tmdbRead })
  findOne(@Param('id') id: string, @Req() request: AuthenticatedRequest) {
    return this.mediaService.findDetail(id, request.user.id);
  }
}
