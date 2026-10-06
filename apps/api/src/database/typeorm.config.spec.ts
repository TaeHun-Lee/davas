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

  it('registers forward-only cleanup migrations after migration 090', () => {
    const options = createTypeOrmOptions();
    const migrations = options.migrations as Array<{ name?: string }>;

    assert.equal(migrations.at(-3)?.name, 'FeedIndexSharedAtPredicate1720670900000');
    assert.equal(migrations.at(-2)?.name, 'LegacyTmdbImageSafety1720671000000');
    assert.equal(migrations.at(-1)?.name, 'DropLegacyMediaIdentityIndex1720671100000');
  });
});
