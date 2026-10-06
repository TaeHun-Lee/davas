import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { BadRequestException, Logger, ServiceUnavailableException } from '@nestjs/common';
import { ApiExceptionFilter } from './api-exception.filter';

function run(exception: unknown) {
  const sent: { status?: number; body?: unknown } = {};
  const response = {
    status(code: number) {
      sent.status = code;
      return this;
    },
    json(body: unknown) {
      sent.body = body;
      return this;
    },
  };
  const request = {
    method: 'POST',
    path: '/api/media/selections',
    url: '/api/media/selections?q=secret',
  };
  const host = {
    switchToHttp: () => ({ getResponse: () => response, getRequest: () => request }),
  };
  new ApiExceptionFilter().catch(exception, host as never);
  return sent;
}

describe('ApiExceptionFilter', () => {
  it('keeps the error shape and logs a rejected field so a client mismatch is visible', (t) => {
    const warn = t.mock.method(Logger.prototype, 'warn', () => undefined);
    const sent = run(
      new BadRequestException([
        'property title should not exist',
        'property country should not exist',
      ]),
    );
    assert.equal(sent.status, 400);
    assert.deepEqual(sent.body, {
      statusCode: 400,
      code: 'VALIDATION_ERROR',
      message: 'property title should not exist property country should not exist',
    });
    assert.equal(warn.mock.callCount(), 1);
    const line = String(warn.mock.calls[0].arguments[0]);
    assert.match(line, /^400 POST \/api\/media\/selections: property title should not exist/);
    assert.doesNotMatch(line, /secret/);
  });

  it('logs unexpected and upstream failures with the path, and answers with a generic message', (t) => {
    const error = t.mock.method(Logger.prototype, 'error', () => undefined);
    const crash = run(new TypeError('Cannot read properties of undefined'));
    assert.equal(crash.status, 500);
    assert.deepEqual(crash.body, {
      statusCode: 500,
      code: 'INTERNAL_ERROR',
      message: '서버에서 요청을 처리하지 못했어요.',
    });
    run(new ServiceUnavailableException('TMDB detail did not answer (TimeoutError)'));
    assert.equal(error.mock.callCount(), 2);
    assert.match(String(error.mock.calls[0].arguments[0]), /^500 POST \/api\/media\/selections$/);
    assert.match(String(error.mock.calls[0].arguments[1]), /TypeError: Cannot read properties/);
    assert.match(String(error.mock.calls[1].arguments[0]), /^503 POST/);
  });

  it('stays quiet for expected answers such as a missing record', (t) => {
    const warn = t.mock.method(Logger.prototype, 'warn', () => undefined);
    const error = t.mock.method(Logger.prototype, 'error', () => undefined);
    const sent = run(
      new BadRequestException({ statusCode: 400, code: 'WATCH_REACTION_EMPTY', message: '...' }),
    );
    assert.equal(sent.status, 400);
    assert.equal(warn.mock.callCount() + error.mock.callCount(), 0);
  });
});
