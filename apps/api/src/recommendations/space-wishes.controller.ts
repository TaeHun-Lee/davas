import { Controller, Delete, Get, Param, ParseUUIDPipe, Put, Query, Req } from '@nestjs/common';
import { WISH_MOODS, type WishMood } from '@davas/shared';
import { Transform } from 'class-transformer';
import { ArrayMaxSize, IsArray, IsIn, IsOptional, IsUUID } from 'class-validator';
import type { AuthenticatedRequest } from '../auth/jwt-cookie-auth.guard';
import { SpaceWishesService } from './space-wishes.service';

export class WishPickQueryDto {
  @IsOptional()
  @IsIn(WISH_MOODS)
  mood?: WishMood;

  // `exclude=a,b` lists titles already shown, so "다른 후보" moves on to the next one.
  @IsOptional()
  @Transform(({ value }) => (typeof value === 'string' ? value.split(',').filter(Boolean) : value))
  @IsArray()
  @ArrayMaxSize(50)
  @IsUUID('4', { each: true })
  exclude?: string[];
}

@Controller('v1/spaces/:spaceId/wishes')
export class SpaceWishesController {
  constructor(private readonly wishes: SpaceWishesService) {}

  @Get()
  list(@Req() request: AuthenticatedRequest, @Param('spaceId', ParseUUIDPipe) spaceId: string) {
    return this.wishes.list(spaceId, request.user.id);
  }

  @Get('pick')
  pick(
    @Req() request: AuthenticatedRequest,
    @Param('spaceId', ParseUUIDPipe) spaceId: string,
    @Query() query: WishPickQueryDto,
  ) {
    return this.wishes.pick(spaceId, request.user.id, query);
  }

  @Get(':mediaId')
  status(
    @Req() request: AuthenticatedRequest,
    @Param('spaceId', ParseUUIDPipe) spaceId: string,
    @Param('mediaId', ParseUUIDPipe) mediaId: string,
  ) {
    return this.wishes.status(spaceId, request.user.id, mediaId);
  }

  @Put(':mediaId')
  add(
    @Req() request: AuthenticatedRequest,
    @Param('spaceId', ParseUUIDPipe) spaceId: string,
    @Param('mediaId', ParseUUIDPipe) mediaId: string,
  ) {
    return this.wishes.add(spaceId, request.user.id, mediaId);
  }

  @Delete(':mediaId')
  remove(
    @Req() request: AuthenticatedRequest,
    @Param('spaceId', ParseUUIDPipe) spaceId: string,
    @Param('mediaId', ParseUUIDPipe) mediaId: string,
  ) {
    return this.wishes.remove(spaceId, request.user.id, mediaId);
  }
}
