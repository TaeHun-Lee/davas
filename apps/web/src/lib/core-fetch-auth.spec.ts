import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { afterEach, beforeEach, describe, it } from 'node:test';
import { CoreApiError, coreFetch } from './api/core';

const originalFetch = globalThis.fetch;
const originalWindow = Object.getOwnPropertyDescriptor(globalThis, 'window');
const originalLocation = Object.getOwnPropertyDescriptor(globalThis, 'location');
const originalSessionStorage = Object.getOwnPropertyDescriptor(globalThis, 'sessionStorage');

function restoreProperty(
  name: 'window' | 'location' | 'sessionStorage',
  descriptor?: PropertyDescriptor,
) {
  if (descriptor) Object.defineProperty(globalThis, name, descriptor);
  else delete (globalThis as Record<string, unknown>)[name];
}

describe('coreFetch auth boundary', () => {
  beforeEach(() => {
    process.env.NEXT_PUBLIC_API_BASE_URL = 'http://api.test';
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
    delete process.env.NEXT_PUBLIC_API_BASE_URL;
    restoreProperty('window', originalWindow);
    restoreProperty('location', originalLocation);
    restoreProperty('sessionStorage', originalSessionStorage);
  });

  it('throws an anonymous 401 without logout, draft purge, or redirect at an optional-auth boundary', async () => {
    const requests: string[] = [];
    const redirects: string[] = [];
    const removedDrafts: string[] = [];

    Object.defineProperty(globalThis, 'window', { configurable: true, value: {} });
    Object.defineProperty(globalThis, 'location', {
      configurable: true,
      value: {
        pathname: '/friends/invite/invite-token',
        search: '',
        assign: (value: string) => redirects.push(value),
      },
    });
    Object.defineProperty(globalThis, 'sessionStorage', {
      configurable: true,
      value: {
        length: 1,
        key: () => 'davas:draft:user:create:new',
        removeItem: (key: string) => removedDrafts.push(key),
      },
    });
    globalThis.fetch = async (input) => {
      requests.push(String(input));
      return new Response(
        JSON.stringify({ statusCode: 401, code: 'UNAUTHORIZED', message: '로그인이 필요합니다.' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } },
      );
    };

    await assert.rejects(
      () => coreFetch('/auth/me', {}, { auth: 'optional' }),
      (error: unknown) => error instanceof CoreApiError && error.status === 401,
    );

    assert.deepEqual(requests, ['http://api.test/auth/me']);
    assert.deepEqual(redirects, []);
    assert.deepEqual(removedDrafts, []);
  });

  it('purges drafts and redirects after required-auth recovery even when logout returns an error', async () => {
    const requests: string[] = [];
    const redirects: string[] = [];
    const removedDrafts: string[] = [];

    Object.defineProperty(globalThis, 'window', { configurable: true, value: {} });
    Object.defineProperty(globalThis, 'location', {
      configurable: true,
      value: {
        pathname: '/settings',
        search: '',
        assign: (value: string) => redirects.push(value),
      },
    });
    Object.defineProperty(globalThis, 'sessionStorage', {
      configurable: true,
      value: {
        length: 1,
        key: () => 'davas:draft:user:create:new',
        removeItem: (key: string) => removedDrafts.push(key),
      },
    });
    globalThis.fetch = async (input) => {
      requests.push(String(input));
      if (requests.length === 1) {
        return new Response(
          JSON.stringify({ statusCode: 401, code: 'UNAUTHORIZED', message: '만료됨' }),
          { status: 401, headers: { 'Content-Type': 'application/json' } },
        );
      }
      return new Response(
        JSON.stringify({ statusCode: 503, code: 'LOGOUT_FAILED', message: '실패' }),
        { status: 503, headers: { 'Content-Type': 'application/json' } },
      );
    };

    await assert.rejects(
      () => coreFetch('/users/me'),
      (error: unknown) =>
        error instanceof CoreApiError &&
        error.status === 401 &&
        error.body.code === 'UNAUTHORIZED' &&
        error.body.message === '다시 로그인해 주세요.',
    );

    assert.deepEqual(requests, ['http://api.test/users/me', 'http://api.test/auth/logout']);
    assert.deepEqual(redirects, ['/login?returnTo=%2Fsettings']);
    assert.deepEqual(removedDrafts, ['davas:draft:user:create:new']);
  });

  it('purges drafts and redirects without claiming cookie clearance when logout cannot reach the API', async () => {
    const redirects: string[] = [];
    const removedDrafts: string[] = [];
    let requestCount = 0;

    Object.defineProperty(globalThis, 'window', { configurable: true, value: {} });
    Object.defineProperty(globalThis, 'location', {
      configurable: true,
      value: {
        pathname: '//external.example/path',
        search: '?unsafe=true',
        assign: (value: string) => redirects.push(value),
      },
    });
    Object.defineProperty(globalThis, 'sessionStorage', {
      configurable: true,
      value: {
        length: 1,
        key: () => 'davas:draft:user:edit:record-1',
        removeItem: (key: string) => removedDrafts.push(key),
      },
    });
    globalThis.fetch = async () => {
      requestCount += 1;
      if (requestCount === 1) {
        return new Response(
          JSON.stringify({ statusCode: 401, code: 'UNAUTHORIZED', message: '만료됨' }),
          { status: 401, headers: { 'Content-Type': 'application/json' } },
        );
      }
      throw new TypeError('network unavailable');
    };

    await assert.rejects(
      () => coreFetch('/diaries/me'),
      (error: unknown) => error instanceof CoreApiError && error.status === 401,
    );

    assert.equal(requestCount, 2);
    assert.deepEqual(redirects, ['/login?returnTo=%2F']);
    assert.deepEqual(removedDrafts, ['davas:draft:user:edit:record-1']);

    const coreSource = readFileSync(join(process.cwd(), 'src/lib/api/core.ts'), 'utf8');
    assert.match(coreSource, /cannot clear the HttpOnly cookie/);
    assert.doesNotMatch(coreSource, /cookie (?:was|is) clear/i);
  });
});
