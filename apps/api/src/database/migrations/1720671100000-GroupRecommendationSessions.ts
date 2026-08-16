import { MigrationInterface, QueryRunner } from 'typeorm';

export class GroupRecommendationSessions1720671100000
  implements MigrationInterface
{
  name = 'GroupRecommendationSessions1720671100000';

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE IF NOT EXISTS "recommendation_sessions" (
      "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      "space_id" uuid NOT NULL,
      "requester_account_id" uuid NOT NULL,
      "participant_account_ids" uuid[] NOT NULL,
      "region" char(2) NOT NULL,
      "services" text[] NOT NULL,
      "content_types" text[] NOT NULL,
      "runtime_min" smallint,
      "runtime_max" smallint,
      "mood_tags" text[] NOT NULL DEFAULT '{}',
      "avoid_tags" text[] NOT NULL DEFAULT '{}',
      "rewatch_policy" varchar(20) NOT NULL,
      "decision_rule" varchar(20) NOT NULL,
      "minimum_approvals" smallint NOT NULL,
      "lambda" decimal(4,3) NOT NULL DEFAULT 0.600,
      "gamma" decimal(4,3) NOT NULL DEFAULT 0.100,
      "algorithm_version" varchar(40) NOT NULL,
      "seed" varchar(64) NOT NULL,
      "constraints_snapshot" jsonb NOT NULL,
      "status" varchar(20) NOT NULL DEFAULT 'OPEN',
      "created_at" timestamptz NOT NULL DEFAULT now(),
      CONSTRAINT "CHK_recommendation_participant_count" CHECK (cardinality("participant_account_ids") BETWEEN 2 AND 5),
      CONSTRAINT "CHK_recommendation_services" CHECK (cardinality("services") >= 1),
      CONSTRAINT "CHK_recommendation_content_types" CHECK (cardinality("content_types") >= 1 AND "content_types" <@ ARRAY['MOVIE','TV']::text[]),
      CONSTRAINT "CHK_recommendation_runtime" CHECK (("runtime_min" IS NULL OR "runtime_min" > 0) AND ("runtime_max" IS NULL OR "runtime_max" > 0) AND ("runtime_min" IS NULL OR "runtime_max" IS NULL OR "runtime_min" <= "runtime_max")),
      CONSTRAINT "CHK_recommendation_rewatch" CHECK ("rewatch_policy" IN ('EXCLUDE', 'ALLOW')),
      CONSTRAINT "CHK_recommendation_decision" CHECK ("decision_rule" IN ('ALL', 'MINIMUM')),
      CONSTRAINT "CHK_recommendation_minimum" CHECK ("minimum_approvals" BETWEEN 1 AND cardinality("participant_account_ids")),
      CONSTRAINT "CHK_recommendation_weights" CHECK ("lambda" BETWEEN 0 AND 1 AND "gamma" BETWEEN 0 AND 1),
      CONSTRAINT "CHK_recommendation_status" CHECK ("status" IN ('OPEN', 'MATCHED', 'CLOSED')),
      CONSTRAINT "FK_recommendation_session_space" FOREIGN KEY ("space_id") REFERENCES "spaces"("id") ON DELETE CASCADE,
      CONSTRAINT "FK_recommendation_session_requester" FOREIGN KEY ("requester_account_id") REFERENCES "users"("id") ON DELETE CASCADE
    )`);
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "IDX_recommendation_session_space_created" ON "recommendation_sessions" ("space_id", "created_at" DESC)`,
    );

    await queryRunner.query(`CREATE TABLE IF NOT EXISTS "recommendation_exposures" (
      "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      "session_id" uuid NOT NULL,
      "content_id" uuid NOT NULL,
      "rank" smallint NOT NULL,
      "group_score" decimal(6,5) NOT NULL,
      "participant_scores" jsonb NOT NULL,
      "score_parts" jsonb NOT NULL,
      "candidate_channels" text[] NOT NULL,
      "reason_codes" text[] NOT NULL,
      "reason_params" jsonb NOT NULL,
      "availability_snapshot" jsonb NOT NULL,
      "created_at" timestamptz NOT NULL DEFAULT now(),
      CONSTRAINT "UQ_recommendation_exposure_content" UNIQUE ("session_id", "content_id"),
      CONSTRAINT "UQ_recommendation_exposure_rank" UNIQUE ("session_id", "rank"),
      CONSTRAINT "CHK_recommendation_rank" CHECK ("rank" > 0),
      CONSTRAINT "CHK_recommendation_group_score" CHECK ("group_score" BETWEEN 0 AND 1),
      CONSTRAINT "FK_recommendation_exposure_session" FOREIGN KEY ("session_id") REFERENCES "recommendation_sessions"("id") ON DELETE CASCADE,
      CONSTRAINT "FK_recommendation_exposure_content" FOREIGN KEY ("content_id") REFERENCES "media"("id") ON DELETE CASCADE
    )`);

    await queryRunner.query(`CREATE TABLE IF NOT EXISTS "recommendation_feedback" (
      "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      "exposure_id" uuid NOT NULL,
      "account_id" uuid NOT NULL,
      "kind" varchar(30) NOT NULL,
      "watch_event_id" uuid,
      "created_at" timestamptz NOT NULL DEFAULT now(),
      "updated_at" timestamptz NOT NULL DEFAULT now(),
      CONSTRAINT "UQ_recommendation_feedback_account" UNIQUE ("exposure_id", "account_id"),
      CONSTRAINT "CHK_recommendation_feedback_kind" CHECK ("kind" IN ('INTERESTED', 'HOLD', 'REJECTED', 'ALREADY_WATCHED', 'AVAILABILITY_ERROR', 'WATCHED')),
      CONSTRAINT "CHK_recommendation_watched_link" CHECK (("kind" = 'WATCHED') = ("watch_event_id" IS NOT NULL)),
      CONSTRAINT "FK_recommendation_feedback_exposure" FOREIGN KEY ("exposure_id") REFERENCES "recommendation_exposures"("id") ON DELETE CASCADE,
      CONSTRAINT "FK_recommendation_feedback_account" FOREIGN KEY ("account_id") REFERENCES "users"("id") ON DELETE CASCADE,
      CONSTRAINT "FK_recommendation_feedback_watch_event" FOREIGN KEY ("watch_event_id") REFERENCES "diaries"("id") ON DELETE CASCADE
    )`);
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "IDX_recommendation_feedback_account_kind" ON "recommendation_feedback" ("account_id", "kind")`,
    );
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP TABLE IF EXISTS "recommendation_feedback"`,
    );
    await queryRunner.query(
      `DROP TABLE IF EXISTS "recommendation_exposures"`,
    );
    await queryRunner.query(
      `DROP TABLE IF EXISTS "recommendation_sessions"`,
    );
  }
}
