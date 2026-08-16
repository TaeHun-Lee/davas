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
import { RecommendationExposureEntity } from './recommendation-exposure.entity';
import { UserEntity } from './user.entity';

export type RecommendationFeedbackKind =
  | 'INTERESTED'
  | 'HOLD'
  | 'REJECTED'
  | 'ALREADY_WATCHED'
  | 'AVAILABILITY_ERROR'
  | 'WATCHED';

@Entity({ name: 'recommendation_feedback' })
@Index(['exposureId', 'accountId'], { unique: true })
@Index(['accountId', 'kind'])
export class RecommendationFeedbackEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'exposure_id', type: 'uuid' })
  exposureId!: string;

  @ManyToOne(() => RecommendationExposureEntity, (exposure) => exposure.feedback, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'exposure_id' })
  exposure!: RecommendationExposureEntity;

  @Column({ name: 'account_id', type: 'uuid' })
  accountId!: string;

  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'account_id' })
  account!: UserEntity;

  @Column({ type: 'varchar', length: 30 })
  kind!: RecommendationFeedbackKind;

  @Column({ name: 'watch_event_id', type: 'uuid', nullable: true })
  watchEventId!: string | null;

  @ManyToOne(() => DiaryEntity, { onDelete: 'CASCADE', nullable: true })
  @JoinColumn({ name: 'watch_event_id' })
  watchEvent!: DiaryEntity | null;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt!: Date;
}
