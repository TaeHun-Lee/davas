import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import type { QueryRunner } from 'typeorm';
import { createTypeOrmOptions } from '../typeorm.config';
import { GroupRecommendationSessions1720671100000 } from './1720671100000-GroupRecommendationSessions';

async function statements() {
  const up: string[] = [];
  const down: string[] = [];
  const migration = new GroupRecommendationSessions1720671100000();
  await migration.up({
    query: async (sql: string) => void up.push(sql),
  } as never as QueryRunner);
  await migration.down({
    query: async (sql: string) => void down.push(sql),
  } as never as QueryRunner);
  return { up: up.join('\n'), down: down.join('\n') };
}

describe('group recommendation persistence migration', () => {
  it('is the next additive migration and registers all recommendation entities', () => {
    const options = createTypeOrmOptions();
    const migrations = options.migrations as Array<new () => { name: string }>;
    const entities = options.entities as Array<new () => unknown>;
    assert.equal(
      migrations.at(-1)?.name,
      'GroupRecommendationSessions1720671100000',
    );
    for (const name of [
      'RecommendationSessionEntity',
      'RecommendationExposureEntity',
      'RecommendationFeedbackEntity',
    ]) {
      assert.ok(entities.some((entity) => entity.name === name), name);
    }
  });

  it('persists bounded participants, reproducible scores, privacy-safe reasons, and feedback links', async () => {
    const sql = await statements();
    assert.match(sql.up, /CREATE TABLE IF NOT EXISTS "recommendation_sessions"/);
    assert.match(sql.up, /cardinality\("participant_account_ids"\) BETWEEN 2 AND 5/);
    assert.match(sql.up, /"algorithm_version" varchar\(40\) NOT NULL/);
    assert.match(sql.up, /"constraints_snapshot" jsonb NOT NULL/);
    assert.match(sql.up, /"participant_scores" jsonb NOT NULL/);
    assert.match(sql.up, /"score_parts" jsonb NOT NULL/);
    assert.match(sql.up, /"reason_codes" text\[\] NOT NULL/);
    assert.match(sql.up, /"availability_snapshot" jsonb NOT NULL/);
    assert.match(sql.up, /UQ_recommendation_exposure_content/);
    assert.match(sql.up, /UQ_recommendation_feedback_account/);
    assert.match(sql.up, /'AVAILABILITY_ERROR', 'WATCHED'/);
    assert.match(sql.up, /"watch_event_id" uuid/);
    assert.match(
      sql.up,
      /\("kind" = 'WATCHED'\) = \("watch_event_id" IS NOT NULL\)/,
    );
    assert.doesNotMatch(sql.up, /DROP TABLE.*"diaries"/i);
    assert.match(sql.down, /DROP TABLE IF EXISTS "recommendation_feedback"/);
    assert.match(sql.down, /DROP TABLE IF EXISTS "recommendation_sessions"/);
  });
});
