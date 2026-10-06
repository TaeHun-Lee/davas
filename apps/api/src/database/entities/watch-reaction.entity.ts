import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { DiaryEntity } from './diary.entity';
import { UserEntity } from './user.entity';
import { WatchReviewLikeEntity } from './watch-review-like.entity';

@Entity({ name: 'watch_reactions' })
@Index(['diaryId', 'accountId'], { unique: true })
export class WatchReactionEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'diary_id', type: 'uuid' })
  diaryId!: string;

  @ManyToOne(() => DiaryEntity, (diary) => diary.watchReactions, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'diary_id' })
  diary!: DiaryEntity;

  @Column({ name: 'account_id', type: 'uuid' })
  accountId!: string;

  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'account_id' })
  account!: UserEntity;

  @Column({ name: 'rating_scale', type: 'smallint', nullable: true })
  ratingScale!: number | null;

  @Column({ name: 'review_text', type: 'text', nullable: true })
  reviewText!: string | null;

  /** 한줄평 */
  @Column({ type: 'varchar', length: 40, nullable: true })
  headline!: string | null;

  @Column({ name: 'has_spoiler', type: 'boolean', default: false })
  hasSpoiler!: boolean;

  /** Hidden from each viewer until that viewer writes their own review (see blind-review.ts). */
  @Column({ name: 'is_blind', type: 'boolean', default: false })
  isBlind!: boolean;

  @OneToMany(() => WatchReviewLikeEntity, (like) => like.reaction)
  likes?: WatchReviewLikeEntity[];

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt!: Date;
}
