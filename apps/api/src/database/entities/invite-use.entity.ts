import { CreateDateColumn, Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { InviteCodeEntity } from './invite-code.entity';
import { UserEntity } from './user.entity';

@Entity({ name: 'invite_uses' })
@Index(['inviteId', 'userId'], { unique: true })
export class InviteUseEntity {
  @PrimaryGeneratedColumn('uuid') id!: string;
  @Column({ name: 'invite_id', type: 'uuid' }) inviteId!: string;
  @ManyToOne(() => InviteCodeEntity, (invite) => invite.uses, { onDelete: 'CASCADE' }) @JoinColumn({ name: 'invite_id' }) invite!: InviteCodeEntity;
  @Column({ name: 'user_id', type: 'uuid' }) userId!: string;
  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' }) @JoinColumn({ name: 'user_id' }) user!: UserEntity;
  @CreateDateColumn({ name: 'used_at' }) usedAt!: Date;
}
