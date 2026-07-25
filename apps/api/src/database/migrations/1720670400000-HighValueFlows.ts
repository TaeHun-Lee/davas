import { MigrationInterface, QueryRunner } from 'typeorm';

export class HighValueFlows1720670400000 implements MigrationInterface {
  name = 'HighValueFlows1720670400000';

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "diaries" ADD COLUMN IF NOT EXISTS "watched_place" varchar(160)`);
    await queryRunner.query(`ALTER TABLE "diaries" ADD COLUMN IF NOT EXISTS "mood" varchar(80)`);
    await queryRunner.query(`ALTER TABLE "diaries" ADD COLUMN IF NOT EXISTS "memory_note" text`);
    await queryRunner.query(`ALTER TABLE "diaries" ALTER COLUMN "visibility" SET DEFAULT 'PRIVATE'`);
    await queryRunner.query(`UPDATE "diaries" SET "visibility" = 'PRIVATE' WHERE "visibility" = 'PUBLIC'`);
    await queryRunner.query(`ALTER TABLE "diaries" DROP CONSTRAINT IF EXISTS "CK_diary_visibility"`);
    await queryRunner.query(`ALTER TABLE "diaries" ADD CONSTRAINT "CK_diary_visibility" CHECK ("visibility" IN ('PRIVATE', 'FRIENDS', 'SELECTED'))`);

    await queryRunner.query(`CREATE TABLE IF NOT EXISTS "invite_codes" ("id" uuid PRIMARY KEY DEFAULT gen_random_uuid(), "code" varchar(32) NOT NULL UNIQUE, "created_by_id" uuid, "max_uses" integer NOT NULL DEFAULT 1 CHECK ("max_uses" > 0), "used_count" integer NOT NULL DEFAULT 0, "expires_at" timestamp NOT NULL, "created_at" timestamp NOT NULL DEFAULT now(), CONSTRAINT "CK_invite_usage" CHECK ("used_count" >= 0 AND "used_count" <= "max_uses"), CONSTRAINT "FK_invite_creator" FOREIGN KEY ("created_by_id") REFERENCES "users"("id") ON DELETE SET NULL)`);
    await queryRunner.query(`CREATE TABLE IF NOT EXISTS "invite_uses" ("id" uuid PRIMARY KEY DEFAULT gen_random_uuid(), "invite_id" uuid NOT NULL, "user_id" uuid NOT NULL, "used_at" timestamp NOT NULL DEFAULT now(), CONSTRAINT "UQ_invite_use" UNIQUE ("invite_id", "user_id"), CONSTRAINT "FK_invite_use_invite" FOREIGN KEY ("invite_id") REFERENCES "invite_codes"("id") ON DELETE CASCADE, CONSTRAINT "FK_invite_use_user" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE)`);
    await queryRunner.query(`CREATE TABLE IF NOT EXISTS "friendships" ("id" uuid PRIMARY KEY DEFAULT gen_random_uuid(), "pair_key" varchar(80) NOT NULL UNIQUE, "requester_id" uuid NOT NULL, "receiver_id" uuid NOT NULL, "status" varchar(20) NOT NULL DEFAULT 'PENDING', "created_at" timestamp NOT NULL DEFAULT now(), "updated_at" timestamp NOT NULL DEFAULT now(), CONSTRAINT "CK_friendship_not_self" CHECK ("requester_id" <> "receiver_id"), CONSTRAINT "FK_friendship_requester" FOREIGN KEY ("requester_id") REFERENCES "users"("id") ON DELETE CASCADE, CONSTRAINT "FK_friendship_receiver" FOREIGN KEY ("receiver_id") REFERENCES "users"("id") ON DELETE CASCADE)`);
    await queryRunner.query(`INSERT INTO "friendships" ("pair_key", "requester_id", "receiver_id", "status") SELECT LEAST(a."follower_id", a."following_id")::text || ':' || GREATEST(a."follower_id", a."following_id")::text, LEAST(a."follower_id", a."following_id"), GREATEST(a."follower_id", a."following_id"), 'ACCEPTED' FROM "user_follows" a INNER JOIN "user_follows" b ON a."follower_id" = b."following_id" AND a."following_id" = b."follower_id" WHERE a."follower_id" < a."following_id" ON CONFLICT ("pair_key") DO NOTHING`);
    await queryRunner.query(`CREATE TABLE IF NOT EXISTS "diary_shares" ("id" uuid PRIMARY KEY DEFAULT gen_random_uuid(), "diary_id" uuid NOT NULL, "user_id" uuid NOT NULL, CONSTRAINT "UQ_diary_share" UNIQUE ("diary_id", "user_id"), CONSTRAINT "FK_diary_share_diary" FOREIGN KEY ("diary_id") REFERENCES "diaries"("id") ON DELETE CASCADE, CONSTRAINT "FK_diary_share_user" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE)`);
    await queryRunner.query(`CREATE TABLE IF NOT EXISTS "diary_companions" ("id" uuid PRIMARY KEY DEFAULT gen_random_uuid(), "diary_id" uuid NOT NULL, "user_id" uuid, "display_name" varchar(60) NOT NULL, CONSTRAINT "FK_diary_companion_diary" FOREIGN KEY ("diary_id") REFERENCES "diaries"("id") ON DELETE CASCADE, CONSTRAINT "FK_diary_companion_user" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL)`);
    await queryRunner.query(`CREATE UNIQUE INDEX IF NOT EXISTS "IDX_diary_companion_user" ON "diary_companions" ("diary_id", "user_id") WHERE "user_id" IS NOT NULL`);
    await queryRunner.query(`CREATE TABLE IF NOT EXISTS "watchlist_items" ("id" uuid PRIMARY KEY DEFAULT gen_random_uuid(), "user_id" uuid NOT NULL, "media_id" uuid NOT NULL, "priority" varchar(12) NOT NULL DEFAULT 'MEDIUM', "memo" varchar(500) NOT NULL DEFAULT '', "planned_with" varchar(120) NOT NULL DEFAULT '', "status" varchar(12) NOT NULL DEFAULT 'ACTIVE', "created_at" timestamp NOT NULL DEFAULT now(), "updated_at" timestamp NOT NULL DEFAULT now(), CONSTRAINT "UQ_watchlist_media" UNIQUE ("user_id", "media_id"), CONSTRAINT "FK_watchlist_user" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE, CONSTRAINT "FK_watchlist_media" FOREIGN KEY ("media_id") REFERENCES "media"("id") ON DELETE CASCADE)`);
    await queryRunner.query(`INSERT INTO "watchlist_items" ("id", "user_id", "media_id", "created_at", "updated_at") SELECT "id", "user_id", "media_id", "created_at", "created_at" FROM "media_favorites" ON CONFLICT ("user_id", "media_id") DO NOTHING`);
    await queryRunner.query(`CREATE TABLE IF NOT EXISTS "diary_reactions" ("id" uuid PRIMARY KEY DEFAULT gen_random_uuid(), "user_id" uuid NOT NULL, "diary_id" uuid NOT NULL, "emoji" varchar(16) NOT NULL, "created_at" timestamp NOT NULL DEFAULT now(), CONSTRAINT "UQ_diary_reaction" UNIQUE ("user_id", "diary_id", "emoji"), CONSTRAINT "FK_reaction_user" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE, CONSTRAINT "FK_reaction_diary" FOREIGN KEY ("diary_id") REFERENCES "diaries"("id") ON DELETE CASCADE)`);
    await queryRunner.query(`INSERT INTO "diary_reactions" ("id", "user_id", "diary_id", "emoji", "created_at") SELECT "id", "user_id", "diary_id", 'HEART', "created_at" FROM "diary_likes" ON CONFLICT ("user_id", "diary_id", "emoji") DO NOTHING`);
    await queryRunner.query(`ALTER TABLE "friendships" ADD CONSTRAINT "CK_friendship_status" CHECK ("status" IN ('PENDING', 'ACCEPTED', 'REJECTED'))`);
    await queryRunner.query(`ALTER TABLE "watchlist_items" ADD CONSTRAINT "CK_watchlist_priority" CHECK ("priority" IN ('HIGH', 'MEDIUM', 'LOW'))`);
    await queryRunner.query(`ALTER TABLE "watchlist_items" ADD CONSTRAINT "CK_watchlist_status" CHECK ("status" IN ('ACTIVE', 'WATCHED'))`);
    await queryRunner.query(`ALTER TABLE "diary_reactions" ADD CONSTRAINT "CK_reaction_emoji" CHECK ("emoji" IN ('HEART', 'CLAP', 'SMILE', 'TEAR'))`);
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "diary_reactions"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "watchlist_items"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "diary_companions"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "diary_shares"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "friendships"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "invite_uses"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "invite_codes"`);
    await queryRunner.query(`ALTER TABLE "diaries" DROP COLUMN IF EXISTS "memory_note"`);
    await queryRunner.query(`ALTER TABLE "diaries" DROP COLUMN IF EXISTS "mood"`);
    await queryRunner.query(`ALTER TABLE "diaries" DROP COLUMN IF EXISTS "watched_place"`);
    await queryRunner.query(`ALTER TABLE "diaries" DROP CONSTRAINT IF EXISTS "CK_diary_visibility"`);
    await queryRunner.query(`ALTER TABLE "diaries" ALTER COLUMN "visibility" SET DEFAULT 'PUBLIC'`);
  }
}
