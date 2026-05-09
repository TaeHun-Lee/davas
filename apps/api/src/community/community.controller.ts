import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CommunityService, type CommunityTab } from './community.service';

@ApiTags('Community')
@Controller('community')
export class CommunityController {
  constructor(private readonly communityService: CommunityService) {}

  @Get('dashboard')
  dashboard(@Query('tab') tab?: CommunityTab, @Query('q') q?: string) {
    return this.communityService.getDashboard({ tab, q });
  }
}
