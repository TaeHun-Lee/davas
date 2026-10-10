import { Controller, Get, Query, Req } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import type { AuthenticatedRequest } from '../auth/jwt-cookie-auth.guard';
import { ROUTE_RATE_LIMITS } from '../common/request-limits';
import { DiaryListQueryDto } from './dto/diary-list-query.dto';
import { DiariesService } from './diaries.service';

@ApiTags('Diaries')
@Controller('diaries')
export class DiariesController {
  constructor(private readonly diariesService: DiariesService) {}

  @Get('feed')
  @Throttle({ default: ROUTE_RATE_LIMITS.localSearch })
  feed(@Req() request: AuthenticatedRequest, @Query() query: DiaryListQueryDto) {
    return this.diariesService.feed(request.user.id, query);
  }

  @Get('me')
  @Throttle({ default: ROUTE_RATE_LIMITS.localSearch })
  myDiaries(@Req() request: AuthenticatedRequest, @Query() query: DiaryListQueryDto) {
    return this.diariesService.mine(request.user.id, query);
  }
}
