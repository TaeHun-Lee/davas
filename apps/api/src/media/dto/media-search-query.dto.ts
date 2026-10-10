import {
  DEFAULT_LANGUAGE,
  DEFAULT_REGION,
  MEDIA_SEARCH_TYPES,
  type MediaSearchRequest,
  type MediaSearchType,
} from '@davas/shared';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString, Length, Max, Min } from 'class-validator';

export class MediaSearchQueryDto implements MediaSearchRequest {
  @ApiPropertyOptional({
    example: '인터스텔라',
    description: 'Korean or English media search query',
  })
  @IsOptional()
  @IsString()
  @Length(1, 100)
  query?: string;

  @ApiPropertyOptional({
    example: '인터스텔라',
    description: 'Alias for query',
  })
  @IsOptional()
  @IsString()
  q?: string;

  @ApiPropertyOptional({ enum: MEDIA_SEARCH_TYPES, default: 'multi' })
  @IsOptional()
  @IsEnum(MEDIA_SEARCH_TYPES)
  type?: MediaSearchType = 'multi';

  @ApiPropertyOptional({ default: 1, minimum: 1, maximum: 500 })
  @IsOptional()
  @Transform(({ value }) => Number(value ?? 1))
  @IsInt()
  @Min(1)
  @Max(500)
  page?: number = 1;

  @ApiPropertyOptional({ default: DEFAULT_LANGUAGE })
  @IsOptional()
  @IsString()
  language?: string = DEFAULT_LANGUAGE;

  @ApiPropertyOptional({ default: DEFAULT_REGION })
  @IsOptional()
  @IsString()
  region?: string = DEFAULT_REGION;
}
