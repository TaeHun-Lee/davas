import { IsEmail, IsString, Length } from 'class-validator';

export class CancelDeletionDto {
  @IsEmail()
  email!: string;

  @IsString()
  @Length(8, 100)
  password!: string;
}
