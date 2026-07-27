import type { MigrationInterface, QueryRunner } from 'typeorm';

export class MediaCanonicalIdentity1720670700000 implements MigrationInterface {
  name = 'MediaCanonicalIdentity1720670700000';

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DO $$
      DECLARE old_constraint record;
      BEGIN
        FOR old_constraint IN
          SELECT tc.constraint_name
          FROM information_schema.table_constraints tc
          JOIN information_schema.key_column_usage kcu
            ON tc.constraint_schema = kcu.constraint_schema
           AND tc.constraint_name = kcu.constraint_name
          WHERE tc.table_schema = current_schema()
            AND tc.table_name = 'media'
            AND tc.constraint_type = 'UNIQUE'
          GROUP BY tc.constraint_name
          HAVING array_agg(kcu.column_name::text ORDER BY kcu.ordinal_position)
            = ARRAY['external_provider', 'external_id']::text[]
        LOOP
          EXECUTE format(
            'ALTER TABLE "media" DROP CONSTRAINT %I',
            old_constraint.constraint_name
          );
        END LOOP;
      END $$;
    `);

    await queryRunner.query(`
      DO $$
      DECLARE old_index record;
      BEGIN
        FOR old_index IN
          SELECT indexname
          FROM pg_indexes
          WHERE schemaname = current_schema()
            AND tablename = 'media'
            AND indexdef LIKE 'CREATE UNIQUE INDEX%'
            AND indexdef LIKE '%("external_provider", "external_id")%'
            AND indexdef NOT LIKE '%media_type%'
        LOOP
          EXECUTE format('DROP INDEX IF EXISTS %I', old_index.indexname);
        END LOOP;
      END $$;
    `);

    await queryRunner.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1
          FROM information_schema.table_constraints
          WHERE table_schema = current_schema()
            AND table_name = 'media'
            AND constraint_name = 'UQ_media_provider_id_type'
        ) THEN
          ALTER TABLE "media"
            ADD CONSTRAINT "UQ_media_provider_id_type"
            UNIQUE ("external_provider", "external_id", "media_type");
        END IF;
      END $$;
    `);
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE "media" DROP CONSTRAINT IF EXISTS "UQ_media_provider_id_type"',
    );
    await queryRunner.query(`
      ALTER TABLE "media"
        ADD CONSTRAINT "UQ_media_provider_id"
        UNIQUE ("external_provider", "external_id")
    `);
  }
}
