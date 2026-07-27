import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { MediaEntity } from './media.entity';

export type MediaImageType = 'POSTER' | 'BACKDROP' | 'STILL' | 'SCREENSHOT';

@Entity({ name: 'media_images' })
export class MediaImageEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'media_id', type: 'uuid' })
  mediaId!: string;

  @ManyToOne(() => MediaEntity, (media) => media.images, { onDelete: 'CASCADE' })
  media!: MediaEntity;

  @Column({ type: 'varchar', length: 30 })
  type!: MediaImageType;

  @Column({ name: 'image_url', type: 'varchar' })
  imageUrl!: string;

  @Column({ type: 'varchar', nullable: true })
  source!: string | null;

  @Column({ type: 'int', default: 0 })
  order!: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;
}
