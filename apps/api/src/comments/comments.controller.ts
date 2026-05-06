import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Comments')
@Controller()
export class CommentsController {
  @Post('diaries/:diaryId/comments')
  create(@Param('diaryId') diaryId: string, @Body('content') content: string) {
    return { diaryId, content, message: 'create comment endpoint contract ready' };
  }

  @Get('diaries/:diaryId/comments')
  findByDiary(@Param('diaryId') diaryId: string) {
    return { diaryId, items: [] };
  }

  @Patch('comments/:commentId')
  update(@Param('commentId') commentId: string, @Body('content') content: string) {
    return { commentId, content, message: 'update comment endpoint contract ready' };
  }

  @Delete('comments/:commentId')
  remove(@Param('commentId') commentId: string) {
    return { commentId, message: 'delete comment endpoint contract ready' };
  }
}
