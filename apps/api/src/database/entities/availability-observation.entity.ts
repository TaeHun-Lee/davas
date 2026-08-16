import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { MediaEntity } from './media.entity';

export type AvailabilityObservationStatus =
  | 'AVAILABLE'
  | 'NO_OFFERS'
  | 'PROVIDER_FAILURE'
  | 'UNMAPPED';

@Entity({ name: 'availability_observations' })
@Index(['contentId', 'region', 'observedAt'])
@Index(
  [
    'contentId',
    'region',
    'sourceProvider',
    'provider',
    'offerType',
    'observedAt',
  ],
  { unique: true },
)
export class AvailabilityObservationEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'content_id', type: 'uuid' })
  contentId!: string;

  @ManyToOne(() => MediaEntity, (media) => media.availabilityObservations, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'content_id' })
  content!: MediaEntity;

  @Column({ type: 'char', length: 2 })
  region!: string;

  @Column({ name: 'source_provider', type: 'varchar', length: 40 })
  sourceProvider!: string;

  @Column({ type: 'varchar', length: 100 })
  provider!: string;

  @Column({ name: 'offer_type', type: 'varchar', length: 30 })
  offerType!: string;

  @Column({ type: 'varchar', length: 30 })
  status!: AvailabilityObservationStatus;

  @Column({ name: 'observed_at', type: 'timestamptz' })
  observedAt!: Date;

  @Column({ name: 'expires_at', type: 'timestamptz' })
  expiresAt!: Date;

  @Column({ type: 'decimal', precision: 4, scale: 3 })
  confidence!: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date;
}
