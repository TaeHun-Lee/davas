import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionOutboxEntity } from '../database/entities';
import { TransactionOutboxService } from './transaction-outbox.service';

@Module({
  imports: [TypeOrmModule.forFeature([TransactionOutboxEntity])],
  providers: [TransactionOutboxService],
  exports: [TransactionOutboxService],
})
export class OutboxModule {}
