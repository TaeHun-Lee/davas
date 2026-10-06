import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { join, relative } from 'node:path';
import { describe, it } from 'node:test';
import { ForbiddenException, type ExecutionContext } from '@nestjs/common';
import { OriginGuard } from '../common/app-security';
import { AuthController } from './auth.controller';
import { IS_PUBLIC_KEY } from './public.decorator';

const sourceRoot = join(process.cwd(), 'src');

function controllerFiles(directory = sourceRoot): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) return controllerFiles(path);
    return entry.isFile() && entry.name.endsWith('.controller.ts') ? [path] : [];
  });
}

describe('controller authentication policy', () => {
  it('allows cookie parsing only in the global guard', () => {
    const violations = controllerFiles()
      .filter((path) => !path.endsWith('/auth/auth.controller.ts'))
      .flatMap((path) => {
        const source = readFileSync(path, 'utf8');
        const reasons = [
          source.includes('headers.cookie') ? 'headers.cookie' : '',
          source.includes('readCookie') ? 'readCookie' : '',
          source.includes('AuthService') ? 'AuthService' : '',
          source.includes('.findMe(') ? 'findMe' : '',
        ].filter(Boolean);
        return reasons.length ? [`${relative(sourceRoot, path)}: ${reasons.join(', ')}`] : [];
      });

    assert.deepEqual(violations, []);
  });

  it('treats the guard principal as required in private controllers', () => {
    const violations = controllerFiles().flatMap((path) => {
      const source = readFileSync(path, 'utf8');
      return /(?:request|req)\.user!/g.test(source) ? [relative(sourceRoot, path)] : [];
    });

    assert.deepEqual(violations, []);
  });

  it('does not re-verify access tokens in UsersService', () => {
    const source = readFileSync(join(sourceRoot, 'users/users.service.ts'), 'utf8');

    assert.doesNotMatch(source, /JwtService|loadAuthenticatedUser|accessToken/);
    assert.match(source, /loadUserById/);
  });

  it('keeps logout public while unsafe cross-origin requests remain guarded', () => {
    assert.equal(Reflect.getMetadata(IS_PUBLIC_KEY, AuthController.prototype.logout), true);

    const previousOrigins = process.env.CORS_ORIGINS;
    process.env.CORS_ORIGINS = 'https://davas.app';
    const context = {
      switchToHttp: () => ({
        getRequest: () => ({
          method: 'POST',
          headers: { origin: 'https://evil.example' },
        }),
      }),
    } as unknown as ExecutionContext;

    try {
      assert.throws(() => new OriginGuard().canActivate(context), ForbiddenException);
    } finally {
      if (previousOrigins === undefined) delete process.env.CORS_ORIGINS;
      else process.env.CORS_ORIGINS = previousOrigins;
    }
  });
});
