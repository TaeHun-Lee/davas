import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { SpaceEntity } from './space.entity';
import { UserEntity } from './user.entity';

export type SpaceMembershipRole = 'OWNER' | 'MEMBER';
export type SpaceMembershipStatus = 'ACTIVE' | 'LEFT';

@Entity({ name: 'space_memberships' })
@Index(['spaceId', 'accountId'], { unique: true })
@Index(['spaceId', 'status'])
export class SpaceMembershipEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'space_id', type: 'uuid' })
  spaceId!: string;

  @ManyToOne(() => SpaceEntity, (space) => space.memberships, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'space_id' })
  space!: SpaceEntity;

  @Column({ name: 'account_id', type: 'uuid' })
  accountId!: string;

  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'account_id' })
  account!: UserEntity;

  @Column({ type: 'varchar', length: 20, default: 'MEMBER' })
  role!: SpaceMembershipRole;

  @Column({ type: 'varchar', length: 20, default: 'ACTIVE' })
  status!: SpaceMembershipStatus;

  @Column({
    name: 'joined_at',
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
  })
  joinedAt!: Date;

  @Column({ name: 'left_at', type: 'timestamptz', nullable: true })
  leftAt!: Date | null;
}
