import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UnauthorizedException } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import type { Request } from 'express';
import { AuthService } from '../auth/auth.service';
import { DiariesDashboardService } from './diaries-dashboard.service';
import { CreateDiaryDto } from './dto/create-diary.dto';
import { UpdateDiaryDto } from './dto/update-diary.dto';

const ACCESS_TOKEN_COOKIE = 'davas_...oken';

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
  feed() {
    return { items: [] };
  }

  @Get('me')
  myDiaries() {
    return { items: [] };
  }

  @Get('dashboard')
  async dashboard(@Req() request: AuthenticatedRequest) {
    return this.diariesDashboardService.getDashboard(await this.getUserId(request));
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return { id, message: 'diary detail endpoint contract ready' };
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateDiaryDto) {
    return { id, message: 'update diary endpoint contract ready', diary: dto };
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return { id, message: 'delete diary endpoint contract ready' };
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
}
