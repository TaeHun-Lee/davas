import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { DIARY_VISIBILITIES, DiaryVisibility } from '@davas/shared';
import { Type } from 'class-transformer';
import { ArrayMinSize, IsArray, IsBoolean, IsDateString, IsEnum, IsNumber, IsOptional, IsString, IsUUID, Length, Max, MaxLength, Min, ValidateIf, ValidateNested } from 'class-validator';

export class DiaryCompanionDto {
  @IsOptional() @IsUUID() userId?: string;
  @IsString() @Length(1, 60) displayName!: string;
}

export class CreateDiaryDto {
  @ApiProperty({ example: 'clx-media-id' })
  @IsUUID()
  mediaId!: string;

  @ApiPropertyOptional({ example: 'https://image.tmdb.org/t/p/w500/poster.jpg' })
  @IsOptional()
  @IsString()
  mediaPosterUrl?: string | null;

  @ApiProperty({ example: '묵직한 여운이 남은 작품' })
  @IsString()
  @Length(1, 120)
  title!: string;

  @ApiPropertyOptional({ example: '장면마다 감정의 결이 좋았다.' })
  @IsOptional()
  @IsString()
  @MaxLength(10000)
  content = '';

  @ApiProperty({ example: '2026-05-05' })
  @IsDateString()
  watchedDate!: string;

  @ApiProperty({ minimum: 0, maximum: 5, example: 4.5 })
  @IsNumber({ maxDecimalPlaces: 1 })
  @Min(0)
  @Max(5)
  rating!: number;

  @ApiPropertyOptional({ enum: DIARY_VISIBILITIES, default: 'PRIVATE' })
  @IsOptional()
  @IsEnum(DIARY_VISIBILITIES)
  visibility: DiaryVisibility = 'PRIVATE';

  @ApiPropertyOptional({ default: false })
  @IsOptional()
  @IsBoolean()
  hasSpoiler = false;

  @ApiPropertyOptional({ example: ['극장', '재관람'], type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags: string[] = [];

  @ApiPropertyOptional() @IsOptional() @IsString() @MaxLength(160) watchedPlace?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() @MaxLength(80) mood?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() @MaxLength(1000) memoryNote?: string;
  @ApiPropertyOptional({ type: [DiaryCompanionDto] }) @IsOptional() @IsArray() @ValidateNested({ each: true }) @Type(() => DiaryCompanionDto) companions?: DiaryCompanionDto[];
  @ApiPropertyOptional({ type: [String] })
  @ValidateIf((dto: CreateDiaryDto) => dto.visibility === 'SELECTED')
  @IsArray()
  @ArrayMinSize(1)
  @IsUUID('4', { each: true })
  selectedUserIds?: string[];
}
