import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Optional,
  Param,
  Patch,
  Post,
  Query,
  Req,
  Res,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import type { Response } from 'express';
import type { AuthenticatedRequest } from '../auth/jwt-cookie-auth.guard';
import { ROUTE_RATE_LIMITS } from '../common/request-limits';
import { DiariesDashboardService } from './diaries-dashboard.service';
import { CreateDiaryDto } from './dto/create-diary.dto';
import { DiaryListQueryDto } from './dto/diary-list-query.dto';
import { UpdateDiaryDto } from './dto/update-diary.dto';
import { DiariesService } from './diaries.service';

@ApiTags('Diaries')
@Controller('diaries')
export class DiariesController {
  constructor(
    private readonly diariesDashboardService: DiariesDashboardService,
    @Optional() private readonly diariesService?: DiariesService,
  ) {}

  @Post()
  async create(
    @Req() request: AuthenticatedRequest,
    @Body() dto: CreateDiaryDto,
    @Res({ passthrough: true }) response?: Response,
  ) {
    if (!this.diariesService) {
      return {
        diary: await this.diariesDashboardService.createDiary(request.user.id, dto as never),
      };
    }
    const result = await this.diariesService.create(request.user.id, dto);
    response?.status(result.deduplicated ? HttpStatus.OK : HttpStatus.CREATED);
    return result;
  }

  @Get('feed')
  @Throttle({ default: ROUTE_RATE_LIMITS.localSearch })
  async feed(@Req() request: AuthenticatedRequest, @Query() query: DiaryListQueryDto) {
    return this.diariesService
      ? this.diariesService.feed(request.user.id, query)
      : {
          items: await this.diariesDashboardService.getFeed(request.user.id),
          nextCursor: null,
          hasMore: false,
        };
  }

  @Get('me')
  @Throttle({ default: ROUTE_RATE_LIMITS.localSearch })
  async myDiaries(@Req() request: AuthenticatedRequest, @Query() query: DiaryListQueryDto) {
    return this.diariesService
      ? this.diariesService.mine(request.user.id, query)
      : {
          items: await this.diariesDashboardService.getMyDiaries(request.user.id),
          nextCursor: null,
          hasMore: false,
        };
  }

  @Get('dashboard')
  async dashboard(
    @Req() request: AuthenticatedRequest,
    @Query('year') year?: string,
    @Query('month') month?: string,
    @Query('day') day?: string,
  ) {
    return this.diariesDashboardService.getDashboard(request.user.id, {
      year: this.toPositiveNumber(year),
      month: this.toPositiveNumber(month),
      day: this.toPositiveNumber(day),
    });
  }

  @Get(':id')
  async findOne(@Req() request: AuthenticatedRequest, @Param('id') id: string) {
    const diary = this.diariesService
      ? await this.diariesService.detail(request.user.id, id)
      : await this.diariesDashboardService.getDiary(request.user.id, id);
    return { diary };
  }

  @Patch(':id')
  async update(
    @Req() request: AuthenticatedRequest,
    @Param('id') id: string,
    @Body() dto: UpdateDiaryDto,
  ) {
    const diary = this.diariesService
      ? await this.diariesService.update(request.user.id, id, dto)
      : await this.diariesDashboardService.updateDiary(request.user.id, id, dto as never);
    return { diary };
  }

  @Delete(':id')
  remove(@Req() request: AuthenticatedRequest, @Param('id') id: string) {
    return this.diariesService
      ? this.diariesService.remove(request.user.id, id)
      : this.diariesDashboardService.removeDiary(request.user.id, id);
  }

  private toPositiveNumber(value?: string) {
    const parsedValue = Number(value);
    return Number.isInteger(parsedValue) && parsedValue > 0 ? parsedValue : undefined;
  }
}
