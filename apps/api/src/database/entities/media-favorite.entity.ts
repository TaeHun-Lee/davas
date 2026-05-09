import { Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { MediaEntity } from './media.entity';
import { UserEntity } from './user.entity';

@Entity({ name: 'media_favorites' })
@Index(['userId', 'mediaId'], { unique: true })
export class MediaFavoriteEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'user_id', type: 'uuid' })
  userId!: string;

  @ManyToOne(() => UserEntity, (user) => user.mediaFavorites, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user!: UserEntity;

  @Column({ name: 'media_id', type: 'uuid' })
  mediaId!: string;

  @ManyToOne(() => MediaEntity, (media) => media.favorites, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'media_id' })
  media!: MediaEntity;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;
}
