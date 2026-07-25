import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Creates the schema that existed before TypeORM migrations were introduced.
 *
 * Every statement is additive so this migration is safe for the legacy
 * synchronize-created production database as well as an empty PostgreSQL
 * database. The down migration intentionally preserves these pre-existing
 * tables: an exact rollback must restore the pre-migration backup.
 */
export class BaseSchema1720670300000 implements MigrationInterface {
  name = 'BaseSchema1720670300000';

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE IF NOT EXISTS "users" (
      "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      "email" varchar NOT NULL UNIQUE,
      "password_hash" varchar NOT NULL,
      "nickname" varchar NOT NULL UNIQUE,
      "profile_image_url" varchar,
      "bio" text,
      "preferred_genres" text[] NOT NULL DEFAULT '{}',
      "created_at" timestamp NOT NULL DEFAULT now(),
      "updated_at" timestamp NOT NULL DEFAULT now(),
      "deleted_at" timestamp
    )`);

    await queryRunner.query(`CREATE TABLE IF NOT EXISTS "media" (
      "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      "external_provider" varchar(20) NOT NULL,
      "external_id" varchar NOT NULL,
      "media_type" varchar(20) NOT NULL,
      "title" varchar NOT NULL,
      "original_title" varchar,
      "overview" text,
      "short_plot" text,
      "poster_url" varchar,
      "backdrop_url" varchar,
      "tagline" text,
      "release_date" date,
      "genres" text[] NOT NULL DEFAULT '{}',
      "country" varchar,
      "countries" text[] NOT NULL DEFAULT '{}',
      "runtime" integer,
      "tmdb_rating" decimal(3,1),
      "tmdb_vote_count" integer,
      "director" varchar,
      "creators" text[] NOT NULL DEFAULT '{}',
      "cast" text[] NOT NULL DEFAULT '{}',
      "certification" varchar,
      "created_at" timestamp NOT NULL DEFAULT now(),
      "updated_at" timestamp NOT NULL DEFAULT now(),
      CONSTRAINT "UQ_media_provider_id" UNIQUE ("external_provider", "external_id")
    )`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS "IDX_media_title" ON "media" ("title")`);

    await queryRunner.query(`CREATE TABLE IF NOT EXISTS "media_images" (
      "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      "media_id" uuid NOT NULL,
      "type" varchar(30) NOT NULL,
      "image_url" varchar NOT NULL,
      "source" varchar,
      "order" integer NOT NULL DEFAULT 0,
      "created_at" timestamp NOT NULL DEFAULT now(),
      CONSTRAINT "FK_media_image_media" FOREIGN KEY ("media_id") REFERENCES "media"("id") ON DELETE CASCADE
    )`);

    await queryRunner.query(`CREATE TABLE IF NOT EXISTS "media_favorites" (
      "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      "user_id" uuid NOT NULL,
      "media_id" uuid NOT NULL,
      "created_at" timestamp NOT NULL DEFAULT now(),
      CONSTRAINT "UQ_media_favorite" UNIQUE ("user_id", "media_id"),
      CONSTRAINT "FK_media_favorite_user" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE,
      CONSTRAINT "FK_media_favorite_media" FOREIGN KEY ("media_id") REFERENCES "media"("id") ON DELETE CASCADE
    )`);

    await queryRunner.query(`CREATE TABLE IF NOT EXISTS "diaries" (
      "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      "user_id" uuid NOT NULL,
      "media_id" uuid NOT NULL,
      "title" varchar(120) NOT NULL,
      "content" text NOT NULL,
      "watched_date" date NOT NULL,
      "rating" decimal(2,1) NOT NULL,
      "visibility" varchar(20) NOT NULL DEFAULT 'PUBLIC',
      "has_spoiler" boolean NOT NULL DEFAULT false,
      "created_at" timestamp NOT NULL DEFAULT now(),
      "updated_at" timestamp NOT NULL DEFAULT now(),
      "deleted_at" timestamp,
      CONSTRAINT "FK_diary_user" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE,
      CONSTRAINT "FK_diary_media" FOREIGN KEY ("media_id") REFERENCES "media"("id") ON DELETE CASCADE
    )`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS "IDX_diary_user_watched" ON "diaries" ("user_id", "watched_date")`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS "IDX_diary_media_visibility" ON "diaries" ("media_id", "visibility")`);

    await queryRunner.query(`CREATE TABLE IF NOT EXISTS "diary_likes" (
      "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      "user_id" uuid NOT NULL,
      "diary_id" uuid NOT NULL,
      "created_at" timestamp NOT NULL DEFAULT now(),
      CONSTRAINT "UQ_diary_like" UNIQUE ("user_id", "diary_id"),
      CONSTRAINT "FK_diary_like_user" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE,
      CONSTRAINT "FK_diary_like_diary" FOREIGN KEY ("diary_id") REFERENCES "diaries"("id") ON DELETE CASCADE
    )`);

    await queryRunner.query(`CREATE TABLE IF NOT EXISTS "comments" (
      "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      "diary_id" uuid NOT NULL,
      "user_id" uuid NOT NULL,
      "content" text NOT NULL,
      "created_at" timestamp NOT NULL DEFAULT now(),
      "updated_at" timestamp NOT NULL DEFAULT now(),
      "deleted_at" timestamp,
      CONSTRAINT "FK_comment_diary" FOREIGN KEY ("diary_id") REFERENCES "diaries"("id") ON DELETE CASCADE,
      CONSTRAINT "FK_comment_user" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE
    )`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS "IDX_comment_diary_created" ON "comments" ("diary_id", "created_at")`);

    await queryRunner.query(`CREATE TABLE IF NOT EXISTS "user_follows" (
      "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      "follower_id" uuid NOT NULL,
      "following_id" uuid NOT NULL,
      "created_at" timestamp NOT NULL DEFAULT now(),
      CONSTRAINT "UQ_user_follow" UNIQUE ("follower_id", "following_id"),
      CONSTRAINT "FK_user_follow_follower" FOREIGN KEY ("follower_id") REFERENCES "users"("id") ON DELETE CASCADE,
      CONSTRAINT "FK_user_follow_following" FOREIGN KEY ("following_id") REFERENCES "users"("id") ON DELETE CASCADE
    )`);

    await queryRunner.query(`CREATE TABLE IF NOT EXISTS "notifications" (
      "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      "user_id" uuid NOT NULL,
      "actor_id" uuid NOT NULL,
      "diary_id" uuid,
      "type" varchar(32) NOT NULL,
      "read_at" timestamp,
      "created_at" timestamp NOT NULL DEFAULT now(),
      CONSTRAINT "FK_notification_user" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE,
      CONSTRAINT "FK_notification_actor" FOREIGN KEY ("actor_id") REFERENCES "users"("id") ON DELETE CASCADE,
      CONSTRAINT "FK_notification_diary" FOREIGN KEY ("diary_id") REFERENCES "diaries"("id") ON DELETE CASCADE
    )`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS "IDX_notification_user_created" ON "notifications" ("user_id", "created_at")`);
  }

  async down(_queryRunner: QueryRunner): Promise<void> {
    // These tables may predate migrations. Preserve them and restore the
    // pre-migration backup for an exact rollback instead of dropping data.
  }
}
