import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { DiaryEntity } from './diary.entity';
import { UserEntity } from './user.entity';

export type WatchParticipantStatus = 'PENDING' | 'CONFIRMED' | 'DECLINED';

@Entity({ name: 'watch_participants' })
@Index(['diaryId', 'accountId'], { unique: true })
@Index(['accountId', 'status'])
export class WatchParticipantEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'diary_id', type: 'uuid' })
  diaryId!: string;

  @ManyToOne(() => DiaryEntity, (diary) => diary.watchParticipants, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'diary_id' })
  diary!: DiaryEntity;

  @Column({ name: 'account_id', type: 'uuid' })
  accountId!: string;

  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'account_id' })
  account!: UserEntity;

  @Column({ type: 'varchar', length: 20, default: 'PENDING' })
  status!: WatchParticipantStatus;

  @Column({
    name: 'requested_at',
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
  })
  requestedAt!: Date;

  @Column({ name: 'responded_at', type: 'timestamptz', nullable: true })
  respondedAt!: Date | null;
}
