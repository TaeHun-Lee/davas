import { MigrationInterface, QueryRunner } from 'typeorm';

export class CanonicalCatalogAvailability1720670900000 implements MigrationInterface {
  name = 'CanonicalCatalogAvailability1720670900000';

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE IF NOT EXISTS "external_content_refs" (
      "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      "content_id" uuid NOT NULL,
      "provider" varchar(40) NOT NULL,
      "external_id" varchar(120) NOT NULL,
      "source" varchar(80) NOT NULL,
      "last_synced_at" timestamptz NOT NULL,
      "created_at" timestamptz NOT NULL DEFAULT now(),
      "updated_at" timestamptz NOT NULL DEFAULT now(),
      CONSTRAINT "UQ_external_content_ref_provider_id" UNIQUE ("provider", "external_id"),
      CONSTRAINT "UQ_external_content_ref_content_provider" UNIQUE ("content_id", "provider"),
      CONSTRAINT "FK_external_content_ref_content" FOREIGN KEY ("content_id") REFERENCES "media"("id") ON DELETE CASCADE
    )`);

    await queryRunner.query(`INSERT INTO "external_content_refs" (
      "content_id", "provider", "external_id", "source", "last_synced_at", "created_at", "updated_at"
    )
    SELECT "id", "external_provider", "external_id", "external_provider", "updated_at", "created_at", "updated_at"
    FROM "media"
    ON CONFLICT ("provider", "external_id") DO NOTHING`);

    await queryRunner.query(`CREATE TABLE IF NOT EXISTS "availability_observations" (
      "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      "content_id" uuid NOT NULL,
      "region" char(2) NOT NULL,
      "source_provider" varchar(40) NOT NULL,
      "provider" varchar(100) NOT NULL,
      "offer_type" varchar(30) NOT NULL,
      "status" varchar(30) NOT NULL,
      "observed_at" timestamptz NOT NULL,
      "expires_at" timestamptz NOT NULL,
      "confidence" decimal(4,3) NOT NULL,
      "created_at" timestamptz NOT NULL DEFAULT now(),
      CONSTRAINT "UQ_availability_observation" UNIQUE (
        "content_id", "region", "source_provider", "provider", "offer_type", "observed_at"
      ),
      CONSTRAINT "CHK_availability_status" CHECK (
        "status" IN ('AVAILABLE', 'NO_OFFERS', 'PROVIDER_FAILURE', 'UNMAPPED')
      ),
      CONSTRAINT "CHK_availability_offer_type" CHECK (
        "offer_type" IN ('STREAM', 'RENT', 'BUY', 'FREE', 'ADS', 'NONE')
      ),
      CONSTRAINT "CHK_availability_confidence" CHECK ("confidence" BETWEEN 0 AND 1),
      CONSTRAINT "CHK_availability_expiry" CHECK ("expires_at" > "observed_at"),
      CONSTRAINT "FK_availability_content" FOREIGN KEY ("content_id") REFERENCES "media"("id") ON DELETE CASCADE
    )`);
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "IDX_availability_current" ON "availability_observations" ("content_id", "region", "observed_at" DESC)`,
    );
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "availability_observations"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "external_content_refs"`);
  }
}
