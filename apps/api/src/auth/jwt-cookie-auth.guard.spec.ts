import assert from 'node:assert/strict';
import { UnauthorizedException } from '@nestjs/common';
import type { ExecutionContext } from '@nestjs/common';
import { describe, it } from 'node:test';
import { IS_PUBLIC_KEY, Public } from './public.decorator';
import { JwtCookieAuthGuard } from './jwt-cookie-auth.guard';

function contextWith(headers: Record<string, string | undefined>) {
  const request = { headers } as Record<string, unknown>;
  const context = {
    getHandler: () => contextWith,
    getClass: () => Object,
    switchToHttp: () => ({ getRequest: () => request }),
  } as unknown as ExecutionContext;
  return { request, context };
}

function reflector(isPublic = false) {
  return {
    getAllAndOverride: (key: string) => {
      assert.equal(key, IS_PUBLIC_KEY);
      return isPublic;
    },
  };
}

describe('JwtCookieAuthGuard', () => {
  it('marks explicitly public handlers with stable metadata', () => {
    class Controller {
      route() {}
    }
    const descriptor = Object.getOwnPropertyDescriptor(
      Controller.prototype,
      'route',
    )!;
    Public()(Controller.prototype, 'route', descriptor);
    assert.equal(
      Reflect.getMetadata(IS_PUBLIC_KEY, descriptor.value),
      true,
    );
  });

  it('bypasses authentication only for explicit public routes', async () => {
    let authCalls = 0;
    const guard = new JwtCookieAuthGuard(
      {
        findMe: async () => {
          authCalls += 1;
          return { id: 'should-not-run' };
        },
      } as never,
      reflector(true) as never,
    );
    const { context } = contextWith({});

    assert.equal(await guard.canActivate(context), true);
    assert.equal(authCalls, 0);
  });

  it('rejects a non-public request with no access-token cookie', async () => {
    const guard = new JwtCookieAuthGuard(
      { findMe: async () => null } as never,
      reflector(false) as never,
    );
    const { context } = contextWith({});

    await assert.rejects(() => guard.canActivate(context), UnauthorizedException);
  });

  it('validates the cookie and attaches the authenticated principal', async () => {
    const guard = new JwtCookieAuthGuard(
      {
        findMe: async (token: string) => {
          assert.equal(token, 'valid-token');
          return { id: 'user-1' };
        },
      } as never,
      reflector(false) as never,
    );
    const { context, request } = contextWith({
      cookie: 'theme=dark; davas_access_token=valid-token; locale=ko',
    });

    assert.equal(await guard.canActivate(context), true);
    assert.deepEqual(request.user, { id: 'user-1' });
  });
});
