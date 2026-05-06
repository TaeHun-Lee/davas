import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { MediaSearchQueryDto } from './dto/media-search-query.dto';

@ApiTags('Media')
@Controller('media')
export class MediaController {
  @Get('search')
  search(@Query() query: MediaSearchQueryDto) {
    return { items: [], query: query.query, type: query.type };
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return { id, message: 'media detail endpoint contract ready' };
  }
}
