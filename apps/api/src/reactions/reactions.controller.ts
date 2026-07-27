import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
} from '@nestjs/common';
import { REACTION_EMOJIS, type ReactionEmoji } from '@davas/shared';
import type { AuthenticatedRequest } from '../auth/jwt-cookie-auth.guard';
import { CreateReactionDto } from './reactions.dto';
import { ReactionsService } from './reactions.service';

@Controller('diaries/:diaryId/reactions')
export class ReactionsController {
  constructor(private readonly service: ReactionsService) {}

  @Get()
  list(@Req() request: AuthenticatedRequest, @Param('diaryId') diaryId: string) {
    return this.service.list(diaryId, request.user.id);
  }

  @Post()
  add(
    @Req() request: AuthenticatedRequest,
    @Param('diaryId') diaryId: string,
    @Body() body: CreateReactionDto,
  ) {
    return this.service.add(diaryId, request.user.id, body.emoji);
  }

  @Delete(':emoji')
  remove(
    @Req() request: AuthenticatedRequest,
    @Param('diaryId') diaryId: string,
    @Param('emoji') emoji: ReactionEmoji,
  ) {
    this.assertEmoji(emoji);
    return this.service.remove(diaryId, request.user.id, emoji);
  }

  private assertEmoji(emoji: ReactionEmoji) {
    if (!REACTION_EMOJIS.includes(emoji)) {
      throw new BadRequestException('지원하지 않는 반응입니다.');
    }
  }
}
