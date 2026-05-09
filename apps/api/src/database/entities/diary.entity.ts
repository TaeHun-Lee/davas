import { DiaryVisibility } from '@davas/shared';
import { Column, CreateDateColumn, DeleteDateColumn, Entity, Index, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { CommentEntity } from './comment.entity';
import { DiaryLikeEntity } from './diary-like.entity';
import { MediaEntity } from './media.entity';
import { NotificationEntity } from './notification.entity';
import { UserEntity } from './user.entity';

@Entity({ name: 'diaries' })
@Index(['userId', 'watchedDate'])
@Index(['mediaId', 'visibility'])
export class DiaryEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'user_id', type: 'uuid' })
  userId!: string;

  @ManyToOne(() => UserEntity, (user) => user.diaries, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user!: UserEntity;

  @Column({ name: 'media_id', type: 'uuid' })
  mediaId!: string;

  @ManyToOne(() => MediaEntity, (media) => media.diaries, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'media_id' })
  media!: MediaEntity;

  @Column({ type: 'varchar', length: 120 })
  title!: string;

  @Column({ type: 'text' })
  content!: string;

  @Column({ name: 'watched_date', type: 'date' })
  watchedDate!: string;

  @Column({ type: 'decimal', precision: 2, scale: 1 })
  rating!: string;

  @Column({ type: 'varchar', length: 20, default: 'PUBLIC' })
  visibility!: DiaryVisibility;

  @Column({ name: 'has_spoiler', type: 'boolean', default: false })
  hasSpoiler!: boolean;

  @OneToMany(() => CommentEntity, (comment) => comment.diary)
  comments!: CommentEntity[];

  @OneToMany(() => DiaryLikeEntity, (like) => like.diary)
  likes?: DiaryLikeEntity[];

  @OneToMany(() => NotificationEntity, (notification) => notification.diary)
  notifications?: NotificationEntity[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  deletedAt!: Date | null;
}
