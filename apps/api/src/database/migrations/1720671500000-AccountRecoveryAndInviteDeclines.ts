import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Password recovery without mail: one hashed recovery code per account, and a session version
 * that retires every earlier sign-in when the password changes. Space invites also record who
 * declined them. Additive only; existing accounts start at version 0 with no code.
 */
export class AccountRecoveryAndInviteDeclines1720671500000 implements MigrationInterface {
  name = 'AccountRecoveryAndInviteDeclines1720671500000';

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "session_version" integer NOT NULL DEFAULT 0`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "recovery_code_hash" varchar(100)`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "recovery_code_created_at" timestamptz`,
    );
    await queryRunner.query(
      `ALTER TABLE "space_invites" ADD COLUMN IF NOT EXISTS "declined_at" timestamptz`,
    );
    await queryRunner.query(
      `ALTER TABLE "space_invites" ADD COLUMN IF NOT EXISTS "declined_by_account_id" uuid`,
    );
    await queryRunner.query(`DO $$ BEGIN
      ALTER TABLE "space_invites" ADD CONSTRAINT "FK_space_invite_declined_by"
        FOREIGN KEY ("declined_by_account_id") REFERENCES "users"("id") ON DELETE SET NULL;
    EXCEPTION WHEN duplicate_object THEN NULL; END $$`);
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "space_invites" DROP CONSTRAINT IF EXISTS "FK_space_invite_declined_by"`,
    );
    await queryRunner.query(
      `ALTER TABLE "space_invites" DROP COLUMN IF EXISTS "declined_by_account_id"`,
    );
    await queryRunner.query(`ALTER TABLE "space_invites" DROP COLUMN IF EXISTS "declined_at"`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN IF EXISTS "recovery_code_created_at"`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN IF EXISTS "recovery_code_hash"`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN IF EXISTS "session_version"`);
  }
}
