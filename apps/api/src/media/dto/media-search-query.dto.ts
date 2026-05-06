import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, Length } from 'class-validator';

export class MediaSearchQueryDto {
  @ApiPropertyOptional({ example: 'Arrival' })
  @IsString()
  @Length(1, 100)
  query!: string;

  @ApiPropertyOptional({ enum: ['movie', 'tv', 'multi'], default: 'multi' })
  @IsOptional()
  @IsEnum(['movie', 'tv', 'multi'])
  type: 'movie' | 'tv' | 'multi' = 'multi';
}
