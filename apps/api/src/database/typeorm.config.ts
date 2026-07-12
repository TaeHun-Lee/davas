import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { CommentEntity, DiaryCompanionEntity, DiaryEntity, DiaryLikeEntity, DiaryReactionEntity, DiaryShareEntity, FileCleanupJobEntity, FriendInviteEntity, FriendshipEntity, InviteCodeEntity, InviteUseEntity, MediaEntity, MediaFavoriteEntity, MediaImageEntity, NotificationEntity, UserConsentEntity, UserEntity, UserFollowEntity, WatchlistItemEntity } from './entities';
import { HighValueFlows1720670400000 } from './migrations/1720670400000-HighValueFlows';
import { BaseSchema1720670300000 } from './migrations/1720670300000-BaseSchema';
import { CoreRecordContract1720670500000 } from './migrations/1720670500000-CoreRecordContract';
import { FriendInvitesAndConsents1720670600000 } from './migrations/1720670600000-FriendInvitesAndConsents';

export function createTypeOrmOptions(): TypeOrmModuleOptions {
  return {
    type: 'postgres',
    url: process.env.DATABASE_URL,
    host: process.env.DB_HOST ?? 'localhost',
    port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 5432,
    username: process.env.DB_USERNAME ?? 'postgres',
    password: process.env.DB_PASSWORD ?? 'postgres',
    database: process.env.DB_DATABASE ?? 'davas',
    entities: [UserEntity, UserConsentEntity, FileCleanupJobEntity, UserFollowEntity, FriendshipEntity, FriendInviteEntity, InviteCodeEntity, InviteUseEntity, MediaEntity, MediaImageEntity, MediaFavoriteEntity, WatchlistItemEntity, DiaryEntity, DiaryCompanionEntity, DiaryShareEntity, DiaryLikeEntity, DiaryReactionEntity, CommentEntity, NotificationEntity],
    migrations: [BaseSchema1720670300000, HighValueFlows1720670400000, CoreRecordContract1720670500000, FriendInvitesAndConsents1720670600000],
    synchronize: process.env.TYPEORM_SYNC === 'true',
    logging: process.env.TYPEORM_LOGGING === 'true',
  };
}
