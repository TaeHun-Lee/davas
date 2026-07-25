import { WatchlistPriority, WatchlistStatus } from '@davas/shared';
import { Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { MediaEntity } from './media.entity';
import { UserEntity } from './user.entity';

@Entity({ name: 'watchlist_items' })
@Index(['userId', 'mediaId'], { unique: true })
export class WatchlistItemEntity {
  @PrimaryGeneratedColumn('uuid') id!: string;
  @Column({ name: 'user_id', type: 'uuid' }) userId!: string;
  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' }) @JoinColumn({ name: 'user_id' }) user!: UserEntity;
  @Column({ name: 'media_id', type: 'uuid' }) mediaId!: string;
  @ManyToOne(() => MediaEntity, { onDelete: 'CASCADE' }) @JoinColumn({ name: 'media_id' }) media!: MediaEntity;
  @Column({ type: 'varchar', length: 12, default: 'MEDIUM' }) priority!: WatchlistPriority;
  @Column({ type: 'varchar', length: 500, default: '' }) memo!: string;
  @Column({ name: 'planned_with', type: 'varchar', length: 120, default: '' }) plannedWith!: string;
  @Column({ type: 'varchar', length: 12, default: 'ACTIVE' }) status!: WatchlistStatus;
  @CreateDateColumn({ name: 'created_at' }) createdAt!: Date;
  @UpdateDateColumn({ name: 'updated_at' }) updatedAt!: Date;
}
