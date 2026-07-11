import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UnauthorizedException } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import type { Request } from 'express';
import { AuthService } from '../auth/auth.service';
import { DiariesDashboardService } from './diaries-dashboard.service';
import { CreateDiaryDto } from './dto/create-diary.dto';
import { UpdateDiaryDto } from './dto/update-diary.dto';

const ACCESS_TOKEN_COOKIE = 'davas_access_token';

type AuthenticatedRequest = Request & {
  user?: { id: string };
};

@ApiTags('Diaries')
@Controller('diaries')
export class DiariesController {
  constructor(
    private readonly diariesDashboardService: DiariesDashboardService,
    private readonly auth?: AuthService,
  ) {}

  @Post()
  async create(@Req() request: AuthenticatedRequest, @Body() dto: CreateDiaryDto) {
    const diary = await this.diariesDashboardService.createDiary(await this.getUserId(request), dto);
    return { diary };
  }

  @Get('feed')
  async feed(@Req() request: AuthenticatedRequest) {
    return { items: await this.diariesDashboardService.getFeed(await this.getUserId(request)) };
  }

  @Get('me')
  async myDiaries(@Req() request: AuthenticatedRequest) {
    return { items: await this.diariesDashboardService.getMyDiaries(await this.getUserId(request)) };
  }

  @Get('dashboard')
  async dashboard(
    @Req() request: AuthenticatedRequest,
    @Query('year') year?: string,
    @Query('month') month?: string,
    @Query('day') day?: string,
  ) {
    return this.diariesDashboardService.getDashboard(await this.getUserId(request), {
      year: this.toPositiveNumber(year),
      month: this.toPositiveNumber(month),
      day: this.toPositiveNumber(day),
    });
  }

  @Get(':id')
  async findOne(@Req() request: AuthenticatedRequest, @Param('id') id: string) {
    const diary = await this.diariesDashboardService.getDiary(await this.getUserId(request), id);
    return { diary };
  }

  @Patch(':id')
  async update(@Req() request: AuthenticatedRequest, @Param('id') id: string, @Body() dto: UpdateDiaryDto) {
    const diary = await this.diariesDashboardService.updateDiary(await this.getUserId(request), id, dto);
    return { diary };
  }

  @Delete(':id')
  async remove(@Req() request: AuthenticatedRequest, @Param('id') id: string) {
    return this.diariesDashboardService.removeDiary(await this.getUserId(request), id);
  }

  private async getUserId(request: AuthenticatedRequest) {
    if (request.user?.id) {
      return request.user.id;
    }

    const accessToken = this.readCookie(request, ACCESS_TOKEN_COOKIE);
    const user = await this.auth?.findMe(accessToken);
    if (!user) {
      throw new UnauthorizedException('인증이 필요합니다.');
    }
    return user.id;
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

  private toPositiveNumber(value?: string) {
    const parsedValue = Number(value);
    return Number.isInteger(parsedValue) && parsedValue > 0 ? parsedValue : undefined;
  }
}
