import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * TMDB numbers movies and series separately, so a movie and a series can share an id. The
 * provider link now records the media type and is unique per (provider, type, id), so a
 * series no longer loses its link to a movie with the same number. Existing links take the
 * type of the title they point to.
 */
export class ExternalContentRefMediaType1720671600000 implements MigrationInterface {
  name = 'ExternalContentRefMediaType1720671600000';

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "external_content_refs" ADD COLUMN IF NOT EXISTS "media_type" varchar(20)`,
    );
    await queryRunner.query(`UPDATE "external_content_refs" AS "ref"
      SET "media_type" = "media"."media_type"
      FROM "media"
      WHERE "media"."id" = "ref"."content_id" AND "ref"."media_type" IS NULL`);
    await queryRunner.query(
      `ALTER TABLE "external_content_refs" ALTER COLUMN "media_type" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "external_content_refs" DROP CONSTRAINT IF EXISTS "UQ_external_content_ref_provider_id"`,
    );
    await queryRunner.query(`DO $$ BEGIN
      ALTER TABLE "external_content_refs" ADD CONSTRAINT "UQ_external_content_ref_provider_type_id"
        UNIQUE ("provider", "media_type", "external_id");
    EXCEPTION WHEN duplicate_object OR duplicate_table THEN NULL; END $$`);
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    // Restoring the old key fails if a movie and a series now share a number; restore the
    // pre-release backup in that case (docs/operations.md).
    await queryRunner.query(
      `ALTER TABLE "external_content_refs" DROP CONSTRAINT IF EXISTS "UQ_external_content_ref_provider_type_id"`,
    );
    await queryRunner.query(`DO $$ BEGIN
      ALTER TABLE "external_content_refs" ADD CONSTRAINT "UQ_external_content_ref_provider_id"
        UNIQUE ("provider", "external_id");
    EXCEPTION WHEN duplicate_object OR duplicate_table THEN NULL; END $$`);
    await queryRunner.query(
      `ALTER TABLE "external_content_refs" DROP COLUMN IF EXISTS "media_type"`,
    );
  }
}
