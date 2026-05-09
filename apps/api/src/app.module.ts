import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { CommentsModule } from './comments/comments.module';
import { CommunityModule } from './community/community.module';
import { createTypeOrmOptions } from './database/typeorm.config';
import { DiariesModule } from './diaries/diaries.module';
import { HealthController } from './health.controller';
import { MediaModule } from './media/media.module';
import { RecommendationsModule } from './recommendations/recommendations.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({ useFactory: createTypeOrmOptions }),
    AuthModule,
    UsersModule,
    MediaModule,
    RecommendationsModule,
    DiariesModule,
    CommentsModule,
    CommunityModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}
