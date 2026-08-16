import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { MediaEntity } from './media.entity';
import { RecommendationFeedbackEntity } from './recommendation-feedback.entity';
import { RecommendationSessionEntity } from './recommendation-session.entity';

export type ParticipantPrediction = {
  accountId: string;
  score: number;
  uncertainty: number;
};

@Entity({ name: 'recommendation_exposures' })
@Index(['sessionId', 'contentId'], { unique: true })
@Index(['sessionId', 'rank'], { unique: true })
export class RecommendationExposureEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'session_id', type: 'uuid' })
  sessionId!: string;

  @ManyToOne(() => RecommendationSessionEntity, (session) => session.exposures, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'session_id' })
  session!: RecommendationSessionEntity;

  @Column({ name: 'content_id', type: 'uuid' })
  contentId!: string;

  @ManyToOne(() => MediaEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'content_id' })
  content!: MediaEntity;

  @Column({ type: 'smallint' })
  rank!: number;

  @Column({ name: 'group_score', type: 'decimal', precision: 6, scale: 5 })
  groupScore!: string;

  @Column({ name: 'participant_scores', type: 'jsonb' })
  participantScores!: ParticipantPrediction[];

  @Column({ name: 'score_parts', type: 'jsonb' })
  scoreParts!: Record<string, number>;

  @Column('text', { name: 'candidate_channels', array: true })
  candidateChannels!: string[];

  @Column('text', { name: 'reason_codes', array: true })
  reasonCodes!: string[];

  @Column({ name: 'reason_params', type: 'jsonb' })
  reasonParams!: Record<string, string | string[] | number>;

  @Column({ name: 'availability_snapshot', type: 'jsonb' })
  availabilitySnapshot!: {
    region: string;
    providers: string[];
    observedAt: string;
    expiresAt: string;
    confidence: number;
  };

  @OneToMany(
    () => RecommendationFeedbackEntity,
    (feedback) => feedback.exposure,
  )
  feedback!: RecommendationFeedbackEntity[];

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date;
}
