import { PASSWORD_MAX_LENGTH, PASSWORD_MIN_LENGTH } from '@davas/shared';
import { IsString, Length } from 'class-validator';

export class DeleteMeDto {
  @IsString()
  @Length(PASSWORD_MIN_LENGTH, PASSWORD_MAX_LENGTH)
  password!: string;
}
