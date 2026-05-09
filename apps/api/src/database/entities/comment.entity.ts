import { Column, CreateDateColumn, DeleteDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { DiaryEntity } from './diary.entity';
import { UserEntity } from './user.entity';

@Entity({ name: 'comments' })
@Index(['diaryId', 'createdAt'])
export class CommentEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'diary_id', type: 'uuid' })
  diaryId!: string;

  @ManyToOne(() => DiaryEntity, (diary) => diary.comments, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'diary_id' })
  diary!: DiaryEntity;

  @Column({ name: 'user_id', type: 'uuid' })
  userId!: string;

  @ManyToOne(() => UserEntity, (user) => user.comments, { onDelete: 'CASCADE' })
  user!: UserEntity;

  @Column({ type: 'text' })
  content!: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  deletedAt!: Date | null;
}
