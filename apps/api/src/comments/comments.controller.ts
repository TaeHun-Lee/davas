import { Body, Controller, Delete, Get, Param, Patch, Post, Req } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import type { AuthenticatedRequest } from '../auth/jwt-cookie-auth.guard';
import { CommentsService } from './comments.service';

@ApiTags('Comments')
@Controller()
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post('diaries/:diaryId/comments')
  create(
    @Req() request: AuthenticatedRequest,
    @Param('diaryId') diaryId: string,
    @Body('content') content: string,
  ) {
    return this.commentsService.create(diaryId, request.user.id, content ?? '');
  }

  @Get('diaries/:diaryId/comments')
  findByDiary(@Req() request: AuthenticatedRequest, @Param('diaryId') diaryId: string) {
    return this.commentsService.listForDiary(diaryId, request.user.id);
  }

  @Patch('comments/:commentId')
  update(
    @Req() request: AuthenticatedRequest,
    @Param('commentId') commentId: string,
    @Body('content') content: string,
  ) {
    return this.commentsService.update(commentId, request.user.id, content ?? '');
  }

  @Delete('comments/:commentId')
  remove(@Req() request: AuthenticatedRequest, @Param('commentId') commentId: string) {
    return this.commentsService.remove(commentId, request.user.id);
  }
}
