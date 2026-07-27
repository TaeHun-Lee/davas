import type { MigrationInterface, QueryRunner } from 'typeorm';

const INDEX_NAME = 'IDX_diary_visible_feed_cursor';

export class FeedIndexSharedAtPredicate1720670900000 implements MigrationInterface {
  name = 'FeedIndexSharedAtPredicate1720670900000';

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX IF EXISTS "${INDEX_NAME}"`);
    await queryRunner.query(`
      CREATE INDEX "${INDEX_NAME}"
      ON "diaries" (
        "shared_at" DESC NULLS LAST,
        "created_at" DESC,
        "id" DESC
      )
      WHERE "deleted_at" IS NULL
        AND "shared_at" IS NOT NULL
        AND "visibility" IN ('FRIENDS', 'SELECTED')
    `);
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX IF EXISTS "${INDEX_NAME}"`);
    await queryRunner.query(`
      CREATE INDEX "${INDEX_NAME}"
      ON "diaries" (
        "shared_at" DESC NULLS LAST,
        "created_at" DESC,
        "id" DESC
      )
      WHERE "deleted_at" IS NULL
        AND "visibility" IN ('FRIENDS', 'SELECTED')
    `);
  }
}
