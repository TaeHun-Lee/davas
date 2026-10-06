import {
  CORE_DIARY_VISIBILITIES,
  type CoreDiaryVisibility,
  type RecordUpdateInput,
  type ViewingMethod,
  VIEWING_METHODS,
} from '@davas/shared';
import {
  IsBoolean,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  Matches,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

export class UpdateDiaryDto implements RecordUpdateInput {
  [key: string]: unknown;

  @IsOptional()
  @IsUUID()
  mediaId?: string;

  @IsOptional()
  @IsIn(VIEWING_METHODS)
  viewingMethod?: ViewingMethod;

  @IsOptional()
  @Matches(/^\d{4}-\d{2}-\d{2}$/)
  watchedDate?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(5)
  rating?: number | null;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  content?: string;

  @IsOptional()
  @IsBoolean()
  hasSpoiler?: boolean;

  @IsOptional()
  @IsIn(CORE_DIARY_VISIBILITIES)
  visibility?: CoreDiaryVisibility;
}
