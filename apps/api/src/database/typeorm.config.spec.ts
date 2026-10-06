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

  it('registers the remediation and TO-BE migration sets exactly once', () => {
    const options = createTypeOrmOptions();
    const names = (options.migrations as Array<{ name?: string }>).map(
      (migration) => migration.name,
    );

    assert.equal(new Set(names).size, names.length, 'migration class names must be unique');
    for (const name of [
      'MediaCanonicalIdentity1720670700000',
      'CoreQueryIndexes1720670800000',
      'FeedIndexSharedAtPredicate1720670900000',
      'LegacyTmdbImageSafety1720671000000',
      'DropLegacyMediaIdentityIndex1720671100000',
      'SpacesMembershipInvites1720670700000',
      'WatchEventsAndPersonalReactions1720670800000',
      'CanonicalCatalogAvailability1720670900000',
      'AccountLifecycleNotificationOutbox1720671000000',
      'GroupRecommendationSessions1720671100000',
      'RecordExperience1720671200000',
      'SpaceWishesAndSubscriptions1720671300000',
    ]) {
      assert.ok(names.includes(name), name);
    }
    assert.equal(names.length, 16);
  });

  it('keeps registration order non-decreasing by timestamp', () => {
    const options = createTypeOrmOptions();
    const timestamps = (options.migrations as Array<{ name?: string }>).map((migration) =>
      Number(migration.name?.match(/(\d{13})$/)?.[1]),
    );

    assert.ok(timestamps.every((value) => Number.isSafeInteger(value)));
    assert.deepEqual(
      timestamps,
      [...timestamps].sort((a, b) => a - b),
    );
  });
});
