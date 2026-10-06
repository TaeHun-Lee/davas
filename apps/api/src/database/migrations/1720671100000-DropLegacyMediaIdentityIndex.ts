import type { MigrationInterface, QueryRunner } from 'typeorm';

export class DropLegacyMediaIdentityIndex1720671100000 implements MigrationInterface {
  name = 'DropLegacyMediaIdentityIndex1720671100000';

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DO $$
      DECLARE old_index record;
      BEGIN
        FOR old_index IN
          SELECT
            namespace_catalog.nspname AS schema_name,
            index_class.relname AS index_name
          FROM pg_index index_catalog
          JOIN pg_class index_class
            ON index_class.oid = index_catalog.indexrelid
          JOIN pg_class table_class
            ON table_class.oid = index_catalog.indrelid
          JOIN pg_namespace namespace_catalog
            ON namespace_catalog.oid = table_class.relnamespace
          LEFT JOIN pg_constraint constraint_catalog
            ON constraint_catalog.conindid = index_catalog.indexrelid
          WHERE namespace_catalog.nspname = current_schema()
            AND table_class.relname = 'media'
            AND index_catalog.indisunique
            AND index_catalog.indnkeyatts = 2
            AND index_catalog.indnatts = 2
            AND constraint_catalog.oid IS NULL
            AND (
              SELECT array_agg(attribute.attname::text ORDER BY key_column.ordinality)
              FROM unnest(index_catalog.indkey::smallint[])
                WITH ORDINALITY AS key_column(attnum, ordinality)
              JOIN pg_attribute attribute
                ON attribute.attrelid = table_class.oid
               AND attribute.attnum = key_column.attnum
              WHERE key_column.ordinality <= index_catalog.indnkeyatts
            ) = ARRAY['external_provider', 'external_id']::text[]
        LOOP
          EXECUTE format(
            'DROP INDEX IF EXISTS %I.%I',
            old_index.schema_name,
            old_index.index_name
          );
        END LOOP;
      END $$;
    `);
  }

  async down(_queryRunner: QueryRunner): Promise<void> {
    // Intentional no-op: recreating the two-column unique index could fail after
    // distinct MOVIE and TV rows begin sharing the same provider identifier.
  }
}
