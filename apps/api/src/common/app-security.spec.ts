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

const validProductionEnvironment = {
  NODE_ENV: 'production',
  CORS_ORIGINS: 'https://davas.app',
  JWT_ACCESS_SECRET: 'a'.repeat(48),
  COOKIE_SECURE: 'true',
};

describe('application security configuration', () => {
  it('uses localhost only as the development CORS default', () => {
    assert.deepEqual(resolveAllowedOrigins({}, 'development'), ['http://localhost:3000']);
  });

  it('requires explicit exact production origins and rejects wildcard', () => {
    assert.throws(() => resolveAllowedOrigins({}, 'production'), /CORS_ORIGINS/);
    assert.throws(() => resolveAllowedOrigins({ CORS_ORIGINS: '*' }, 'production'), /wildcard/i);
    assert.deepEqual(
      resolveAllowedOrigins(
        { CORS_ORIGINS: 'https://davas.app, https://www.davas.app' },
        'production',
      ),
      ['https://davas.app', 'https://www.davas.app'],
    );
  });

  it('fails closed on insecure production JWT and cookie settings', () => {
    assert.throws(
      () =>
        validateProductionConfiguration({
          ...validProductionEnvironment,
          JWT_ACCESS_SECRET: 'replace-me',
          COOKIE_SECURE: 'false',
        }),
      /JWT_ACCESS_SECRET|COOKIE_SECURE/,
    );

    assert.doesNotThrow(() => validateProductionConfiguration(validProductionEnvironment));
  });

  it('does not silently accept the retired JWT_SECRET name', () => {
    const { JWT_ACCESS_SECRET: _removed, ...withoutCurrentSecret } = validProductionEnvironment;

    assert.throws(
      () =>
        validateProductionConfiguration({
          ...withoutCurrentSecret,
          JWT_SECRET: 'a'.repeat(48),
        }),
      /JWT_ACCESS_SECRET/,
    );
  });

  it('does not enforce general database, schema sync, or bootstrap invite policy', () => {
    for (const password of ['short', 'postgres', 'change-this-postgres-password']) {
      assert.doesNotThrow(() =>
        validateProductionConfiguration({
          ...validProductionEnvironment,
          DB_PASSWORD: password,
          DATABASE_URL: `postgresql://davas:***@db:5432/davas`,
          TYPEORM_SYNC: 'true',
          DAVAS_BOOTSTRAP_INVITE_CODE: 'private-self-host-code',
          DAVAS_BOOTSTRAP_INVITE_MAX_USES: '0',
          DAVAS_BOOTSTRAP_INVITE_EXPIRES_AT: 'not-a-date',
        }),
      );
    }
  });

  it('rejects publicly known bootstrap invite placeholders in production', () => {
    for (const bootstrapCode of ['change-me-bootstrap-code', 'replace-with-a-one-time-code']) {
      assert.throws(
        () =>
          validateProductionConfiguration({
            ...validProductionEnvironment,
            DAVAS_BOOTSTRAP_INVITE_CODE: bootstrapCode,
          }),
        /DAVAS_BOOTSTRAP_INVITE_CODE/,
      );
    }
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
