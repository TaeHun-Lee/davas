import { Module } from '@nestjs/common';
import { DiariesDashboardService } from './diaries-dashboard.service';
import { DiariesController } from './diaries.controller';

@Module({ controllers: [DiariesController], providers: [DiariesDashboardService] })
export class DiariesModule {}
