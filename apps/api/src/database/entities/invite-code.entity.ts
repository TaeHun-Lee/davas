import { Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { UserEntity } from './user.entity';
import { InviteUseEntity } from './invite-use.entity';

@Entity({ name: 'invite_codes' })
export class InviteCodeEntity {
  @PrimaryGeneratedColumn('uuid') id!: string;
  @Index({ unique: true }) @Column({ type: 'varchar', length: 32 }) code!: string;
  @Column({ name: 'created_by_id', type: 'uuid', nullable: true }) createdById!: string | null;
  @ManyToOne(() => UserEntity, { nullable: true, onDelete: 'SET NULL' }) @JoinColumn({ name: 'created_by_id' }) createdBy!: UserEntity | null;
  @Column({ name: 'max_uses', type: 'int', default: 1 }) maxUses!: number;
  @Column({ name: 'used_count', type: 'int', default: 0 }) usedCount!: number;
  @Column({ name: 'expires_at', type: 'timestamp' }) expiresAt!: Date;
  @OneToMany(() => InviteUseEntity, (use) => use.invite) uses!: InviteUseEntity[];
  @CreateDateColumn({ name: 'created_at' }) createdAt!: Date;
}
