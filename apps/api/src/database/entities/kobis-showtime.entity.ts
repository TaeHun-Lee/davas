import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import type { TheaterFormat } from '@davas/shared';
import { KobisTheaterEntity } from './kobis-theater.entity';

/** One film in one screen of one theater on one day, with its start times. */
@Entity({ name: 'kobis_showtimes' })
@Index(['movieCode', 'showDate'])
@Index(['theaterCode', 'showDate'])
export class KobisShowtimeEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'theater_code', type: 'varchar', length: 16 })
  theaterCode!: string;

  @ManyToOne(() => KobisTheaterEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'theater_code' })
  theater?: KobisTheaterEntity;

  @Column({ name: 'show_date', type: 'date' })
  showDate!: string;

  /** As the theater names it: "02관 (4DX)", "03관(Reserve)". */
  @Column({ name: 'screen_name', type: 'varchar', length: 80 })
  screenName!: string;

  @Column({ name: 'movie_code', type: 'varchar', length: 16 })
  movieCode!: string;

  /** As the schedule names it, with the print: "오디세이(4D)". */
  @Column({ name: 'movie_title', type: 'varchar', length: 200 })
  movieTitle!: string;

  @Column({ type: 'varchar', length: 16, nullable: true })
  format!: TheaterFormat | null;

  /** "09:30", in the theater's local time. */
  @Column({ type: 'text', array: true })
  times!: string[];

  @Column({ name: 'fetched_at', type: 'timestamptz' })
  fetchedAt!: Date;
}
