import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

export type KobisSyncStatus = 'RUNNING' | 'SUCCEEDED' | 'FAILED';

/** One daily read of the KOBIS schedules. */
@Entity({ name: 'kobis_sync_runs' })
@Index(['startedAt'])
export class KobisSyncRunEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'started_at', type: 'timestamptz' })
  startedAt!: Date;

  @Column({ name: 'finished_at', type: 'timestamptz', nullable: true })
  finishedAt!: Date | null;

  @Column({ type: 'varchar', length: 16 })
  status!: KobisSyncStatus;

  @Column({ type: 'integer', default: 0 })
  theaters!: number;

  @Column({ name: 'failed_theaters', type: 'integer', default: 0 })
  failedTheaters!: number;

  @Column({ type: 'integer', default: 0 })
  requests!: number;

  @Column({ type: 'integer', default: 0 })
  showtimes!: number;

  @Column({ name: 'movies_matched', type: 'integer', default: 0 })
  moviesMatched!: number;

  @Column({ type: 'text', nullable: true })
  error!: string | null;
}
