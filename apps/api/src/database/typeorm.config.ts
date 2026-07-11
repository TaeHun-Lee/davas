import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { CommentEntity, DiaryCompanionEntity, DiaryEntity, DiaryLikeEntity, DiaryReactionEntity, DiaryShareEntity, FriendshipEntity, InviteCodeEntity, InviteUseEntity, MediaEntity, MediaFavoriteEntity, MediaImageEntity, NotificationEntity, UserEntity, UserFollowEntity, WatchlistItemEntity } from './entities';
import { HighValueFlows1720670400000 } from './migrations/1720670400000-HighValueFlows';
import { BaseSchema1720670300000 } from './migrations/1720670300000-BaseSchema';

export function createTypeOrmOptions(): TypeOrmModuleOptions {
  return {
    type: 'postgres',
    url: process.env.DATABASE_URL,
    host: process.env.DB_HOST ?? 'localhost',
    port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 5432,
    username: process.env.DB_USERNAME ?? 'postgres',
    password: process.env.DB_PASSWORD ?? 'postgres',
    database: process.env.DB_DATABASE ?? 'davas',
    entities: [UserEntity, UserFollowEntity, FriendshipEntity, InviteCodeEntity, InviteUseEntity, MediaEntity, MediaImageEntity, MediaFavoriteEntity, WatchlistItemEntity, DiaryEntity, DiaryCompanionEntity, DiaryShareEntity, DiaryLikeEntity, DiaryReactionEntity, CommentEntity, NotificationEntity],
    migrations: [BaseSchema1720670300000, HighValueFlows1720670400000],
    synchronize: process.env.TYPEORM_SYNC === 'true',
    logging: process.env.TYPEORM_LOGGING === 'true',
  };
}
