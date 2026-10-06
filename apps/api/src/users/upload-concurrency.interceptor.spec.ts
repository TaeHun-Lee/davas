import assert from 'node:assert/strict';
import type { ExecutionContext } from '@nestjs/common';
import type { CallHandler } from '@nestjs/common';
import { describe, it } from 'node:test';
import { Subject } from 'rxjs';
import { UploadConcurrencyInterceptor } from './upload-concurrency.interceptor';

function contextFor(userId: string): ExecutionContext {
  return {
    switchToHttp: () => ({
      getRequest: () => ({ user: { id: userId }, ip: '127.0.0.1' }),
    }),
  } as ExecutionContext;
}

describe('UploadConcurrencyInterceptor', () => {
  it('rejects the third concurrent upload for the same account', () => {
    const interceptor = new UploadConcurrencyInterceptor();
    const first = new Subject<unknown>();
    const second = new Subject<unknown>();
    const context = contextFor('user-1');

    interceptor.intercept(context, { handle: () => first } as CallHandler).subscribe();
    interceptor.intercept(context, { handle: () => second } as CallHandler).subscribe();

    assert.throws(
      () =>
        interceptor.intercept(context, {
          handle: () => new Subject<unknown>(),
        } as CallHandler),
      /동시에 처리할 수 있는 업로드 수/,
    );
  });

  it('returns permits after completion and error', () => {
    const interceptor = new UploadConcurrencyInterceptor();
    const first = new Subject<unknown>();
    const second = new Subject<unknown>();
    const context = contextFor('user-1');

    interceptor.intercept(context, { handle: () => first } as CallHandler).subscribe();
    interceptor
      .intercept(context, { handle: () => second } as CallHandler)
      .subscribe({ error: () => undefined });

    first.complete();
    second.error(new Error('upload failed'));

    assert.doesNotThrow(() =>
      interceptor.intercept(context, {
        handle: () => new Subject<unknown>(),
      } as CallHandler),
    );
  });

  it('tracks different accounts independently', () => {
    const interceptor = new UploadConcurrencyInterceptor();
    const streams = [new Subject(), new Subject()];

    streams.forEach((stream) =>
      interceptor
        .intercept(contextFor('user-1'), { handle: () => stream } as CallHandler)
        .subscribe(),
    );

    assert.doesNotThrow(() =>
      interceptor.intercept(contextFor('user-2'), {
        handle: () => new Subject<unknown>(),
      } as CallHandler),
    );
  });
});
