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
import { DiaryEntity } from './diary.entity';
import { UserEntity } from './user.entity';

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

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt!: Date;
}
