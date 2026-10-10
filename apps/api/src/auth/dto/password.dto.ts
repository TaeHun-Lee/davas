import { PASSWORD_MAX_LENGTH, PASSWORD_MIN_LENGTH } from '@davas/shared';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Length } from 'class-validator';

export class ChangePasswordDto {
  @ApiProperty()
  @IsString()
  @Length(PASSWORD_MIN_LENGTH, PASSWORD_MAX_LENGTH)
  currentPassword!: string;

  @ApiProperty({ minLength: PASSWORD_MIN_LENGTH })
  @IsString()
  @Length(PASSWORD_MIN_LENGTH, PASSWORD_MAX_LENGTH)
  newPassword!: string;
}

/** Creating a recovery code asks for the password again, as deleting the account does. */
export class RecoveryCodeDto {
  @ApiProperty()
  @IsString()
  @Length(PASSWORD_MIN_LENGTH, PASSWORD_MAX_LENGTH)
  password!: string;
}

export class ResetPasswordDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  email!: string;

  /** `ABCD-EFGH-JKMN`; dashes, spaces and case do not matter. */
  @ApiProperty({ example: 'ABCD-EFGH-JKMN' })
  @IsString()
  @Length(12, 40)
  recoveryCode!: string;

  @ApiProperty({ minLength: PASSWORD_MIN_LENGTH })
  @IsString()
  @Length(PASSWORD_MIN_LENGTH, PASSWORD_MAX_LENGTH)
  newPassword!: string;
}
