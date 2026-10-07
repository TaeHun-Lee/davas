import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileCleanupJobEntity, UserEntity } from '../database/entities';
import { OutboxModule } from '../outbox/outbox.module';
import { AccountDeletionPurgeService } from './account-deletion-purge.service';
import { FileCleanupService } from './file-cleanup.service';
import { UploadConcurrencyInterceptor } from './upload-concurrency.interceptor';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, FileCleanupJobEntity]), OutboxModule],
  controllers: [UsersController],
  providers: [
    UsersService,
    UploadConcurrencyInterceptor,
    FileCleanupService,
    AccountDeletionPurgeService,
  ],
  exports: [UsersService],
})
export class UsersModule {}
