import { MediaType, ViewingMethod, MEDIA_TYPES, VIEWING_METHODS } from '@davas/shared';
import { Type } from 'class-transformer';
import { IsIn, IsInt, IsOptional, IsString, IsUUID, Max, Min } from 'class-validator';

export class DiaryListQueryDto {
  @IsOptional() @IsString() q?: string;
  @IsOptional() @IsUUID() mediaId?: string;
  @IsOptional() @IsIn(MEDIA_TYPES) mediaType?: MediaType;
  @IsOptional() @IsIn(VIEWING_METHODS) viewingMethod?: ViewingMethod;
  @IsOptional() @IsString() cursor?: string;
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) @Max(50) limit?: number;
}
