import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Length } from 'class-validator';

export class ChangePasswordDto {
  @ApiProperty()
  @IsString()
  @Length(8, 100)
  currentPassword!: string;

  @ApiProperty({ minLength: 8 })
  @IsString()
  @Length(8, 100)
  newPassword!: string;
}

/** Creating a recovery code asks for the password again, as deleting the account does. */
export class RecoveryCodeDto {
  @ApiProperty()
  @IsString()
  @Length(8, 100)
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

  @ApiProperty({ minLength: 8 })
  @IsString()
  @Length(8, 100)
  newPassword!: string;
}
