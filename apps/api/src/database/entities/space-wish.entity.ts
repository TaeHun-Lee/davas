import {
  CreateDateColumn,
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { MediaEntity } from './media.entity';
import { SpaceEntity } from './space.entity';
import { UserEntity } from './user.entity';

/** One member of a space wanting to watch one title ("같이 보고 싶어요"). */
@Entity({ name: 'space_wishes' })
@Index(['spaceId', 'mediaId', 'accountId'], { unique: true })
export class SpaceWishEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'space_id', type: 'uuid' })
  spaceId!: string;

  @ManyToOne(() => SpaceEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'space_id' })
  space?: SpaceEntity;

  @Column({ name: 'media_id', type: 'uuid' })
  mediaId!: string;

  @ManyToOne(() => MediaEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'media_id' })
  media?: MediaEntity;

  @Column({ name: 'account_id', type: 'uuid' })
  accountId!: string;

  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'account_id' })
  account?: UserEntity;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date;
}
