import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, it } from 'node:test';
import { createTypeOrmOptions } from './database/typeorm.config';

const apiSource = (relativePath: string) =>
  readFileSync(join(process.cwd(), 'src', relativePath), 'utf8');
const repositorySource = (relativePath: string) =>
  readFileSync(join(process.cwd(), '..', '..', relativePath), 'utf8');

describe('TO-BE module and contract integration', () => {
  it('connects the new feature modules through the application composition root', () => {
    const app = apiSource('app.module.ts');
    for (const moduleName of [
      'SpacesModule',
      'DiariesModule',
      'MediaModule',
      'RecommendationsModule',
      'NotificationsModule',
    ]) {
      assert.match(app, new RegExp(`\\b${moduleName}\\b`), moduleName);
    }

    const diaries = apiSource('diaries/diaries.module.ts');
    const recommendations = apiSource(
      'recommendations/recommendations.module.ts',
    );
    const spaces = apiSource('spaces/spaces.module.ts');
    assert.match(diaries, /SpacesModule/);
    assert.match(recommendations, /SpacesModule/);
    assert.match(spaces, /OutboxModule/);
    assert.match(diaries, /OutboxModule/);
  });

  it('registers every TO-BE entity and keeps migrations in ascending order', () => {
    const options = createTypeOrmOptions();
    const entityNames = (options.entities as Array<new () => unknown>).map(
      (entity) => entity.name,
    );
    for (const entityName of [
      'SpaceEntity',
      'SpaceMembershipEntity',
      'SpaceInviteEntity',
      'WatchParticipantEntity',
      'WatchReactionEntity',
      'WatchSourceEntity',
      'WatchShareEntity',
      'ExternalContentRefEntity',
      'AvailabilityObservationEntity',
      'NotificationPreferenceEntity',
      'TransactionOutboxEntity',
      'RecommendationSessionEntity',
      'RecommendationExposureEntity',
      'RecommendationFeedbackEntity',
    ]) {
      assert.ok(entityNames.includes(entityName), entityName);
    }

    const migrationNames = (
      options.migrations as Array<new () => { name: string }>
    ).map((migration) => migration.name);
    const timestamps = migrationNames.map((name) =>
      Number(name.match(/\d+$/)?.[0]),
    );
    assert.deepEqual(
      timestamps,
      timestamps.slice().sort((left, right) => left - right),
    );
  });

  it('uses the shared watch contract from both API validation and the web wrapper', () => {
    const shared = repositorySource('packages/shared/src/index.ts');
    const dto = apiSource('diaries/dto/watch-event.dto.ts');
    const web = repositorySource('apps/web/src/lib/api/watch-events.ts');
    assert.match(shared, /export const WATCH_SOURCE_KINDS/);
    assert.match(shared, /export type WatchEventWriteRequest/);
    assert.match(shared, /export type WatchEventView/);
    assert.match(dto, /from '@davas\/shared'/);
    assert.match(dto, /WATCH_SOURCE_KINDS/);
    assert.match(web, /from '@davas\/shared'/);
    assert.match(web, /WatchEventWriteRequest/);
  });

  it('keeps database access out of HTTP controllers and routes space checks through one boundary', () => {
    for (const controller of [
      'spaces/spaces.controller.ts',
      'spaces/space-invites.controller.ts',
      'diaries/diaries.controller.ts',
      'diaries/space-watch.controller.ts',
      'diaries/watch-events.controller.ts',
      'recommendations/recommendations.controller.ts',
      'recommendations/group-recommendations.controller.ts',
    ]) {
      assert.doesNotMatch(
        apiSource(controller),
        /InjectRepository|DataSource|getRepository/,
        controller,
      );
    }
    assert.match(apiSource('diaries/diary-access.service.ts'), /SpaceAccessService/);
    assert.match(
      apiSource('recommendations/group-recommendations.service.ts'),
      /SpaceAccessService/,
    );
  });
});
