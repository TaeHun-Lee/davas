import { MEDIA_TYPES, type MediaSelectionInput, type MediaType } from '@davas/shared';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString, Length } from 'class-validator';

export class MediaSelectionDto implements MediaSelectionInput {
  @ApiProperty({ enum: ['TMDB'], example: 'TMDB' })
  @IsEnum(['TMDB'])
  externalProvider!: 'TMDB';

  @ApiProperty({ example: '157336' })
  @IsString()
  @Length(1, 80)
  externalId!: string;

  @ApiProperty({ enum: MEDIA_TYPES, example: 'MOVIE' })
  @IsEnum(MEDIA_TYPES)
  mediaType!: MediaType;
}
