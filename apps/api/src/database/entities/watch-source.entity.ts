import {
  Column,
  Entity,
  Index,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { DiaryEntity } from './diary.entity';

export type WatchSourceKind = 'THEATER' | 'OTT' | 'TV_OWNED' | 'OTHER';

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
}
