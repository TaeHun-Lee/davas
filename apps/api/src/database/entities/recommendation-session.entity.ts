import {
  Check,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { RecommendationExposureEntity } from './recommendation-exposure.entity';
import { SpaceEntity } from './space.entity';
import { UserEntity } from './user.entity';

export type RecommendationDecisionRule = 'ALL' | 'MINIMUM';
export type RecommendationRewatchPolicy = 'EXCLUDE' | 'ALLOW';
export type RecommendationSessionStatus = 'OPEN' | 'MATCHED' | 'CLOSED';

@Entity({ name: 'recommendation_sessions' })
@Index(['spaceId', 'createdAt'])
@Check('"lambda" >= 0 AND "lambda" <= 1')
@Check('"gamma" >= 0 AND "gamma" <= 1')
export class RecommendationSessionEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'space_id', type: 'uuid' })
  spaceId!: string;

  @ManyToOne(() => SpaceEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'space_id' })
  space!: SpaceEntity;

  @Column({ name: 'requester_account_id', type: 'uuid' })
  requesterAccountId!: string;

  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'requester_account_id' })
  requester!: UserEntity;

  @Column('uuid', { name: 'participant_account_ids', array: true })
  participantAccountIds!: string[];

  @Column({ type: 'char', length: 2 })
  region!: string;

  @Column('text', { array: true })
  services!: string[];

  @Column('text', { name: 'content_types', array: true })
  contentTypes!: Array<'MOVIE' | 'TV'>;

  @Column({ name: 'runtime_min', type: 'smallint', nullable: true })
  runtimeMin!: number | null;

  @Column({ name: 'runtime_max', type: 'smallint', nullable: true })
  runtimeMax!: number | null;

  @Column('text', { name: 'mood_tags', array: true, default: () => "'{}'" })
  moodTags!: string[];

  @Column('text', { name: 'avoid_tags', array: true, default: () => "'{}'" })
  avoidTags!: string[];

  @Column({ name: 'rewatch_policy', type: 'varchar', length: 20 })
  rewatchPolicy!: RecommendationRewatchPolicy;

  @Column({ name: 'decision_rule', type: 'varchar', length: 20 })
  decisionRule!: RecommendationDecisionRule;

  @Column({ name: 'minimum_approvals', type: 'smallint' })
  minimumApprovals!: number;

  @Column({ type: 'decimal', precision: 4, scale: 3 })
  lambda!: string;

  @Column({ type: 'decimal', precision: 4, scale: 3 })
  gamma!: string;

  @Column({ name: 'algorithm_version', type: 'varchar', length: 40 })
  algorithmVersion!: string;

  @Column({ type: 'varchar', length: 64 })
  seed!: string;

  @Column({ name: 'constraints_snapshot', type: 'jsonb' })
  constraintsSnapshot!: Record<string, unknown>;

  @Column({ type: 'varchar', length: 20, default: 'OPEN' })
  status!: RecommendationSessionStatus;

  @OneToMany(
    () => RecommendationExposureEntity,
    (exposure) => exposure.session,
  )
  exposures!: RecommendationExposureEntity[];

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date;
}
