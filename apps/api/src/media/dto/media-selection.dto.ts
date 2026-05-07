import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsEnum, IsOptional, IsString, Length } from 'class-validator';

export class MediaSelectionDto {
  @ApiProperty({ enum: ['TMDB'], example: 'TMDB' })
  @IsEnum(['TMDB'])
  externalProvider!: 'TMDB';

  @ApiProperty({ example: '157336' })
  @IsString()
  @Length(1, 80)
  externalId!: string;

  @ApiProperty({ enum: ['MOVIE', 'TV'], example: 'MOVIE' })
  @IsEnum(['MOVIE', 'TV'])
  mediaType!: 'MOVIE' | 'TV';

  @ApiProperty({ example: '인터스텔라' })
  @IsString()
  @Length(1, 300)
  title!: string;

  @ApiPropertyOptional({ example: 'Interstellar' })
  @IsOptional()
  @IsString()
  originalTitle?: string | null;

  @ApiPropertyOptional({ example: '우주를 향한 여정' })
  @IsOptional()
  @IsString()
  overview?: string | null;

  @ApiPropertyOptional({ example: 'https://image.tmdb.org/t/p/w500/poster.jpg' })
  @IsOptional()
  @IsString()
  posterUrl?: string | null;

  @ApiPropertyOptional({ example: 'https://image.tmdb.org/t/p/w780/backdrop.jpg' })
  @IsOptional()
  @IsString()
  backdropUrl?: string | null;

  @ApiPropertyOptional({ example: '2014-11-06' })
  @IsOptional()
  @IsString()
  releaseDate?: string | null;

  @ApiPropertyOptional({ type: [Number], example: [878, 18] })
  @IsOptional()
  @IsArray()
  genreIds?: number[];

  @ApiPropertyOptional({ example: 'US' })
  @IsOptional()
  @IsString()
  country?: string | null;
}
