import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UnauthorizedException } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import type { Request } from 'express';
import { AuthService } from '../auth/auth.service';
import { CommentsService } from './comments.service';

const ACCESS_TOKEN_COOKIE = 'davas_access_token';

type AuthenticatedRequest = Request & {
  user?: { id: string };
};

@ApiTags('Comments')
@Controller()
export class CommentsController {
  constructor(
    private readonly commentsService: CommentsService,
    private readonly auth?: AuthService,
  ) {}

  @Post('diaries/:diaryId/comments')
  async create(@Req() request: AuthenticatedRequest, @Param('diaryId') diaryId: string, @Body('content') content: string) {
    return this.commentsService.create(diaryId, await this.getUserId(request), content ?? '');
  }

  @Get('diaries/:diaryId/comments')
  async findByDiary(@Req() request: AuthenticatedRequest, @Param('diaryId') diaryId: string) {
    return this.commentsService.listForDiary(diaryId, await this.getOptionalUserId(request));
  }

  @Patch('comments/:commentId')
  async update(@Req() request: AuthenticatedRequest, @Param('commentId') commentId: string, @Body('content') content: string) {
    return this.commentsService.update(commentId, await this.getUserId(request), content ?? '');
  }

  @Delete('comments/:commentId')
  async remove(@Req() request: AuthenticatedRequest, @Param('commentId') commentId: string) {
    return this.commentsService.remove(commentId, await this.getUserId(request));
  }

  private async getOptionalUserId(request: AuthenticatedRequest) {
    if (request.user?.id) return request.user.id;
    const accessToken = this.readCookie(request, ACCESS_TOKEN_COOKIE);
    const user = accessToken ? await this.auth?.findMe(accessToken) : null;
    return user?.id;
  }

  private async getUserId(request: AuthenticatedRequest) {
    const userId = await this.getOptionalUserId(request);
    if (!userId) {
      throw new UnauthorizedException('인증이 필요합니다.');
    }
    return userId;
  }

  private readCookie(request: Request, name: string): string | undefined {
    const cookieHeader = request.headers.cookie;
    if (!cookieHeader) return undefined;
    return cookieHeader
      .split(';')
      .map((part) => part.trim())
      .map((part) => part.split('='))
      .find(([key]) => key === name)?.[1];
  }
}
