import {
  SPACE_INVITE_MAX_HOURS,
  SPACE_MAX_MEMBERS,
  SPACE_MIN_MEMBERS,
  SPACE_NAME_MAX_LENGTH,
} from '@davas/shared';
import { IsInt, IsOptional, IsString, IsUUID, Length, Matches, Max, Min } from 'class-validator';

export class CreateSpaceDto {
  @IsString()
  @Length(1, SPACE_NAME_MAX_LENGTH)
  @Matches(/\S/)
  name!: string;

  @IsOptional()
  @IsInt()
  @Min(SPACE_MIN_MEMBERS)
  @Max(SPACE_MAX_MEMBERS)
  maxMembers?: number;
}

export class RenameSpaceDto {
  @IsString()
  @Length(1, SPACE_NAME_MAX_LENGTH)
  @Matches(/\S/)
  name!: string;
}

export class CreateSpaceInviteDto {
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(SPACE_INVITE_MAX_HOURS)
  expiresInHours?: number;
}

export class TransferSpaceOwnershipDto {
  @IsUUID()
  newOwnerAccountId!: string;
}
