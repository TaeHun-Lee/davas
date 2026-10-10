import {
  NICKNAME_MAX_LENGTH,
  NICKNAME_MIN_LENGTH,
  PASSWORD_MAX_LENGTH,
  PASSWORD_MIN_LENGTH,
} from '@davas/shared';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Equals, IsBoolean, IsEmail, IsOptional, IsString, Length } from 'class-validator';

export class SignupDto {
  @ApiPropertyOptional({ example: 'DAVAS-ABCD1234' })
  @IsOptional()
  @IsString()
  @Length(4, 32)
  inviteCode?: string;

  @ApiPropertyOptional() @IsOptional() @IsString() @Length(20, 200) friendInviteToken?: string;

  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: 'davas_user' })
  @IsString()
  @Length(NICKNAME_MIN_LENGTH, NICKNAME_MAX_LENGTH)
  nickname!: string;

  @ApiProperty({ minLength: PASSWORD_MIN_LENGTH })
  @IsString()
  @Length(PASSWORD_MIN_LENGTH, PASSWORD_MAX_LENGTH)
  password!: string;

  @ApiProperty() @IsBoolean() @Equals(true) termsAccepted?: true;
  @ApiProperty() @IsString() @Length(1, 40) termsVersion?: string;
  @ApiProperty() @IsString() @Length(1, 40) privacyVersion?: string;
}
