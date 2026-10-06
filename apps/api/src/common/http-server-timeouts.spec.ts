import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { configureHttpServerTimeouts } from './http-server-timeouts';

describe('configureHttpServerTimeouts', () => {
  it('bounds body, header, keep-alive, and per-socket request resources', () => {
    const server = {
      requestTimeout: 0,
      headersTimeout: 0,
      keepAliveTimeout: 0,
      maxRequestsPerSocket: 0,
    };

    configureHttpServerTimeouts(server);

    assert.deepEqual(server, {
      requestTimeout: 15_000,
      headersTimeout: 10_000,
      keepAliveTimeout: 5_000,
      maxRequestsPerSocket: 100,
    });
  });
});
