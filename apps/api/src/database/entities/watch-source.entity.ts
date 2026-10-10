import type { WatchSourceKind } from '@davas/shared';
import { Column, Entity, Index, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import type { TheaterFormat } from '@davas/shared';
import { DiaryEntity } from './diary.entity';

export type { WatchSourceKind };

@Entity({ name: 'watch_sources' })
@Index(['diaryId'], { unique: true })
export class WatchSourceEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'diary_id', type: 'uuid' })
  diaryId!: string;

  @OneToOne(() => DiaryEntity, (diary) => diary.watchSource, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'diary_id' })
  diary!: DiaryEntity;

  @Column({ type: 'varchar', length: 20 })
  kind!: WatchSourceKind;

  @Column({
    name: 'provider_name',
    type: 'varchar',
    length: 80,
    nullable: true,
  })
  providerName!: string | null;

  @Column({ name: 'place_text', type: 'varchar', length: 160, nullable: true })
  placeText!: string | null;

  @Column({ name: 'theater_format', type: 'varchar', length: 16, nullable: true })
  theaterFormat!: TheaterFormat | null;

  @Column({ name: 'seat_text', type: 'varchar', length: 40, nullable: true })
  seatText!: string | null;

  @Column({ name: 'episode_watched', type: 'smallint', nullable: true })
  episodeWatched!: number | null;

  @Column({ name: 'episode_total', type: 'smallint', nullable: true })
  episodeTotal!: number | null;

  @Column({ type: 'boolean', default: false })
  completed!: boolean;
}
