import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * A pick can now end: someone settles on an agreed title ("이걸로 볼게요"), or the person who
 * started it stops it. The session keeps the chosen exposure and when it closed. Additive
 * only; existing sessions stay as they are and close by age in the service.
 */
export class RecommendationSessionDecision1720671700000 implements MigrationInterface {
  name = 'RecommendationSessionDecision1720671700000';

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "recommendation_sessions" ADD COLUMN IF NOT EXISTS "decided_exposure_id" uuid`,
    );
    await queryRunner.query(
      `ALTER TABLE "recommendation_sessions" ADD COLUMN IF NOT EXISTS "closed_at" timestamptz`,
    );
    await queryRunner.query(`DO $$ BEGIN
      ALTER TABLE "recommendation_sessions" ADD CONSTRAINT "FK_recommendation_session_decided_exposure"
        FOREIGN KEY ("decided_exposure_id") REFERENCES "recommendation_exposures"("id") ON DELETE SET NULL;
    EXCEPTION WHEN duplicate_object THEN NULL; END $$`);
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "recommendation_sessions" DROP CONSTRAINT IF EXISTS "FK_recommendation_session_decided_exposure"`,
    );
    await queryRunner.query(
      `ALTER TABLE "recommendation_sessions" DROP COLUMN IF EXISTS "closed_at"`,
    );
    await queryRunner.query(
      `ALTER TABLE "recommendation_sessions" DROP COLUMN IF EXISTS "decided_exposure_id"`,
    );
  }
}
