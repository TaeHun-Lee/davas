import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserEntity } from './user.entity';

export const NOTIFICATION_PREFERENCE_CATEGORIES = [
  'SPACE_INVITE',
  'WATCH_PARTICIPATION',
  'SOCIAL',
  'RECOMMENDATION',
] as const;

export type NotificationPreferenceCategory =
  (typeof NOTIFICATION_PREFERENCE_CATEGORIES)[number];

export const REQUIRED_NOTIFICATION_CATEGORIES = new Set<NotificationPreferenceCategory>([
  'SPACE_INVITE',
  'WATCH_PARTICIPATION',
]);

@Entity({ name: 'notification_preferences' })
@Index(['userId', 'category'], { unique: true })
export class NotificationPreferenceEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'user_id', type: 'uuid' })
  userId!: string;

  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user!: UserEntity;

  @Column({ type: 'varchar', length: 40 })
  category!: NotificationPreferenceCategory;

  @Column({ type: 'boolean', default: true })
  enabled!: boolean;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt!: Date;
}
