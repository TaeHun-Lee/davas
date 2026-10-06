import type { MigrationInterface, QueryRunner } from 'typeorm';

const TRUSTED_TMDB_IMAGE_PATTERN = '^https://image[.]tmdb[.]org/t/p/';

export class LegacyTmdbImageSafety1720671000000 implements MigrationInterface {
  name = 'LegacyTmdbImageSafety1720671000000';

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      UPDATE "media"
      SET
        "poster_url" = CASE
          WHEN "poster_url" IS NOT NULL
            AND "poster_url" !~ '${TRUSTED_TMDB_IMAGE_PATTERN}'
          THEN NULL
          ELSE "poster_url"
        END,
        "backdrop_url" = CASE
          WHEN "backdrop_url" IS NOT NULL
            AND "backdrop_url" !~ '${TRUSTED_TMDB_IMAGE_PATTERN}'
          THEN NULL
          ELSE "backdrop_url"
        END
      WHERE "external_provider" = 'TMDB'
        AND (
          ("poster_url" IS NOT NULL AND "poster_url" !~ '${TRUSTED_TMDB_IMAGE_PATTERN}')
          OR
          ("backdrop_url" IS NOT NULL AND "backdrop_url" !~ '${TRUSTED_TMDB_IMAGE_PATTERN}')
        )
    `);
  }

  async down(_queryRunner: QueryRunner): Promise<void> {}
}
