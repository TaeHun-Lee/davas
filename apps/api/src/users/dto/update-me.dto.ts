import { NICKNAME_MAX_LENGTH, NICKNAME_MIN_LENGTH, OTT_SERVICE_KEYS } from '@davas/shared';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { ArrayMaxSize, IsArray, IsIn, IsOptional, IsString, Length } from 'class-validator';

/** What 설정 changes: the nickname (the sign-up rule) and the OTT services I subscribe to. */
export class UpdateMeDto {
  @ApiPropertyOptional({ example: 'davas_user' })
  @IsOptional()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString()
  @Length(NICKNAME_MIN_LENGTH, NICKNAME_MAX_LENGTH)
  nickname?: string;

  @ApiPropertyOptional({ enum: OTT_SERVICE_KEYS, isArray: true })
  @IsOptional()
  @IsArray()
  @ArrayMaxSize(OTT_SERVICE_KEYS.length * 2)
  @IsIn(OTT_SERVICE_KEYS, { each: true })
  ottServices?: string[];
}
