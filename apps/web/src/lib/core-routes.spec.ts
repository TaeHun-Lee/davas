import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { isSafeCoreReturnTo, safeCoreReturnTo } from './core-routes';

describe('core returnTo allow-list', () => {
  it('accepts the in-app screens a login can return to', () => {
    for (const value of [
      '/',
      '/me',
      '/friends',
      '/settings',
      '/spaces',
      '/spaces?view=recommend',
      '/search?scope=mine&q=dune&mediaType=MOVIE',
      '/records/new',
      '/records/new?step=find&detail=abc-123',
      '/records/new?mediaId=abc&returnTo=%2Frecords%2Fnew%3Fstep%3Dfind%26detail%3Dabc',
      '/records/abc-123',
      '/records/abc-123?returnTo=%2Fme&saved=space',
      '/records/abc-123/edit',
      '/friends/invite/token_1',
      '/spaces/invite/token-2',
    ]) {
      assert.equal(isSafeCoreReturnTo(value), true, value);
    }
  });

  it('rejects external, ambiguous, or unknown targets', () => {
    for (const value of [
      null,
      '',
      'https://evil.example',
      '//evil.example',
      '/\\evil.example',
      '/records/%2F%2Fevil',
      '/me#fragment',
      '/me?x=1',
      '/admin',
      '/search?scope=all',
      '/search?q=a&q=b',
      '/records/new?step=delete',
      '/records/abc?returnTo=https%3A%2F%2Fevil.example',
      '/records/abc?saved=public',
      '/spaces/invite/a/b',
      '/spaces?view=admin',
      '/spaces?view=recommend&view=timeline',
    ]) {
      assert.equal(isSafeCoreReturnTo(value), false, String(value));
    }
  });

  it('bounds nested returnTo chains', () => {
    const level3 = '/records/c?returnTo=%2Fme';
    const level2 = `/records/b?returnTo=${encodeURIComponent(level3)}`;
    const level1 = `/records/a?returnTo=${encodeURIComponent(level2)}`;
    const level0 = `/records/z?returnTo=${encodeURIComponent(level1)}`;
    assert.equal(isSafeCoreReturnTo(level2), true);
    assert.equal(isSafeCoreReturnTo(level0), false);
  });

  it('falls back when the target is unsafe', () => {
    assert.equal(safeCoreReturnTo('//evil.example', '/'), '/');
    assert.equal(safeCoreReturnTo('/me', '/'), '/me');
  });
});
