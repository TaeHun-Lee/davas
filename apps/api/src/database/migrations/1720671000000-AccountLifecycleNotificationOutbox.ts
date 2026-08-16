import { MigrationInterface, QueryRunner } from 'typeorm';

export class AccountLifecycleNotificationOutbox1720671000000
  implements MigrationInterface
{
  name = 'AccountLifecycleNotificationOutbox1720671000000';

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "status" varchar(24) NOT NULL DEFAULT 'ACTIVE'`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "deletion_requested_at" timestamptz`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "deletion_scheduled_for" timestamptz`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "anonymized_at" timestamptz`,
    );
    await queryRunner.query(
      `UPDATE "users" SET "status" = 'DELETED', "anonymized_at" = COALESCE("anonymized_at", "deleted_at") WHERE "deleted_at" IS NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD CONSTRAINT "CHK_user_status" CHECK ("status" IN ('ACTIVE', 'DELETION_PENDING', 'DELETED'))`,
    );
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "IDX_users_deletion_due" ON "users" ("deletion_scheduled_for") WHERE "status" = 'DELETION_PENDING'`,
    );

    await queryRunner.query(`CREATE TABLE IF NOT EXISTS "notification_preferences" (
      "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      "user_id" uuid NOT NULL,
      "category" varchar(40) NOT NULL,
      "enabled" boolean NOT NULL DEFAULT true,
      "created_at" timestamptz NOT NULL DEFAULT now(),
      "updated_at" timestamptz NOT NULL DEFAULT now(),
      CONSTRAINT "UQ_notification_preference" UNIQUE ("user_id", "category"),
      CONSTRAINT "CHK_notification_preference_category" CHECK ("category" IN ('SPACE_INVITE', 'WATCH_PARTICIPATION', 'SOCIAL', 'RECOMMENDATION')),
      CONSTRAINT "CHK_required_notification_enabled" CHECK ("enabled" OR "category" NOT IN ('SPACE_INVITE', 'WATCH_PARTICIPATION')),
      CONSTRAINT "FK_notification_preference_user" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE
    )`);

    await queryRunner.query(
      `ALTER TABLE "notifications" ADD COLUMN IF NOT EXISTS "idempotency_key" varchar(180)`,
    );
    await queryRunner.query(
      `UPDATE "notifications" SET "idempotency_key" = 'legacy:' || "id"::text WHERE "idempotency_key" IS NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "notifications" ALTER COLUMN "idempotency_key" SET NOT NULL`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX IF NOT EXISTS "UQ_notification_idempotency_key" ON "notifications" ("idempotency_key")`,
    );

    await queryRunner.query(`CREATE TABLE IF NOT EXISTS "transaction_outbox" (
      "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      "event_type" varchar(80) NOT NULL,
      "aggregate_type" varchar(80) NOT NULL,
      "aggregate_id" varchar(120) NOT NULL,
      "idempotency_key" varchar(180) NOT NULL,
      "payload" jsonb NOT NULL,
      "status" varchar(20) NOT NULL DEFAULT 'PENDING',
      "attempts" integer NOT NULL DEFAULT 0,
      "available_at" timestamptz NOT NULL DEFAULT now(),
      "processed_at" timestamptz,
      "last_error" varchar(500),
      "created_at" timestamptz NOT NULL DEFAULT now(),
      CONSTRAINT "UQ_transaction_outbox_idempotency" UNIQUE ("idempotency_key"),
      CONSTRAINT "CHK_transaction_outbox_status" CHECK ("status" IN ('PENDING', 'PROCESSING', 'PUBLISHED', 'FAILED'))
    )`);
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "IDX_transaction_outbox_pending" ON "transaction_outbox" ("status", "available_at") WHERE "status" IN ('PENDING', 'FAILED')`,
    );
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "transaction_outbox"`);
    await queryRunner.query(
      `DROP INDEX IF EXISTS "UQ_notification_idempotency_key"`,
    );
    await queryRunner.query(
      `ALTER TABLE "notifications" DROP COLUMN IF EXISTS "idempotency_key"`,
    );
    await queryRunner.query(`DROP TABLE IF EXISTS "notification_preferences"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_users_deletion_due"`);
    await queryRunner.query(
      `ALTER TABLE "users" DROP CONSTRAINT IF EXISTS "CHK_user_status"`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" DROP COLUMN IF EXISTS "anonymized_at"`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" DROP COLUMN IF EXISTS "deletion_scheduled_for"`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" DROP COLUMN IF EXISTS "deletion_requested_at"`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" DROP COLUMN IF EXISTS "status"`,
    );
  }
}
