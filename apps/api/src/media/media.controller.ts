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
  UnauthorizedException,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import type { Request } from 'express';
import { AuthService } from '../auth/auth.service';
import { MediaSearchQueryDto } from './dto/media-search-query.dto';
import { MediaSelectionDto } from './dto/media-selection.dto';
import { AvailabilityQueryDto } from './dto/availability-query.dto';
import { AvailabilityService } from './availability.service';
import { MediaSelectionService } from './media-selection.service';
import { MediaService } from './media.service';

const ACCESS_TOKEN_COOKIE = 'davas_access_token';

@ApiTags('Media')
@Controller('media')
export class MediaController {
  constructor(
    private readonly mediaService: MediaService,
    private readonly mediaSelectionService: MediaSelectionService,
    private readonly auth?: AuthService,
    @Optional() private readonly availabilityService?: AvailabilityService,
  ) {}

  @Get('search')
  search(@Query() query: MediaSearchQueryDto) {
    return this.mediaService.search(query);
  }

  @Post('selections')
  async select(@Body() selection: MediaSelectionDto, @Req() request: Request) {
    await this.getUserId(request);
    return this.mediaSelectionService.select(selection);
  }

  @Get('people/search')
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
  findPersonCredits(
    @Param('personId') personId: string,
    @Query('language') language?: string,
  ) {
    return this.mediaService.findPersonCredits(personId, language ?? 'ko-KR');
  }

  @Get(':id/availability')
  availability(@Param('id') id: string, @Query() query: AvailabilityQueryDto) {
    return this.requireAvailabilityService().getCurrent(
      id,
      query.region ?? 'KR',
    );
  }

  @Post(':id/availability/refresh')
  refreshAvailability(
    @Param('id') id: string,
    @Query() query: AvailabilityQueryDto,
  ) {
    return this.requireAvailabilityService().refresh(id, query.region ?? 'KR');
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Req() request: Request) {
    return this.mediaService.findDetail(
      id,
      await this.getOptionalUserId(request),
    );
  }

  private async getUserId(request: Request) {
    const user = await this.auth?.findMe(
      this.readCookie(request, ACCESS_TOKEN_COOKIE),
    );
    if (!user) {
      throw new UnauthorizedException('인증이 필요합니다.');
    }
    return user.id;
  }

  private requireAvailabilityService() {
    if (!this.availabilityService) {
      throw new ServiceUnavailableException(
        'Availability service is not configured',
      );
    }
    return this.availabilityService;
  }

  private async getOptionalUserId(request: Request) {
    try {
      const user = await this.auth?.findMe(
        this.readCookie(request, ACCESS_TOKEN_COOKIE),
      );
      return user?.id;
    } catch {
      return undefined;
    }
  }

  private readCookie(request: Request, name: string): string | undefined {
    const cookieHeader = request.headers.cookie;
    if (!cookieHeader) {
      return undefined;
    }

    return cookieHeader
      .split(';')
      .map((part) => part.trim())
      .map((part) => part.split('='))
      .find(([key]) => key === name)?.[1];
  }
}
