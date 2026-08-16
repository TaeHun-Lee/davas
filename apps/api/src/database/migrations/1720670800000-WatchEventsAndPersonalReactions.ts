import { MigrationInterface, QueryRunner } from 'typeorm';

export class WatchEventsAndPersonalReactions1720670800000 implements MigrationInterface {
  name = 'WatchEventsAndPersonalReactions1720670800000';

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE IF NOT EXISTS "watch_event_shares" (
      "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      "diary_id" uuid NOT NULL,
      "space_id" uuid NOT NULL,
      "shared_at" timestamptz NOT NULL DEFAULT now(),
      "revoked_at" timestamptz,
      CONSTRAINT "UQ_watch_event_share" UNIQUE ("diary_id", "space_id"),
      CONSTRAINT "FK_watch_event_share_diary" FOREIGN KEY ("diary_id") REFERENCES "diaries"("id") ON DELETE CASCADE,
      CONSTRAINT "FK_watch_event_share_space" FOREIGN KEY ("space_id") REFERENCES "spaces"("id") ON DELETE CASCADE
    )`);
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "IDX_watch_event_share_timeline" ON "watch_event_shares" ("space_id", "shared_at" DESC, "id" DESC) WHERE "revoked_at" IS NULL`,
    );

    await queryRunner.query(`CREATE TABLE IF NOT EXISTS "watch_participants" (
      "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      "diary_id" uuid NOT NULL,
      "account_id" uuid NOT NULL,
      "status" varchar(20) NOT NULL DEFAULT 'PENDING',
      "requested_at" timestamptz NOT NULL DEFAULT now(),
      "responded_at" timestamptz,
      CONSTRAINT "UQ_watch_participant" UNIQUE ("diary_id", "account_id"),
      CONSTRAINT "CHK_watch_participant_status" CHECK ("status" IN ('PENDING', 'CONFIRMED', 'DECLINED')),
      CONSTRAINT "FK_watch_participant_diary" FOREIGN KEY ("diary_id") REFERENCES "diaries"("id") ON DELETE CASCADE,
      CONSTRAINT "FK_watch_participant_account" FOREIGN KEY ("account_id") REFERENCES "users"("id") ON DELETE CASCADE
    )`);
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "IDX_watch_participant_inbox" ON "watch_participants" ("account_id", "status")`,
    );

    await queryRunner.query(`CREATE TABLE IF NOT EXISTS "watch_reactions" (
      "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      "diary_id" uuid NOT NULL,
      "account_id" uuid NOT NULL,
      "rating_scale" smallint,
      "review_text" text,
      "created_at" timestamptz NOT NULL DEFAULT now(),
      "updated_at" timestamptz NOT NULL DEFAULT now(),
      CONSTRAINT "UQ_watch_reaction" UNIQUE ("diary_id", "account_id"),
      CONSTRAINT "CHK_watch_reaction_rating" CHECK ("rating_scale" IS NULL OR "rating_scale" BETWEEN 1 AND 10),
      CONSTRAINT "FK_watch_reaction_diary" FOREIGN KEY ("diary_id") REFERENCES "diaries"("id") ON DELETE CASCADE,
      CONSTRAINT "FK_watch_reaction_account" FOREIGN KEY ("account_id") REFERENCES "users"("id") ON DELETE CASCADE
    )`);

    await queryRunner.query(`CREATE TABLE IF NOT EXISTS "watch_sources" (
      "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      "diary_id" uuid NOT NULL UNIQUE,
      "kind" varchar(20) NOT NULL,
      "provider_name" varchar(80),
      "place_text" varchar(160),
      CONSTRAINT "CHK_watch_source_kind" CHECK ("kind" IN ('THEATER', 'OTT', 'TV_OWNED', 'OTHER')),
      CONSTRAINT "FK_watch_source_diary" FOREIGN KEY ("diary_id") REFERENCES "diaries"("id") ON DELETE CASCADE
    )`);

    await queryRunner.query(`INSERT INTO "watch_participants" (
      "diary_id", "account_id", "status", "requested_at", "responded_at"
    )
    SELECT "id", "user_id", 'CONFIRMED', "created_at", "created_at"
    FROM "diaries"
    ON CONFLICT ("diary_id", "account_id") DO NOTHING`);
    await queryRunner.query(`INSERT INTO "watch_reactions" (
      "diary_id", "account_id", "rating_scale", "review_text", "created_at", "updated_at"
    )
    SELECT
      "id",
      "user_id",
      CASE WHEN "rating" IS NULL THEN NULL ELSE ROUND("rating" * 2)::smallint END,
      NULLIF(BTRIM("content"), ''),
      "created_at",
      "updated_at"
    FROM "diaries"
    WHERE "rating" IS NOT NULL OR NULLIF(BTRIM("content"), '') IS NOT NULL
    ON CONFLICT ("diary_id", "account_id") DO NOTHING`);
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "watch_sources"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "watch_reactions"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "watch_participants"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "watch_event_shares"`);
  }
}
