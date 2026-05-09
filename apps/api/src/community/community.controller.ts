import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CommunityService, type CommunityTab } from './community.service';

@ApiTags('Community')
@Controller('community')
export class CommunityController {
  constructor(private readonly communityService: CommunityService) {}

  @Get('dashboard')
  dashboard(@Query('tab') tab?: CommunityTab, @Query('q') q?: string, @Query('topic') topic?: string) {
    return this.communityService.getDashboard({ tab, q, topic });
  }

  @Get('diaries/:id')
  diary(@Param('id') id: string) {
    return this.communityService.getPublicDiary(id);
  }
}
