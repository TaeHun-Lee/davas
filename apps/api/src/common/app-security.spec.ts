import assert from 'node:assert/strict';
import { ForbiddenException } from '@nestjs/common';
import type { ExecutionContext } from '@nestjs/common';
import { describe, it } from 'node:test';
import {
  OriginGuard,
  resolveAllowedOrigins,
  validateProductionConfiguration,
} from './app-security';

function context(method: string, origin?: string) {
  return {
    switchToHttp: () => ({
      getRequest: () => ({
        method,
        headers: origin ? { origin } : {},
      }),
    }),
  } as unknown as ExecutionContext;
}

describe('application security configuration', () => {
  it('uses localhost only as the development CORS default', () => {
    assert.deepEqual(resolveAllowedOrigins({}, 'development'), [
      'http://localhost:3000',
    ]);
  });

  it('requires explicit exact production origins and rejects wildcard', () => {
    assert.throws(
      () => resolveAllowedOrigins({}, 'production'),
      /CORS_ORIGINS/,
    );
    assert.throws(
      () =>
        resolveAllowedOrigins({ CORS_ORIGINS: '*' }, 'production'),
      /wildcard/i,
    );
    assert.deepEqual(
      resolveAllowedOrigins(
        { CORS_ORIGINS: 'https://davas.app, https://www.davas.app' },
        'production',
      ),
      ['https://davas.app', 'https://www.davas.app'],
    );
  });

  it('fails closed on insecure production secrets and cookies', () => {
    assert.throws(
      () =>
        validateProductionConfiguration({
          NODE_ENV: 'production',
          CORS_ORIGINS: 'https://davas.app',
          JWT_SECRET: 'dev-secret-change-me',
          DATABASE_URL: '',
          COOKIE_SECURE: 'false',
        }),
      /JWT_SECRET|DATABASE_URL|COOKIE_SECURE/,
    );

    assert.doesNotThrow(() =>
      validateProductionConfiguration({
        NODE_ENV: 'production',
        CORS_ORIGINS: 'https://davas.app',
        JWT_SECRET: 'a'.repeat(48),
        DATABASE_URL: 'postgresql://app:secret@db:5432/davas',
        COOKIE_SECURE: 'true',
      }),
    );
  });

  it('rejects unsafe browser requests from outside the allowlist', () => {
    const previousOrigins = process.env.CORS_ORIGINS;
    process.env.CORS_ORIGINS = 'https://davas.app';
    const guard = new OriginGuard();

    try {
      assert.equal(guard.canActivate(context('GET', 'https://evil.example')), true);
      assert.equal(guard.canActivate(context('POST', 'https://davas.app')), true);
      assert.throws(
        () => guard.canActivate(context('DELETE', 'https://evil.example')),
        ForbiddenException,
      );
    } finally {
      if (previousOrigins === undefined) delete process.env.CORS_ORIGINS;
      else process.env.CORS_ORIGINS = previousOrigins;
    }
  });
});
