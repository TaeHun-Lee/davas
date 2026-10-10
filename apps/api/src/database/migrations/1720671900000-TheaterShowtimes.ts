import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Theater showtimes in Seoul and Gyeonggi from KOFIC's integrated ticketing network (KOBIS),
 * read once a day: the theaters, each theater's screenings for the coming week, the KOBIS
 * films linked to TMDB titles, and a log of the daily runs. New tables only.
 */
export class TheaterShowtimes1720671900000 implements MigrationInterface {
  name = 'TheaterShowtimes1720671900000';

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "kobis_theaters" (
        "code" varchar(16) PRIMARY KEY,
        "name" varchar(120) NOT NULL,
        "wide_area_code" varchar(16) NOT NULL,
        "wide_area_name" varchar(40) NOT NULL,
        "basic_area_code" varchar(16) NOT NULL,
        "basic_area_name" varchar(40) NOT NULL,
        "homepage_url" varchar(300),
        "last_seen_at" timestamptz NOT NULL DEFAULT now(),
        "created_at" timestamptz NOT NULL DEFAULT now(),
        "updated_at" timestamptz NOT NULL DEFAULT now()
      )
    `);
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "kobis_movies" (
        "code" varchar(16) PRIMARY KEY,
        "title" varchar(200) NOT NULL,
        "title_en" varchar(200),
        "production_year" smallint,
        "open_date" date,
        "directors" text[] NOT NULL DEFAULT '{}',
        "tmdb_id" varchar(32),
        "tmdb" jsonb,
        "match_status" varchar(16) NOT NULL DEFAULT 'PENDING',
        "checked_at" timestamptz,
        "created_at" timestamptz NOT NULL DEFAULT now(),
        "updated_at" timestamptz NOT NULL DEFAULT now()
      )
    `);
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "IDX_kobis_movies_tmdb_id" ON "kobis_movies" ("tmdb_id")`,
    );
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "kobis_showtimes" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "theater_code" varchar(16) NOT NULL REFERENCES "kobis_theaters" ("code") ON DELETE CASCADE,
        "show_date" date NOT NULL,
        "screen_name" varchar(80) NOT NULL,
        "movie_code" varchar(16) NOT NULL,
        "movie_title" varchar(200) NOT NULL,
        "format" varchar(16),
        "times" text[] NOT NULL,
        "fetched_at" timestamptz NOT NULL DEFAULT now()
      )
    `);
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "IDX_kobis_showtimes_movie_date" ON "kobis_showtimes" ("movie_code", "show_date")`,
    );
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "IDX_kobis_showtimes_theater_date" ON "kobis_showtimes" ("theater_code", "show_date")`,
    );
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "kobis_sync_runs" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "started_at" timestamptz NOT NULL,
        "finished_at" timestamptz,
        "status" varchar(16) NOT NULL,
        "theaters" integer NOT NULL DEFAULT 0,
        "failed_theaters" integer NOT NULL DEFAULT 0,
        "requests" integer NOT NULL DEFAULT 0,
        "showtimes" integer NOT NULL DEFAULT 0,
        "movies_matched" integer NOT NULL DEFAULT 0,
        "error" text
      )
    `);
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "IDX_kobis_sync_runs_started" ON "kobis_sync_runs" ("started_at")`,
    );
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "kobis_sync_runs"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "kobis_showtimes"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "kobis_movies"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "kobis_theaters"`);
  }
}
