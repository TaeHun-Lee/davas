import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { BadRequestException, ConflictException } from '@nestjs/common';
import { TransactionOutboxEntity } from '../database/entities';
import { TransactionOutboxService } from './transaction-outbox.service';

class FakeOutboxRepository {
  rows: TransactionOutboxEntity[] = [];
  create(input: Partial<TransactionOutboxEntity>) {
    return { id: `outbox-${this.rows.length + 1}`, ...input } as TransactionOutboxEntity;
  }
  async save(row: TransactionOutboxEntity) {
    this.rows.push(row);
    return row;
  }
  async findOne({ where }: { where: { idempotencyKey: string } }) {
    return this.rows.find((row) => row.idempotencyKey === where.idempotencyKey) ?? null;
  }
}

function manager(repository: FakeOutboxRepository) {
  return {
    getRepository(entity: unknown) {
      assert.equal(entity, TransactionOutboxEntity);
      return repository;
    },
  } as never;
}

describe('TransactionOutboxService', () => {
  it('stores one sanitized notification request for a repeated idempotency key', async () => {
    const repository = new FakeOutboxRepository();
    const service = new TransactionOutboxService();
    const input = {
      recipientId: 'user-1',
      actorId: 'user-2',
      notificationType: 'SPACE_INVITE',
      subjectId: 'space-1',
      idempotencyKey: 'space-invite:space-1:user-1',
    };
    const first = await service.enqueueNotification(manager(repository), input);
    const second = await service.enqueueNotification(manager(repository), input);

    assert.equal(repository.rows.length, 1);
    assert.equal(first.id, second.id);
    assert.deepEqual(repository.rows[0].payload, {
      recipientId: 'user-1',
      actorId: 'user-2',
      notificationType: 'SPACE_INVITE',
      subjectId: 'space-1',
    });
  });

  it('rejects sensitive payload fields and key reuse with a different event', async () => {
    const repository = new FakeOutboxRepository();
    const service = new TransactionOutboxService();
    for (const [index, payload] of [
      { reviewText: 'private review' },
      { nested: { rating: 5 } },
      { inviteToken: 'raw-token' },
      { emailAddress: 'private@example.com' },
    ].entries()) {
      await assert.rejects(
        () =>
          service.enqueue(manager(repository), {
            eventType: 'Unsafe',
            aggregateType: 'Diary',
            aggregateId: 'diary-1',
            idempotencyKey: `unsafe-${index}`,
            payload,
          }),
        BadRequestException,
      );
    }
    await service.enqueue(manager(repository), {
      eventType: 'Safe',
      aggregateType: 'Account',
      aggregateId: 'user-1',
      idempotencyKey: 'same-key',
      payload: { accountId: 'user-1' },
    });
    await assert.rejects(
      () =>
        service.enqueue(manager(repository), {
          eventType: 'Different',
          aggregateType: 'Account',
          aggregateId: 'user-1',
          idempotencyKey: 'same-key',
          payload: { accountId: 'user-1' },
        }),
      ConflictException,
    );
  });
});
