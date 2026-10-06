import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { DiaryEntity } from './diary.entity';
import { UserEntity } from './user.entity';

/**
 * A photo attached to a watch record. It is uploaded first (diaryId null) and attached when
 * the record is saved, so slow uploads never block typing the review.
 */
@Entity({ name: 'watch_photos' })
@Index(['diaryId', 'position'])
@Index(['uploaderId', 'createdAt'])
export class WatchPhotoEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'diary_id', type: 'uuid', nullable: true })
  diaryId!: string | null;

  @ManyToOne(() => DiaryEntity, (diary) => diary.watchPhotos, {
    onDelete: 'CASCADE',
    nullable: true,
  })
  @JoinColumn({ name: 'diary_id' })
  diary?: DiaryEntity | null;

  @Column({ name: 'uploader_id', type: 'uuid' })
  uploaderId!: string;

  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'uploader_id' })
  uploader?: UserEntity;

  @Column({ type: 'smallint', default: 0 })
  position!: number;

  /** Random file name stem shared by the original and its resized copies. */
  @Column({ name: 'storage_key', type: 'varchar', length: 64, unique: true })
  storageKey!: string;

  @Column({ name: 'original_mime_type', type: 'varchar', length: 32 })
  originalMimeType!: string;

  @Column({ name: 'original_bytes', type: 'integer' })
  originalBytes!: number;

  /** Size of the upright display copy. */
  @Column({ type: 'integer' })
  width!: number;

  @Column({ type: 'integer' })
  height!: number;

  @Column({ type: 'text', nullable: true })
  placeholder!: string | null;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date;

  @Column({ name: 'attached_at', type: 'timestamptz', nullable: true })
  attachedAt!: Date | null;
}
