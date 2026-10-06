import {
  THEATER_FORMATS,
  WATCH_HEADLINE_MAX_LENGTH,
  WATCH_MEMORY_NOTE_MAX_LENGTH,
  WATCH_PHOTO_MAX_COUNT,
  WATCH_REVIEW_MAX_LENGTH,
  WATCH_SOURCE_KINDS,
  type TheaterFormat,
  type WatchParticipantStatus,
  type WatchSourceKind,
} from '@davas/shared';
import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayUnique,
  IsArray,
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

  @IsOptional()
  @IsIn(THEATER_FORMATS)
  theaterFormat?: TheaterFormat | null;

  @IsOptional()
  @IsString()
  @MaxLength(40)
  seatText?: string | null;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(2000)
  episodeWatched?: number | null;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(2000)
  episodeTotal?: number | null;

  @IsOptional()
  @IsBoolean()
  completed?: boolean;
}

/** 한줄평, 소감, spoiler and blind flags: one person's review, shared by create/update/reaction. */
class WatchReviewFieldsDto {
  @IsOptional()
  @IsIn(WATCH_RATINGS)
  rating?: number | null;

  @IsOptional()
  @IsString()
  @MaxLength(WATCH_HEADLINE_MAX_LENGTH)
  headline?: string | null;

  @IsOptional()
  @IsString()
  @MaxLength(WATCH_REVIEW_MAX_LENGTH)
  review?: string | null;

  @IsOptional()
  @IsBoolean()
  hasSpoiler?: boolean;

  @IsOptional()
  @IsBoolean()
  isBlind?: boolean;
}

export class CreateWatchEventDto extends WatchReviewFieldsDto {
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
  @IsString()
  @MaxLength(WATCH_MEMORY_NOTE_MAX_LENGTH)
  memoryNote?: string | null;

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(WATCH_PHOTO_MAX_COUNT)
  @ArrayUnique()
  @IsUUID('4', { each: true })
  photoIds?: string[];
}

export class UpdateWatchEventDto extends WatchReviewFieldsDto {
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
  @IsString()
  @MaxLength(WATCH_MEMORY_NOTE_MAX_LENGTH)
  memoryNote?: string | null;

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(WATCH_PHOTO_MAX_COUNT)
  @ArrayUnique()
  @IsUUID('4', { each: true })
  photoIds?: string[];
}

export class WatchParticipantResponseDto {
  @IsIn(['CONFIRMED', 'DECLINED'] satisfies WatchParticipantStatus[])
  status!: Extract<WatchParticipantStatus, 'CONFIRMED' | 'DECLINED'>;
}

export class SaveWatchReactionDto extends WatchReviewFieldsDto {}

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
