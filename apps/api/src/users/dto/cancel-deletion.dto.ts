import { PASSWORD_MAX_LENGTH, PASSWORD_MIN_LENGTH } from '@davas/shared';
import { IsEmail, IsString, Length } from 'class-validator';

export class CancelDeletionDto {
  @IsEmail()
  email!: string;

  @IsString()
  @Length(PASSWORD_MIN_LENGTH, PASSWORD_MAX_LENGTH)
  password!: string;
}
