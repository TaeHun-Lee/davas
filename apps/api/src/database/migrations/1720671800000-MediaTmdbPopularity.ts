import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * TMDB's popularity of a title, read when the title is stored and whenever a discover result
 * shows it again. Group picks rank popular recent releases higher, because that is what the
 * people using Davas mostly watch. Additive only; existing titles stay empty until seen again.
 */
export class MediaTmdbPopularity1720671800000 implements MigrationInterface {
  name = 'MediaTmdbPopularity1720671800000';

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "media" ADD COLUMN IF NOT EXISTS "tmdb_popularity" double precision`,
    );
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "media" DROP COLUMN IF EXISTS "tmdb_popularity"`);
  }
}
