import { DEFAULT_REGION } from '@davas/shared';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, Matches } from 'class-validator';

export class AvailabilityQueryDto {
  @ApiPropertyOptional({ example: DEFAULT_REGION, default: DEFAULT_REGION })
  @IsOptional()
  @Matches(/^[A-Za-z]{2}$/)
  region?: string;
}
