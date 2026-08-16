import { MigrationInterface, QueryRunner } from 'typeorm';

export class SpacesMembershipInvites1720670700000 implements MigrationInterface {
  name = 'SpacesMembershipInvites1720670700000';

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE IF NOT EXISTS "spaces" (
      "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      "name" varchar(80) NOT NULL,
      "status" varchar(20) NOT NULL DEFAULT 'ACTIVE',
      "max_members" smallint NOT NULL DEFAULT 5,
      "owner_account_id" uuid NOT NULL,
      "closed_at" timestamptz,
      "created_at" timestamptz NOT NULL DEFAULT now(),
      "updated_at" timestamptz NOT NULL DEFAULT now(),
      CONSTRAINT "CHK_spaces_status" CHECK ("status" IN ('ACTIVE', 'CLOSED')),
      CONSTRAINT "CHK_spaces_max_members" CHECK ("max_members" BETWEEN 2 AND 5),
      CONSTRAINT "FK_spaces_owner_account" FOREIGN KEY ("owner_account_id") REFERENCES "users"("id") ON DELETE RESTRICT
    )`);
    await queryRunner.query(`CREATE TABLE IF NOT EXISTS "space_memberships" (
      "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      "space_id" uuid NOT NULL,
      "account_id" uuid NOT NULL,
      "role" varchar(20) NOT NULL DEFAULT 'MEMBER',
      "status" varchar(20) NOT NULL DEFAULT 'ACTIVE',
      "joined_at" timestamptz NOT NULL DEFAULT now(),
      "left_at" timestamptz,
      CONSTRAINT "UQ_space_membership_account" UNIQUE ("space_id", "account_id"),
      CONSTRAINT "CHK_space_membership_role" CHECK ("role" IN ('OWNER', 'MEMBER')),
      CONSTRAINT "CHK_space_membership_status" CHECK ("status" IN ('ACTIVE', 'LEFT')),
      CONSTRAINT "FK_space_membership_space" FOREIGN KEY ("space_id") REFERENCES "spaces"("id") ON DELETE CASCADE,
      CONSTRAINT "FK_space_membership_account" FOREIGN KEY ("account_id") REFERENCES "users"("id") ON DELETE CASCADE
    )`);
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "IDX_space_membership_active" ON "space_memberships" ("space_id", "status")`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX IF NOT EXISTS "UQ_space_active_owner" ON "space_memberships" ("space_id") WHERE "role" = 'OWNER' AND "status" = 'ACTIVE'`,
    );
    await queryRunner.query(`CREATE TABLE IF NOT EXISTS "space_invites" (
      "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      "space_id" uuid NOT NULL,
      "token_hash" varchar(64) NOT NULL UNIQUE,
      "inviter_account_id" uuid NOT NULL,
      "expires_at" timestamptz NOT NULL,
      "used_at" timestamptz,
      "used_by_account_id" uuid,
      "revoked_at" timestamptz,
      "created_at" timestamptz NOT NULL DEFAULT now(),
      CONSTRAINT "FK_space_invite_space" FOREIGN KEY ("space_id") REFERENCES "spaces"("id") ON DELETE CASCADE,
      CONSTRAINT "FK_space_invite_inviter" FOREIGN KEY ("inviter_account_id") REFERENCES "users"("id") ON DELETE CASCADE,
      CONSTRAINT "FK_space_invite_used_by" FOREIGN KEY ("used_by_account_id") REFERENCES "users"("id") ON DELETE SET NULL
    )`);
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "IDX_space_invite_space_expiry" ON "space_invites" ("space_id", "expires_at")`,
    );
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "space_invites"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "space_memberships"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "spaces"`);
  }
}
