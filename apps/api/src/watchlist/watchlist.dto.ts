import { WATCHLIST_PRIORITIES, WATCHLIST_STATUSES, type WatchlistPriority, type WatchlistStatus } from '@davas/shared';
import { IsIn, IsOptional, IsString, IsUUID, MaxLength } from 'class-validator';

export class CreateWatchlistDto { @IsUUID() mediaId!: string; }
export class ListWatchlistQueryDto { @IsOptional() @IsIn(WATCHLIST_STATUSES) status?: WatchlistStatus; }
export class UpdateWatchlistDto {
  @IsOptional() @IsIn(WATCHLIST_PRIORITIES) priority?: WatchlistPriority;
  @IsOptional() @IsString() @MaxLength(500) memo?: string;
  @IsOptional() @IsString() @MaxLength(120) plannedWith?: string;
  @IsOptional() @IsIn(WATCHLIST_STATUSES) status?: WatchlistStatus;
}
