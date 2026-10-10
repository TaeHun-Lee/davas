import { IsUUID } from 'class-validator';

export class CreateWatchlistDto {
  @IsUUID()
  mediaId!: string;
}
