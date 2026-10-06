import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import type { ExecutionContext } from '@nestjs/common';
import type { AuthService } from './auth.service';
import { OptionalJwtCookieAuthGuard } from './optional-jwt-cookie-auth.guard';

const user = {
  id: '10000000-0000-0000-0000-000000000001',
  email: 'viewer@example.test',
  nickname: 'viewer',
  profileImageUrl: null,
  bio: null,
  preferredGenres: [],
};

function context(request: { headers: { cookie?: string }; user?: typeof user }) {
  return {
    switchToHttp: () => ({ getRequest: () => request }),
  } as unknown as ExecutionContext;
}

describe('optional JWT cookie authentication guard', () => {
  it('passes anonymous requests without calling authentication', async () => {
    let calls = 0;
    const auth = {
      findMe: async () => {
        calls += 1;
        return user;
      },
    } as unknown as AuthService;
    const request = { headers: {} };

    assert.equal(await new OptionalJwtCookieAuthGuard(auth).canActivate(context(request)), true);
    assert.equal(calls, 0);
    assert.equal('user' in request, false);
  });

  it('attaches a viewer for a valid access-token cookie', async () => {
    const auth = { findMe: async () => user } as unknown as AuthService;
    const request: { headers: { cookie: string }; user?: typeof user } = {
      headers: { cookie: 'davas_access_token=valid-token' },
    };

    assert.equal(await new OptionalJwtCookieAuthGuard(auth).canActivate(context(request)), true);
    assert.deepEqual(request.user, user);
  });

  it('passes stale or invalid cookies as anonymous', async () => {
    const auth = {
      findMe: async () => {
        throw new Error('invalid token');
      },
    } as unknown as AuthService;
    const request = { headers: { cookie: 'davas_access_token=stale-token' } };

    assert.equal(await new OptionalJwtCookieAuthGuard(auth).canActivate(context(request)), true);
    assert.equal('user' in request, false);
  });
});
