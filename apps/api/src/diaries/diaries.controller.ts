import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { DiariesDashboardService } from './diaries-dashboard.service';
import { CreateDiaryDto } from './dto/create-diary.dto';
import { UpdateDiaryDto } from './dto/update-diary.dto';

@ApiTags('Diaries')
@Controller('diaries')
export class DiariesController {
  constructor(private readonly diariesDashboardService: DiariesDashboardService) {}

  @Post()
  create(@Body() dto: CreateDiaryDto) {
    return { message: 'create diary endpoint contract ready', diary: dto };
  }

  @Get('feed')
  feed() {
    return { items: [] };
  }

  @Get('me')
  myDiaries() {
    return { items: [] };
  }

  @Get('dashboard')
  dashboard() {
    return this.diariesDashboardService.getDashboard();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return { id, message: 'diary detail endpoint contract ready' };
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateDiaryDto) {
    return { id, message: 'update diary endpoint contract ready', diary: dto };
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return { id, message: 'delete diary endpoint contract ready' };
  }
}
