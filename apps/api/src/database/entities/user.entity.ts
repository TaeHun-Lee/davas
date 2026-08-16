import { Column, CreateDateColumn, DeleteDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { CommentEntity } from './comment.entity';
import { DiaryLikeEntity } from './diary-like.entity';
import { DiaryEntity } from './diary.entity';
import { MediaFavoriteEntity } from './media-favorite.entity';
import { NotificationEntity } from './notification.entity';
import { UserFollowEntity } from './user-follow.entity';

export type UserAccountStatus = 'ACTIVE' | 'DELETION_PENDING' | 'DELETED';

@Entity({ name: 'users' })
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', unique: true })
  email!: string;

  @Column({ name: 'password_hash', type: 'varchar' })
  passwordHash!: string;

  @Column({ type: 'varchar', unique: true })
  nickname!: string;

  @Column({ name: 'profile_image_url', type: 'varchar', nullable: true })
  profileImageUrl!: string | null;

  @Column({ type: 'text', nullable: true })
  bio!: string | null;

  @Column('text', { name: 'preferred_genres', array: true, default: () => "'{}'" })
  preferredGenres!: string[];

  @Column({ type: 'varchar', length: 24, default: 'ACTIVE' })
  status!: UserAccountStatus;

  @Column({ name: 'deletion_requested_at', type: 'timestamptz', nullable: true })
  deletionRequestedAt!: Date | null;

  @Column({ name: 'deletion_scheduled_for', type: 'timestamptz', nullable: true })
  deletionScheduledFor!: Date | null;

  @Column({ name: 'anonymized_at', type: 'timestamptz', nullable: true })
  anonymizedAt!: Date | null;

  @OneToMany(() => DiaryEntity, (diary) => diary.user)
  diaries!: DiaryEntity[];

  @OneToMany(() => CommentEntity, (comment) => comment.user)
  comments!: CommentEntity[];

  @OneToMany(() => DiaryLikeEntity, (like) => like.user)
  diaryLikes?: DiaryLikeEntity[];

  @OneToMany(() => MediaFavoriteEntity, (favorite) => favorite.user)
  mediaFavorites?: MediaFavoriteEntity[];

  @OneToMany(() => UserFollowEntity, (follow) => follow.follower)
  following?: UserFollowEntity[];

  @OneToMany(() => UserFollowEntity, (follow) => follow.following)
  followers?: UserFollowEntity[];

  @OneToMany(() => NotificationEntity, (notification) => notification.user)
  notifications?: NotificationEntity[];

  @OneToMany(() => NotificationEntity, (notification) => notification.actor)
  triggeredNotifications?: NotificationEntity[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  deletedAt!: Date | null;
}
