import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, Matches } from 'class-validator';

export class AvailabilityQueryDto {
  @ApiPropertyOptional({ example: 'KR', default: 'KR' })
  @IsOptional()
  @Matches(/^[A-Za-z]{2}$/)
  region?: string;
}
