import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { DiaryEntity } from './diary.entity';
import { MediaEntity } from './media.entity';
import { UserEntity } from './user.entity';

export type NotificationType =
  | 'DIARY_LIKED'
  | 'DIARY_COMMENTED'
  | 'AUTHOR_FOLLOWED'
  | 'FRIEND_REQUESTED'
  | 'FRIEND_ACCEPTED'
  | 'SPACE_INVITE'
  | 'WATCH_PARTICIPATION_REQUESTED'
  /** Someone shared a new record to a space the recipient is in. */
  | 'WATCH_SHARED'
  /** The actor wrote their review, so the recipient's blind review opened for them. */
  | 'REVIEW_REVEALED'
  | 'REVIEW_LIKED'
  /** Everyone in the space now wants the same title (`mediaId`). */
  | 'WISH_MATCHED';

@Entity({ name: 'notifications' })
@Index(['userId', 'createdAt'])
export class NotificationEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'user_id', type: 'uuid' })
  userId!: string;

  @ManyToOne(() => UserEntity, (user) => user.notifications, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user!: UserEntity;

  @Column({ name: 'actor_id', type: 'uuid' })
  actorId!: string;

  @ManyToOne(() => UserEntity, (user) => user.triggeredNotifications, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'actor_id' })
  actor!: UserEntity;

  @Column({ name: 'diary_id', type: 'uuid', nullable: true })
  diaryId!: string | null;

  @ManyToOne(() => DiaryEntity, (diary) => diary.notifications, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'diary_id' })
  diary!: DiaryEntity | null;

  @Column({ name: 'media_id', type: 'uuid', nullable: true })
  mediaId!: string | null;

  @ManyToOne(() => MediaEntity, { nullable: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'media_id' })
  media?: MediaEntity | null;

  @Column({ type: 'varchar', length: 32 })
  type!: NotificationType;

  @Column({ name: 'idempotency_key', type: 'varchar', length: 180, unique: true })
  idempotencyKey!: string;

  @Column({ name: 'read_at', type: 'timestamp', nullable: true })
  readAt!: Date | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;
}
