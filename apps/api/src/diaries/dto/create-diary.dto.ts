import {
  CORE_DIARY_VISIBILITIES,
  type CoreDiaryVisibility,
  type RecordCreateInput,
  type ViewingMethod,
  VIEWING_METHODS,
} from '@davas/shared';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
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

export class CreateDiaryDto implements RecordCreateInput {
  [key: string]: unknown;

  @ApiProperty()
  @IsUUID()
  mediaId!: string;

  @ApiProperty({ enum: VIEWING_METHODS })
  @IsIn(VIEWING_METHODS)
  viewingMethod!: ViewingMethod;

  @ApiProperty({ example: '2026-07-12' })
  @Matches(/^\d{4}-\d{2}-\d{2}$/)
  watchedDate!: string;

  @ApiPropertyOptional({ minimum: 1, maximum: 5, nullable: true })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(5)
  rating?: number | null;

  @ApiPropertyOptional({ maxLength: 500 })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  content = '';

  @ApiPropertyOptional({ default: false })
  @IsOptional()
  @IsBoolean()
  hasSpoiler = false;

  @ApiPropertyOptional({ enum: CORE_DIARY_VISIBILITIES, default: 'FRIENDS' })
  @IsOptional()
  @IsIn(CORE_DIARY_VISIBILITIES)
  visibility: CoreDiaryVisibility = 'FRIENDS';

  @ApiProperty()
  @IsUUID('4')
  clientRequestId!: string;

  @ApiPropertyOptional({ default: false })
  @IsOptional()
  @IsBoolean()
  allowDuplicate?: boolean;
}
