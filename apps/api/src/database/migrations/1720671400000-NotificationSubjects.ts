import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Lets a notification point at a title as well as a record, for "둘 다 보고 싶어요" matches on
 * the shared list. Additive only; existing rows keep a null media id.
 */
export class NotificationSubjects1720671400000 implements MigrationInterface {
  name = 'NotificationSubjects1720671400000';

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "notifications" ADD COLUMN IF NOT EXISTS "media_id" uuid`);
    await queryRunner.query(`DO $$ BEGIN
      ALTER TABLE "notifications" ADD CONSTRAINT "FK_notification_media"
        FOREIGN KEY ("media_id") REFERENCES "media"("id") ON DELETE CASCADE;
    EXCEPTION WHEN duplicate_object THEN NULL; END $$`);
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "IDX_notification_user_unread" ON "notifications" ("user_id") WHERE "read_at" IS NULL`,
    );
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_notification_user_unread"`);
    await queryRunner.query(
      `ALTER TABLE "notifications" DROP CONSTRAINT IF EXISTS "FK_notification_media"`,
    );
    await queryRunner.query(`ALTER TABLE "notifications" DROP COLUMN IF EXISTS "media_id"`);
  }
}
