import { IsString, Length } from 'class-validator';
export class DeleteMeDto { @IsString() @Length(8, 100) password!: string; }
