import { Column, CreateDateColumn, Entity, Index, PrimaryColumn, UpdateDateColumn } from 'typeorm';
import type { MediaRecommendationItem } from '../../media/tmdb.mapper';

export type KobisMatchStatus = 'PENDING' | 'MATCHED' | 'UNMATCHED';

/** The TMDB search result a KOBIS film was linked to, enough to list and rank it. */
export type KobisTmdbSummary = Omit<MediaRecommendationItem, 'reason'>;

/** A film KOBIS shows in schedules, and the TMDB title it was linked to, if any. */
@Entity({ name: 'kobis_movies' })
@Index(['tmdbId'])
export class KobisMovieEntity {
  /** KOBIS's representative film code. */
  @PrimaryColumn({ type: 'varchar', length: 16 })
  code!: string;

  @Column({ type: 'varchar', length: 200 })
  title!: string;

  @Column({ name: 'title_en', type: 'varchar', length: 200, nullable: true })
  titleEn!: string | null;

  @Column({ name: 'production_year', type: 'smallint', nullable: true })
  productionYear!: number | null;

  /** The Korean release date KOBIS records. */
  @Column({ name: 'open_date', type: 'date', nullable: true })
  openDate!: string | null;

  @Column({ type: 'text', array: true, default: () => `'{}'` })
  directors!: string[];

  @Column({ name: 'tmdb_id', type: 'varchar', length: 32, nullable: true })
  tmdbId!: string | null;

  @Column({ type: 'jsonb', nullable: true })
  tmdb!: KobisTmdbSummary | null;

  @Column({ name: 'match_status', type: 'varchar', length: 16, default: 'PENDING' })
  matchStatus!: KobisMatchStatus;

  @Column({ name: 'checked_at', type: 'timestamptz', nullable: true })
  checkedAt!: Date | null;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt!: Date;
}
