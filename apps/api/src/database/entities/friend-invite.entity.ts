import { Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserEntity } from './user.entity';

@Entity({ name: 'friend_invites' })
export class FriendInviteEntity {
  @PrimaryGeneratedColumn('uuid') id!: string;
  @Index({ unique: true }) @Column({ name: 'token_hash', type: 'varchar', length: 64 }) tokenHash!: string;
  @Column({ name: 'inviter_id', type: 'uuid' }) inviterId!: string;
  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' }) @JoinColumn({ name: 'inviter_id' }) inviter!: UserEntity;
  @Column({ name: 'expires_at', type: 'timestamp' }) expiresAt!: Date;
  @Column({ name: 'used_at', type: 'timestamp', nullable: true }) usedAt!: Date | null;
  @Column({ name: 'used_by_user_id', type: 'uuid', nullable: true }) usedByUserId!: string | null;
  @ManyToOne(() => UserEntity, { onDelete: 'SET NULL', nullable: true }) @JoinColumn({ name: 'used_by_user_id' }) usedByUser!: UserEntity | null;
  @Column({ name: 'revoked_at', type: 'timestamp', nullable: true }) revokedAt!: Date | null;
  @CreateDateColumn({ name: 'created_at' }) createdAt!: Date;
}
