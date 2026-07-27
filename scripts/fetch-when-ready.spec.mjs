import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import test from 'node:test';
import { fetchWhenReady } from './fetch-when-ready.mjs';

function listen(server) {
  return new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(0, '127.0.0.1', () => {
      const address = server.address();
      if (!address || typeof address === 'string') {
        reject(new Error('Test server did not expose a TCP port.'));
        return;
      }
      resolve(address.port);
    });
  });
}

function close(server) {
  server.closeAllConnections?.();
  return new Promise((resolve) => server.close(resolve));
}

test('fetchWhenReady aborts a stalled attempt and retries the request', async () => {
  let requests = 0;
  const server = createServer((_request, response) => {
    requests += 1;
    if (requests === 1) return;
    response.end('ready');
  });

  const port = await listen(server);
  try {
    const response = await fetchWhenReady(`http://127.0.0.1:${port}/`, {
      attempts: 2,
      requestTimeoutMs: 500,
      retryDelayMs: 0,
    });

    assert.equal(response.status, 200);
    assert.equal(await response.text(), 'ready');
    assert.equal(requests, 2);
  } finally {
    await close(server);
  }
});

test('fetchWhenReady rejects after the bounded number of stalled attempts', async () => {
  let requests = 0;
  const server = createServer(() => {
    requests += 1;
  });

  const port = await listen(server);
  const startedAt = Date.now();
  try {
    await assert.rejects(
      fetchWhenReady(`http://127.0.0.1:${port}/`, {
        attempts: 2,
        requestTimeoutMs: 50,
        retryDelayMs: 0,
      }),
      (error) => error?.name === 'TimeoutError',
    );
    assert.equal(requests, 2);
    assert.ok(Date.now() - startedAt < 2_000, 'stalled requests must fail within a bounded time');
  } finally {
    await close(server);
  }
});
