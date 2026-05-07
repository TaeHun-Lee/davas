import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { MediaSearchQueryDto } from './dto/media-search-query.dto';
import { MediaService } from './media.service';

@ApiTags('Media')
@Controller('media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Get('search')
  search(@Query() query: MediaSearchQueryDto) {
    return this.mediaService.search(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return { id, message: 'media detail endpoint contract ready' };
  }
}
