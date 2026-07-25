import { IsInt, IsISO8601, IsOptional, IsString, Length, Max, Min } from 'class-validator';
export class ValidateInviteDto { @IsString() @Length(4, 32) code!: string; }
export class CreateInviteDto { @IsOptional() @IsInt() @Min(1) @Max(100) maxUses?: number; @IsOptional() @IsISO8601() expiresAt?: string; }
