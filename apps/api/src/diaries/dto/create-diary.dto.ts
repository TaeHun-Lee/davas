import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { DiaryVisibility } from '@davas/shared';
import { IsArray, IsBoolean, IsDateString, IsEnum, IsNumber, IsOptional, IsString, Length, Max, MaxLength, Min } from 'class-validator';

export class CreateDiaryDto {
  @ApiProperty({ example: 'clx-media-id' })
  @IsString()
  mediaId!: string;

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

  @ApiPropertyOptional({ enum: ['PUBLIC', 'PRIVATE'], default: 'PUBLIC' })
  @IsOptional()
  @IsEnum(['PUBLIC', 'PRIVATE'])
  visibility: DiaryVisibility = 'PUBLIC';

  @ApiPropertyOptional({ default: false })
  @IsOptional()
  @IsBoolean()
  hasSpoiler = false;

  @ApiPropertyOptional({ example: ['극장', '재관람'], type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags: string[] = [];
}
