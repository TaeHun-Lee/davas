import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { DiaryEntity } from './diary.entity';
import { SpaceEntity } from './space.entity';

@Entity({ name: 'watch_event_shares' })
@Index(['diaryId', 'spaceId'], { unique: true })
@Index(['spaceId', 'sharedAt', 'id'])
export class WatchShareEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'diary_id', type: 'uuid' })
  diaryId!: string;

  @ManyToOne(() => DiaryEntity, (diary) => diary.spaceShares, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'diary_id' })
  diary!: DiaryEntity;

  @Column({ name: 'space_id', type: 'uuid' })
  spaceId!: string;

  @ManyToOne(() => SpaceEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'space_id' })
  space!: SpaceEntity;

  @Column({
    name: 'shared_at',
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
  })
  sharedAt!: Date;

  @Column({ name: 'revoked_at', type: 'timestamptz', nullable: true })
  revokedAt!: Date | null;
}
