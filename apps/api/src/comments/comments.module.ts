import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { CommentEntity } from '../database/entities/comment.entity';
import { DiaryEntity } from '../database/entities/diary.entity';
import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';

@Module({
  imports: [AuthModule, TypeOrmModule.forFeature([CommentEntity, DiaryEntity])],
  controllers: [CommentsController],
  providers: [CommentsService],
})
export class CommentsModule {}
