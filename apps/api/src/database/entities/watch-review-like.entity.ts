import {
  CreateDateColumn,
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserEntity } from './user.entity';
import { WatchReactionEntity } from './watch-reaction.entity';

/** 따봉 on one person's review of a watch record. */
@Entity({ name: 'watch_review_likes' })
@Index(['reactionId', 'accountId'], { unique: true })
export class WatchReviewLikeEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'watch_reaction_id', type: 'uuid' })
  reactionId!: string;

  @ManyToOne(() => WatchReactionEntity, (reaction) => reaction.likes, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'watch_reaction_id' })
  reaction?: WatchReactionEntity;

  @Column({ name: 'account_id', type: 'uuid' })
  accountId!: string;

  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'account_id' })
  account?: UserEntity;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date;
}
