import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { CommentEntity, DiaryEntity, DiaryLikeEntity, MediaEntity, MediaFavoriteEntity, MediaImageEntity, NotificationEntity, UserEntity, UserFollowEntity } from './entities';

export function createTypeOrmOptions(): TypeOrmModuleOptions {
  return {
    type: 'postgres',
    url: process.env.DATABASE_URL,
    host: process.env.DB_HOST ?? 'localhost',
    port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 5432,
    username: process.env.DB_USERNAME ?? 'postgres',
    password: process.env.DB_PASSWORD ?? 'postgres',
    database: process.env.DB_DATABASE ?? 'davas',
    entities: [UserEntity, UserFollowEntity, MediaEntity, MediaImageEntity, MediaFavoriteEntity, DiaryEntity, DiaryLikeEntity, CommentEntity, NotificationEntity],
    synchronize: process.env.TYPEORM_SYNC === 'true',
    logging: process.env.TYPEORM_LOGGING === 'true',
  };
}
