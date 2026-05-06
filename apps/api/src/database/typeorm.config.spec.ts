import 'reflect-metadata';
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { createTypeOrmOptions } from './typeorm.config';

describe('createTypeOrmOptions', () => {
  it('uses postgres and disables synchronize by default', () => {
    const options = createTypeOrmOptions();

    assert.equal(options.type, 'postgres');
    assert.equal(options.synchronize, false);
    assert.ok(Array.isArray(options.entities));
  });
});
