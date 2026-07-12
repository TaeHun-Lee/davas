import { MigrationInterface, QueryRunner } from 'typeorm';

export class FriendInvitesAndConsents1720670600000 implements MigrationInterface {
  name = 'FriendInvitesAndConsents1720670600000';

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE IF NOT EXISTS "friend_invites" ("id" uuid PRIMARY KEY DEFAULT gen_random_uuid(), "token_hash" varchar(64) NOT NULL UNIQUE, "inviter_id" uuid NOT NULL, "expires_at" timestamp NOT NULL, "used_at" timestamp, "used_by_user_id" uuid, "revoked_at" timestamp, "created_at" timestamp NOT NULL DEFAULT now(), CONSTRAINT "FK_friend_invite_inviter" FOREIGN KEY ("inviter_id") REFERENCES "users"("id") ON DELETE CASCADE, CONSTRAINT "FK_friend_invite_used_by" FOREIGN KEY ("used_by_user_id") REFERENCES "users"("id") ON DELETE SET NULL)`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS "IDX_friend_invite_inviter_active" ON "friend_invites" ("inviter_id", "expires_at")`);
    await queryRunner.query(`CREATE TABLE IF NOT EXISTS "user_consents" ("id" uuid PRIMARY KEY DEFAULT gen_random_uuid(), "user_id" uuid NOT NULL, "terms_version" varchar(40) NOT NULL, "privacy_version" varchar(40) NOT NULL, "accepted_at" timestamp NOT NULL DEFAULT now(), CONSTRAINT "UQ_user_consent_versions" UNIQUE ("user_id", "terms_version", "privacy_version"), CONSTRAINT "FK_user_consent_user" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE)`);
    await queryRunner.query(`CREATE TABLE IF NOT EXISTS "file_cleanup_jobs" ("id" uuid PRIMARY KEY DEFAULT gen_random_uuid(), "user_id" uuid, "kind" varchar(40) NOT NULL, "path" text NOT NULL, "attempts" integer NOT NULL DEFAULT 0, "last_error" text, "completed_at" timestamp, "created_at" timestamp NOT NULL DEFAULT now())`);
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "file_cleanup_jobs"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "user_consents"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "friend_invites"`);
  }
}
