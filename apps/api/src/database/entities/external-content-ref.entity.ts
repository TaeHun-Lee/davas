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
import { MediaEntity } from './media.entity';

@Entity({ name: 'external_content_refs' })
@Index(['provider', 'externalId'], { unique: true })
@Index(['contentId', 'provider'], { unique: true })
export class ExternalContentRefEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'content_id', type: 'uuid' })
  contentId!: string;

  @ManyToOne(() => MediaEntity, (media) => media.externalRefs, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'content_id' })
  content!: MediaEntity;

  @Column({ type: 'varchar', length: 40 })
  provider!: string;

  @Column({ name: 'external_id', type: 'varchar', length: 120 })
  externalId!: string;

  @Column({ type: 'varchar', length: 80 })
  source!: string;

  @Column({ name: 'last_synced_at', type: 'timestamptz' })
  lastSyncedAt!: Date;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt!: Date;
}
