import { Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserEntity } from './user.entity';

@Entity({ name: 'user_follows' })
@Index(['followerId', 'followingId'], { unique: true })
export class UserFollowEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'follower_id', type: 'uuid' })
  followerId!: string;

  @ManyToOne(() => UserEntity, (user) => user.following, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'follower_id' })
  follower!: UserEntity;

  @Column({ name: 'following_id', type: 'uuid' })
  followingId!: string;

  @ManyToOne(() => UserEntity, (user) => user.followers, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'following_id' })
  following!: UserEntity;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;
}
