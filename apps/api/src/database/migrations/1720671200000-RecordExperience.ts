import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Richer watch records: a one-line headline, spoiler and blind flags on each person's review,
 * theater/series details on the source, photos, and likes on reviews. Additive only.
 */
export class RecordExperience1720671200000 implements MigrationInterface {
  name = 'RecordExperience1720671200000';

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "watch_reactions"
      ADD COLUMN IF NOT EXISTS "headline" varchar(40),
      ADD COLUMN IF NOT EXISTS "has_spoiler" boolean NOT NULL DEFAULT false,
      ADD COLUMN IF NOT EXISTS "is_blind" boolean NOT NULL DEFAULT false`);

    await queryRunner.query(`ALTER TABLE "watch_sources"
      ADD COLUMN IF NOT EXISTS "theater_format" varchar(16),
      ADD COLUMN IF NOT EXISTS "seat_text" varchar(40),
      ADD COLUMN IF NOT EXISTS "episode_watched" smallint,
      ADD COLUMN IF NOT EXISTS "episode_total" smallint,
      ADD COLUMN IF NOT EXISTS "completed" boolean NOT NULL DEFAULT false`);
    await queryRunner.query(`DO $$ BEGIN
      ALTER TABLE "watch_sources" ADD CONSTRAINT "CHK_watch_source_theater_format"
        CHECK ("theater_format" IS NULL OR "theater_format" IN ('STANDARD', 'IMAX', 'FOUR_DX', 'DOLBY'));
    EXCEPTION WHEN duplicate_object THEN NULL; END $$`);
    await queryRunner.query(`DO $$ BEGIN
      ALTER TABLE "watch_sources" ADD CONSTRAINT "CHK_watch_source_episodes"
        CHECK (("episode_watched" IS NULL OR "episode_watched" BETWEEN 1 AND 2000)
          AND ("episode_total" IS NULL OR "episode_total" BETWEEN 1 AND 2000)
          AND ("episode_watched" IS NULL OR "episode_total" IS NULL OR "episode_watched" <= "episode_total"));
    EXCEPTION WHEN duplicate_object THEN NULL; END $$`);

    await queryRunner.query(`CREATE TABLE IF NOT EXISTS "watch_photos" (
      "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      "diary_id" uuid,
      "uploader_id" uuid NOT NULL,
      "position" smallint NOT NULL DEFAULT 0,
      "storage_key" varchar(64) NOT NULL,
      "original_mime_type" varchar(32) NOT NULL,
      "original_bytes" integer NOT NULL,
      "width" integer NOT NULL,
      "height" integer NOT NULL,
      "placeholder" text,
      "created_at" timestamptz NOT NULL DEFAULT now(),
      "attached_at" timestamptz,
      CONSTRAINT "UQ_watch_photo_storage_key" UNIQUE ("storage_key"),
      CONSTRAINT "CHK_watch_photo_position" CHECK ("position" BETWEEN 0 AND 9),
      CONSTRAINT "CHK_watch_photo_size" CHECK ("width" > 0 AND "height" > 0 AND "original_bytes" > 0),
      CONSTRAINT "FK_watch_photo_diary" FOREIGN KEY ("diary_id") REFERENCES "diaries"("id") ON DELETE CASCADE,
      CONSTRAINT "FK_watch_photo_uploader" FOREIGN KEY ("uploader_id") REFERENCES "users"("id") ON DELETE CASCADE
    )`);
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "IDX_watch_photo_diary_position" ON "watch_photos" ("diary_id", "position")`,
    );
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "IDX_watch_photo_uploader_created" ON "watch_photos" ("uploader_id", "created_at")`,
    );

    await queryRunner.query(`CREATE TABLE IF NOT EXISTS "watch_review_likes" (
      "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      "watch_reaction_id" uuid NOT NULL,
      "account_id" uuid NOT NULL,
      "created_at" timestamptz NOT NULL DEFAULT now(),
      CONSTRAINT "UQ_watch_review_like" UNIQUE ("watch_reaction_id", "account_id"),
      CONSTRAINT "FK_watch_review_like_reaction" FOREIGN KEY ("watch_reaction_id") REFERENCES "watch_reactions"("id") ON DELETE CASCADE,
      CONSTRAINT "FK_watch_review_like_account" FOREIGN KEY ("account_id") REFERENCES "users"("id") ON DELETE CASCADE
    )`);
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "watch_review_likes"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "watch_photos"`);
    await queryRunner.query(`ALTER TABLE "watch_sources"
      DROP CONSTRAINT IF EXISTS "CHK_watch_source_episodes",
      DROP CONSTRAINT IF EXISTS "CHK_watch_source_theater_format",
      DROP COLUMN IF EXISTS "completed",
      DROP COLUMN IF EXISTS "episode_total",
      DROP COLUMN IF EXISTS "episode_watched",
      DROP COLUMN IF EXISTS "seat_text",
      DROP COLUMN IF EXISTS "theater_format"`);
    await queryRunner.query(`ALTER TABLE "watch_reactions"
      DROP COLUMN IF EXISTS "is_blind",
      DROP COLUMN IF EXISTS "has_spoiler",
      DROP COLUMN IF EXISTS "headline"`);
  }
}
