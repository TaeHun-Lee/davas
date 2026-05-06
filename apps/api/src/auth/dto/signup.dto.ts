import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Length } from 'class-validator';

export class SignupDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: 'davas_user' })
  @IsString()
  @Length(2, 30)
  nickname!: string;

  @ApiProperty({ minLength: 8 })
  @IsString()
  @Length(8, 100)
  password!: string;
}
