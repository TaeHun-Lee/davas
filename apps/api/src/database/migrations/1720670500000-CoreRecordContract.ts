import { MigrationInterface, QueryRunner } from 'typeorm';

export class CoreRecordContract1720670500000 implements MigrationInterface {
  name = 'CoreRecordContract1720670500000';

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "diaries" ADD COLUMN IF NOT EXISTS "viewing_method" varchar(20)`);
    await queryRunner.query(`ALTER TABLE "diaries" ADD COLUMN IF NOT EXISTS "shared_at" timestamp`);
    await queryRunner.query(`ALTER TABLE "diaries" ADD COLUMN IF NOT EXISTS "client_request_id" uuid`);
    await queryRunner.query(`ALTER TABLE "diaries" ADD COLUMN IF NOT EXISTS "client_request_fingerprint" varchar(64)`);
    await queryRunner.query(`ALTER TABLE "diaries" ALTER COLUMN "rating" DROP NOT NULL`);
    await queryRunner.query(`UPDATE "diaries" SET "viewing_method" = 'THEATER' WHERE "viewing_method" IS NULL AND (LOWER(COALESCE("watched_place", '')) LIKE '%영화관%' OR LOWER(COALESCE("watched_place", '')) LIKE '%극장%')`);
    await queryRunner.query(`UPDATE "diaries" SET "viewing_method" = 'OTT' WHERE "viewing_method" IS NULL AND (LOWER(COALESCE("watched_place", '')) LIKE '%ott%' OR LOWER(COALESCE("watched_place", '')) ~ '(netflix|넷플릭스|watcha|왓챠|tving|티빙|wavve|웨이브|disney|디즈니|coupang play|쿠팡플레이|apple tv|애플tv)')`);
    await queryRunner.query(`UPDATE "diaries" SET "shared_at" = "created_at" WHERE "visibility" IN ('FRIENDS', 'SELECTED') AND "shared_at" IS NULL`);
    await queryRunner.query(`UPDATE "diaries" SET "shared_at" = NULL WHERE "visibility" = 'PRIVATE'`);
    await queryRunner.query(`ALTER TABLE "diaries" DROP CONSTRAINT IF EXISTS "CK_diary_viewing_method"`);
    await queryRunner.query(`ALTER TABLE "diaries" ADD CONSTRAINT "CK_diary_viewing_method" CHECK ("viewing_method" IS NULL OR "viewing_method" IN ('THEATER', 'OTT'))`);
    await queryRunner.query(`CREATE UNIQUE INDEX IF NOT EXISTS "IDX_diary_user_client_request" ON "diaries" ("user_id", "client_request_id") WHERE "client_request_id" IS NOT NULL`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS "IDX_diary_feed_cursor" ON "diaries" ("shared_at" DESC, "created_at" DESC, "id" DESC)`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS "IDX_diary_me_cursor" ON "diaries" ("user_id", "watched_date" DESC, "created_at" DESC, "id" DESC)`);
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_diary_me_cursor"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_diary_feed_cursor"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_diary_user_client_request"`);
    await queryRunner.query(`ALTER TABLE "diaries" DROP CONSTRAINT IF EXISTS "CK_diary_viewing_method"`);
    await queryRunner.query(`UPDATE "diaries" SET "rating" = 0 WHERE "rating" IS NULL`);
    await queryRunner.query(`ALTER TABLE "diaries" ALTER COLUMN "rating" SET NOT NULL`);
    await queryRunner.query(`ALTER TABLE "diaries" DROP COLUMN IF EXISTS "client_request_fingerprint"`);
    await queryRunner.query(`ALTER TABLE "diaries" DROP COLUMN IF EXISTS "client_request_id"`);
    await queryRunner.query(`ALTER TABLE "diaries" DROP COLUMN IF EXISTS "shared_at"`);
    await queryRunner.query(`ALTER TABLE "diaries" DROP COLUMN IF EXISTS "viewing_method"`);
  }
}
