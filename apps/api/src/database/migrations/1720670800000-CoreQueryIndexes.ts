import type { MigrationInterface, QueryRunner } from 'typeorm';

export class CoreQueryIndexes1720670800000 implements MigrationInterface {
  name = 'CoreQueryIndexes1720670800000';

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "IDX_friendship_requester_receiver_status"
      ON "friendships" ("requester_id", "receiver_id", "status")
    `);
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "IDX_friendship_receiver_requester_status"
      ON "friendships" ("receiver_id", "requester_id", "status")
    `);
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "IDX_diary_visible_feed_cursor"
      ON "diaries" (
        "shared_at" DESC NULLS LAST,
        "created_at" DESC,
        "id" DESC
      )
      WHERE "deleted_at" IS NULL
        AND "visibility" IN ('FRIENDS', 'SELECTED')
    `);
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_diary_visible_feed_cursor"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_friendship_receiver_requester_status"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_friendship_requester_receiver_status"`);
  }
}
