import { DiaryVisibility, ViewingMethod } from '@davas/shared';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CommentEntity } from './comment.entity';
import { DiaryLikeEntity } from './diary-like.entity';
import { MediaEntity } from './media.entity';
import { NotificationEntity } from './notification.entity';
import { UserEntity } from './user.entity';
import { DiaryCompanionEntity } from './diary-companion.entity';
import { DiaryShareEntity } from './diary-share.entity';
import { DiaryReactionEntity } from './diary-reaction.entity';

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

  @Column({ type: 'decimal', precision: 2, scale: 1, nullable: true })
  rating!: string | null;

  @Column({ type: 'varchar', length: 20, default: 'PRIVATE' })
  visibility!: DiaryVisibility;

  @Column({ name: 'has_spoiler', type: 'boolean', default: false })
  hasSpoiler!: boolean;

  @Column({ name: 'viewing_method', type: 'varchar', length: 20, nullable: true })
  viewingMethod!: ViewingMethod | null;

  @Column({ name: 'shared_at', type: 'timestamp', nullable: true })
  sharedAt!: Date | null;

  @Column({ name: 'client_request_id', type: 'uuid', nullable: true })
  clientRequestId!: string | null;

  @Column({ name: 'client_request_fingerprint', type: 'varchar', length: 64, nullable: true })
  clientRequestFingerprint!: string | null;

  @Column({ name: 'watched_place', type: 'varchar', length: 160, nullable: true })
  watchedPlace!: string | null;

  @Column({ type: 'varchar', length: 80, nullable: true })
  mood!: string | null;

  @Column({ name: 'memory_note', type: 'text', nullable: true })
  memoryNote!: string | null;

  @OneToMany(() => DiaryCompanionEntity, (companion) => companion.diary, { cascade: true })
  companions!: DiaryCompanionEntity[];

  @OneToMany(() => DiaryShareEntity, (share) => share.diary, { cascade: true })
  selectedShares!: DiaryShareEntity[];

  @OneToMany(() => DiaryReactionEntity, (reaction) => reaction.diary)
  reactions!: DiaryReactionEntity[];

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
