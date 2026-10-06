import {
  Body,
  Controller,
  Get,
  Optional,
  Param,
  Post,
  Query,
  Req,
  ServiceUnavailableException,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import type { AuthenticatedRequest } from '../auth/jwt-cookie-auth.guard';
import { ROUTE_RATE_LIMITS } from '../common/request-limits';
import { AvailabilityService } from './availability.service';
import { AvailabilityQueryDto } from './dto/availability-query.dto';
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
    @Optional() private readonly availabilityService?: AvailabilityService,
  ) {}

  @Get('search')
  @Throttle({ default: ROUTE_RATE_LIMITS.tmdbRead })
  search(@Query() query: MediaSearchQueryDto) {
    return this.mediaService.search(query);
  }

  @Post('selections')
  @Throttle({ default: ROUTE_RATE_LIMITS.tmdbSelection })
  select(@Body() selection: MediaSelectionDto) {
    return this.mediaSelectionService.select(selection);
  }

  @Get('people/search')
  @Throttle({ default: ROUTE_RATE_LIMITS.tmdbRead })
  searchPeople(
    @Query()
    query: {
      q?: string;
      query?: string;
      page?: number;
      language?: string;
    },
  ) {
    return this.mediaService.searchPeople(query);
  }

  @Get('people/:personId/credits')
  @Throttle({ default: ROUTE_RATE_LIMITS.tmdbRead })
  findPersonCredits(@Param('personId') personId: string, @Query('language') language?: string) {
    return this.mediaService.findPersonCredits(personId, language ?? 'ko-KR');
  }

  @Get(':id/availability')
  @Throttle({ default: ROUTE_RATE_LIMITS.tmdbRead })
  availability(@Param('id') id: string, @Query() query: AvailabilityQueryDto) {
    return this.requireAvailabilityService().getCurrent(id, query.region ?? 'KR');
  }

  @Post(':id/availability/refresh')
  @Throttle({ default: ROUTE_RATE_LIMITS.tmdbSelection })
  refreshAvailability(@Param('id') id: string, @Query() query: AvailabilityQueryDto) {
    return this.requireAvailabilityService().refresh(id, query.region ?? 'KR');
  }

  @Get(':id')
  @Throttle({ default: ROUTE_RATE_LIMITS.tmdbRead })
  findOne(@Param('id') id: string, @Req() request: AuthenticatedRequest) {
    return this.mediaService.findDetail(id, request.user.id);
  }

  private requireAvailabilityService() {
    if (!this.availabilityService) {
      throw new ServiceUnavailableException('Availability service is not configured');
    }
    return this.availabilityService;
  }
}
