import {
  WATCH_SOURCE_KINDS,
  type WatchParticipantStatus,
  type WatchSourceKind,
} from '@davas/shared';
import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayUnique,
  IsArray,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  Matches,
  Max,
  MaxLength,
  Min,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
const WATCH_RATINGS = [0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5];

export class WatchSourceDto {
  @IsIn(WATCH_SOURCE_KINDS)
  kind!: WatchSourceKind;

  @IsOptional()
  @IsString()
  @MaxLength(80)
  providerName?: string | null;

  @IsOptional()
  @IsString()
  @MaxLength(160)
  placeText?: string | null;
}

export class CreateWatchEventDto {
  @IsUUID()
  mediaId!: string;

  @Matches(/^\d{4}-\d{2}-\d{2}$/)
  watchedDate!: string;

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(5)
  @ArrayUnique()
  @IsUUID('4', { each: true })
  spaceIds?: string[];

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(4)
  @ArrayUnique()
  @IsUUID('4', { each: true })
  participantAccountIds?: string[];

  @IsOptional()
  @ValidateNested()
  @Type(() => WatchSourceDto)
  source?: WatchSourceDto;

  @IsOptional()
  @IsIn(WATCH_RATINGS)
  rating?: number | null;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  review?: string | null;
}

export class UpdateWatchEventDto {
  @IsOptional()
  @IsUUID()
  mediaId?: string;

  @IsOptional()
  @Matches(/^\d{4}-\d{2}-\d{2}$/)
  watchedDate?: string;

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(5)
  @ArrayUnique()
  @IsUUID('4', { each: true })
  spaceIds?: string[];

  @ValidateIf((_, value) => value !== undefined && value !== null)
  @ValidateNested()
  @Type(() => WatchSourceDto)
  source?: WatchSourceDto | null;

  @IsOptional()
  @IsIn(WATCH_RATINGS)
  rating?: number | null;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  review?: string | null;
}

export class WatchParticipantResponseDto {
  @IsIn(['CONFIRMED', 'DECLINED'] satisfies WatchParticipantStatus[])
  status!: Extract<WatchParticipantStatus, 'CONFIRMED' | 'DECLINED'>;
}

export class SaveWatchReactionDto {
  @IsOptional()
  @IsIn(WATCH_RATINGS)
  rating?: number | null;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  review?: string | null;
}

export class WatchTimelineQueryDto {
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
