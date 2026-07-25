import { FriendshipStatus } from '@davas/shared';
import { Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { UserEntity } from './user.entity';

@Entity({ name: 'friendships' })
export class FriendshipEntity {
  @PrimaryGeneratedColumn('uuid') id!: string;
  @Index({ unique: true }) @Column({ name: 'pair_key', type: 'varchar', length: 80 }) pairKey!: string;
  @Column({ name: 'requester_id', type: 'uuid' }) requesterId!: string;
  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' }) @JoinColumn({ name: 'requester_id' }) requester!: UserEntity;
  @Column({ name: 'receiver_id', type: 'uuid' }) receiverId!: string;
  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' }) @JoinColumn({ name: 'receiver_id' }) receiver!: UserEntity;
  @Column({ type: 'varchar', length: 20, default: 'PENDING' }) status!: FriendshipStatus;
  @CreateDateColumn({ name: 'created_at' }) createdAt!: Date;
  @UpdateDateColumn({ name: 'updated_at' }) updatedAt!: Date;
}
