import {
  MEDIA_TYPES,
  type MediaType,
  type RecordFilters,
  type ViewingMethod,
  VIEWING_METHODS,
} from '@davas/shared';
import { Type } from 'class-transformer';
import { IsIn, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export class DiaryListQueryDto implements RecordFilters {
  @IsOptional()
  @IsString()
  q?: string;

  @IsOptional()
  @IsIn(MEDIA_TYPES)
  mediaType?: MediaType;

  @IsOptional()
  @IsIn(VIEWING_METHODS)
  viewingMethod?: ViewingMethod;

  @IsOptional()
  @IsString()
  cursor?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(50)
  limit?: number;
}
