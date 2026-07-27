import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, it } from 'node:test';
import { isSafeCoreReturnTo, safeCoreReturnTo } from './core-routes';

const source = (path: string) => readFileSync(join(process.cwd(), 'src', path), 'utf8');

describe('safe core returnTo validation', () => {
  it('accepts protected core routes and preserves their supported queries', () => {
    const safeRoutes = [
      '/',
      '/me',
      '/friends',
      '/settings',
      '/search?scope=friends&q=%EC%9D%B8%ED%84%B0%EC%8A%A4%ED%85%94%EB%9D%BC&mediaType=MOVIE&viewingMethod=OTT',
      '/search?scope=mine&q=Interstellar',
      '/records/new?mediaId=ddcb649a-67fc-46b7-b70e-74137fd2b806',
      '/records/new?step=write',
      '/records/ddcb649a-67fc-46b7-b70e-74137fd2b806',
      '/records/ddcb649a-67fc-46b7-b70e-74137fd2b806/edit',
      '/records/ddcb649a-67fc-46b7-b70e-74137fd2b806?returnTo=%2Fsearch%3Fscope%3Dmine&saved=private',
      '/friends/invite/invite-token_123',
    ];

    for (const route of safeRoutes) {
      assert.equal(isSafeCoreReturnTo(route), true, route);
      assert.equal(safeCoreReturnTo(route, '/fallback'), route, route);
    }
  });

  it('rejects external, ambiguous, unsupported, and open-redirect destinations', () => {
    const unsafeRoutes = [
      'https://evil.example/settings',
      '//evil.example/settings',
      '/\\evil.example/settings',
      '/login',
      '/settings?returnTo=https%3A%2F%2Fevil.example',
      '/search?scope=external',
      '/search?scope=mine&next=https%3A%2F%2Fevil.example',
      '/search?scope=mine&scope=friends',
      '/records/new?returnTo=https%3A%2F%2Fevil.example',
      '/records/record-id/delete',
      '/records/record-id?returnTo=https%3A%2F%2Fevil.example',
      '/records/%2F%2Fevil.example',
      '/friends/invite/%2F%2Fevil.example',
    ];

    for (const route of unsafeRoutes) {
      assert.equal(isSafeCoreReturnTo(route), false, route);
      assert.equal(safeCoreReturnTo(route, '/fallback'), '/fallback', route);
    }
  });

  it('is the single validator used by middleware, login, 401 recovery, and record detail', () => {
    for (const path of [
      'middleware.ts',
      'components/auth/AuthUi.tsx',
      'lib/api/core.ts',
      'components/core/RecordDetailScreen.tsx',
    ]) {
      assert.match(source(path), /(?:safeCoreReturnTo|isSafeCoreReturnTo)/, path);
    }
    assert.doesNotMatch(source('components/auth/AuthUi.tsx'), /const safeReturn=/);
    assert.doesNotMatch(source('components/core/RecordDetailScreen.tsx'), /const safeReturn/);
  });
});
