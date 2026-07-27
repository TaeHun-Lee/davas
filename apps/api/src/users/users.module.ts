import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileCleanupJobEntity, UserEntity } from '../database/entities';
import { FileCleanupService } from './file-cleanup.service';
import { UploadConcurrencyInterceptor } from './upload-concurrency.interceptor';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, FileCleanupJobEntity])],
  controllers: [UsersController],
  providers: [UsersService, UploadConcurrencyInterceptor, FileCleanupService],
  exports: [UsersService],
})
export class UsersModule {}
