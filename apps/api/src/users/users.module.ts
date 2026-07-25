import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { parseJwtExpirySeconds } from '../auth/jwt-config';
import {
  FileCleanupJobEntity,
  UserEntity,
} from '../database/entities';
import { FileCleanupService } from './file-cleanup.service';
import { UploadConcurrencyInterceptor } from './upload-concurrency.interceptor';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([UserEntity, FileCleanupJobEntity]),
    JwtModule.register({
      secret: process.env.JWT_SECRET ?? 'dev-secret-change-me',
      signOptions: {
        expiresIn: parseJwtExpirySeconds(process.env.JWT_ACCESS_EXPIRES_IN),
      },
    }),
  ],
  controllers: [UsersController],
  providers: [
    UsersService,
    UploadConcurrencyInterceptor,
    FileCleanupService,
  ],
  exports: [UsersService],
})
export class UsersModule {}
