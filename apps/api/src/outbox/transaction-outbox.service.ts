import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { TransactionOutboxEntity } from '../database/entities';

type OutboxInput = {
  eventType: string;
  aggregateType: string;
  aggregateId: string;
  idempotencyKey: string;
  payload: Record<string, unknown>;
};

type NotificationRequestInput = {
  recipientId: string;
  actorId?: string;
  notificationType: string;
  subjectId: string;
  idempotencyKey: string;
};

const SENSITIVE_PAYLOAD_KEY =
  /(review|rating|location|place|token|preference|hidden|password|secret|credential|email|phone|address)/i;

@Injectable()
export class TransactionOutboxService {
  async enqueue(manager: EntityManager, input: OutboxInput) {
    this.assertSafePayload(input.payload);
    const outbox = manager.getRepository(TransactionOutboxEntity);
    const existing = await outbox.findOne({
      where: { idempotencyKey: input.idempotencyKey },
    });
    if (existing) {
      if (
        existing.eventType !== input.eventType ||
        existing.aggregateType !== input.aggregateType ||
        existing.aggregateId !== input.aggregateId ||
        JSON.stringify(existing.payload) !== JSON.stringify(input.payload)
      ) {
        throw new ConflictException('동일한 멱등성 키에 다른 이벤트를 사용할 수 없습니다.');
      }
      return existing;
    }

    try {
      return await outbox.save(
        outbox.create({
          ...input,
          status: 'PENDING',
          attempts: 0,
          availableAt: new Date(),
          processedAt: null,
          lastError: null,
        }),
      );
    } catch (error) {
      if ((error as { code?: string }).code !== '23505') throw error;
      const concurrent = await outbox.findOne({
        where: { idempotencyKey: input.idempotencyKey },
      });
      if (!concurrent) throw error;
      return concurrent;
    }
  }

  enqueueNotification(manager: EntityManager, input: NotificationRequestInput) {
    return this.enqueue(manager, {
      eventType: 'NotificationRequested',
      aggregateType: 'Account',
      aggregateId: input.recipientId,
      idempotencyKey: input.idempotencyKey,
      payload: {
        recipientId: input.recipientId,
        actorId: input.actorId ?? null,
        notificationType: input.notificationType,
        subjectId: input.subjectId,
      },
    });
  }

  private assertSafePayload(payload: Record<string, unknown>) {
    const visit = (value: unknown): void => {
      if (Array.isArray(value)) {
        value.forEach(visit);
        return;
      }
      if (!value || typeof value !== 'object') return;
      for (const [key, nested] of Object.entries(value as Record<string, unknown>)) {
        if (SENSITIVE_PAYLOAD_KEY.test(key)) {
          throw new BadRequestException(`outbox payload에 민감 필드(${key})를 포함할 수 없습니다.`);
        }
        visit(nested);
      }
    };
    visit(payload);
  }
}
