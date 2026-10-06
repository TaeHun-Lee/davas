import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Choosing together: each person's OTT subscriptions, and a per-space "같이 보고 싶어요" list
 * where one row means "this member wants to watch this title". Additive only.
 */
export class SpaceWishesAndSubscriptions1720671300000 implements MigrationInterface {
  name = 'SpaceWishesAndSubscriptions1720671300000';

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "ott_services" text[] NOT NULL DEFAULT '{}'`,
    );

    await queryRunner.query(`CREATE TABLE IF NOT EXISTS "space_wishes" (
      "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      "space_id" uuid NOT NULL,
      "media_id" uuid NOT NULL,
      "account_id" uuid NOT NULL,
      "created_at" timestamptz NOT NULL DEFAULT now(),
      CONSTRAINT "UQ_space_wish_member" UNIQUE ("space_id", "media_id", "account_id"),
      CONSTRAINT "FK_space_wish_space" FOREIGN KEY ("space_id") REFERENCES "spaces"("id") ON DELETE CASCADE,
      CONSTRAINT "FK_space_wish_media" FOREIGN KEY ("media_id") REFERENCES "media"("id") ON DELETE CASCADE,
      CONSTRAINT "FK_space_wish_account" FOREIGN KEY ("account_id") REFERENCES "users"("id") ON DELETE CASCADE
    )`);
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "IDX_space_wish_space_created" ON "space_wishes" ("space_id", "created_at" DESC)`,
    );
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "space_wishes"`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN IF EXISTS "ott_services"`);
  }
}
