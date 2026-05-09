import { Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { DiaryEntity } from './diary.entity';
import { UserEntity } from './user.entity';

export type NotificationType = 'DIARY_LIKED' | 'DIARY_COMMENTED' | 'AUTHOR_FOLLOWED';

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

  @ManyToOne(() => DiaryEntity, (diary) => diary.notifications, { nullable: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'diary_id' })
  diary!: DiaryEntity | null;

  @Column({ type: 'varchar', length: 32 })
  type!: NotificationType;

  @Column({ name: 'read_at', type: 'timestamp', nullable: true })
  readAt!: Date | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;
}
