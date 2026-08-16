import {
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  Length,
  Matches,
  Max,
  Min,
} from 'class-validator';

export class CreateSpaceDto {
  @IsString()
  @Length(1, 80)
  @Matches(/\S/)
  name!: string;

  @IsOptional()
  @IsInt()
  @Min(2)
  @Max(5)
  maxMembers?: number;
}

export class CreateSpaceInviteDto {
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(168)
  expiresInHours?: number;
}

export class TransferSpaceOwnershipDto {
  @IsUUID()
  newOwnerAccountId!: string;
}
