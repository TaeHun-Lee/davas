import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { SpaceInviteEntity } from './space-invite.entity';
import { SpaceMembershipEntity } from './space-membership.entity';
import { UserEntity } from './user.entity';

export type SpaceStatus = 'ACTIVE' | 'CLOSED';

@Entity({ name: 'spaces' })
export class SpaceEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 80 })
  name!: string;

  @Column({ type: 'varchar', length: 20, default: 'ACTIVE' })
  status!: SpaceStatus;

  @Column({ name: 'max_members', type: 'smallint', default: 5 })
  maxMembers!: number;

  @Column({ name: 'owner_account_id', type: 'uuid' })
  ownerAccountId!: string;

  @ManyToOne(() => UserEntity, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'owner_account_id' })
  owner!: UserEntity;

  @OneToMany(() => SpaceMembershipEntity, (membership) => membership.space)
  memberships!: SpaceMembershipEntity[];

  @OneToMany(() => SpaceInviteEntity, (invite) => invite.space)
  invites!: SpaceInviteEntity[];

  @Column({ name: 'closed_at', type: 'timestamptz', nullable: true })
  closedAt!: Date | null;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt!: Date;
}
