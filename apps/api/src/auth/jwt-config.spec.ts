import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { parseJwtExpirySeconds } from './jwt-config';

describe('parseJwtExpirySeconds', () => {
  it('converts supported second, minute, hour and day values', () => {
    assert.equal(parseJwtExpirySeconds('30s'), 30);
    assert.equal(parseJwtExpirySeconds('15m'), 900);
    assert.equal(parseJwtExpirySeconds('2h'), 7200);
    assert.equal(parseJwtExpirySeconds('7d'), 604800);
  });

  it('uses seven days by default', () => {
    assert.equal(parseJwtExpirySeconds(undefined), 604800);
  });

  it('rejects ambiguous or unsafe values during bootstrap', () => {
    assert.throws(() => parseJwtExpirySeconds('forever'), /JWT_ACCESS_EXPIRES_IN/);
    assert.throws(() => parseJwtExpirySeconds('0d'), /JWT_ACCESS_EXPIRES_IN/);
    assert.throws(() => parseJwtExpirySeconds('999999d'), /JWT_ACCESS_EXPIRES_IN/);
  });
});
