import assert from 'node:assert/strict';
import { UnauthorizedException } from '@nestjs/common';
import { describe, it } from 'node:test';
import { JwtCookieAuthGuard } from './jwt-cookie-auth.guard';

type FakeContextRequest = {
  headers: { cookie?: string };
  user?: { id: string };
};

function contextFor(request: FakeContextRequest) {
  return {
    switchToHttp: () => ({ getRequest: () => request }),
  } as never;
}

describe('JwtCookieAuthGuard', () => {
  it('rejects a request with no access-token cookie', async () => {
    const guard = new JwtCookieAuthGuard({ findMe: async () => null } as never);

    await assert.rejects(
      () => guard.canActivate(contextFor({ headers: {} })),
      UnauthorizedException,
    );
  });

  it('validates the cookie and attaches the authenticated principal', async () => {
    const observedTokens: Array<string | undefined> = [];
    const request: FakeContextRequest = {
      headers: { cookie: 'theme=dark; davas_access_token=signed-token; locale=ko' },
    };
    const guard = new JwtCookieAuthGuard({
      findMe: async (token: string | undefined) => {
        observedTokens.push(token);
        return { id: 'user-1' };
      },
    } as never);

    assert.equal(await guard.canActivate(contextFor(request)), true);
    assert.deepEqual(observedTokens, ['signed-token']);
    assert.deepEqual(request.user, { id: 'user-1' });
  });
});
