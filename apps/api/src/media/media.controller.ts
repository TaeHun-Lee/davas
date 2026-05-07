import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { MediaSearchQueryDto } from './dto/media-search-query.dto';
import { MediaSelectionDto } from './dto/media-selection.dto';
import { MediaSelectionService } from './media-selection.service';
import { MediaService } from './media.service';

@ApiTags('Media')
@Controller('media')
export class MediaController {
  constructor(
    private readonly mediaService: MediaService,
    private readonly mediaSelectionService: MediaSelectionService,
  ) {}

  @Get('search')
  search(@Query() query: MediaSearchQueryDto) {
    return this.mediaService.search(query);
  }

  @Post('selections')
  select(@Body() selection: MediaSelectionDto) {
    return this.mediaSelectionService.select(selection);
  }

  @Get('people/search')
  searchPeople(@Query() query: { q?: string; query?: string; page?: number; language?: string }) {
    return this.mediaService.searchPeople(query);
  }

  @Get('people/:personId/credits')
  findPersonCredits(@Param('personId') personId: string, @Query('language') language?: string) {
    return this.mediaService.findPersonCredits(personId, language ?? 'ko-KR');
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.mediaService.findDetail(id);
  }
}
