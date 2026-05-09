import { Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { DiaryEntity } from './diary.entity';
import { UserEntity } from './user.entity';

@Entity({ name: 'diary_likes' })
@Index(['userId', 'diaryId'], { unique: true })
export class DiaryLikeEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'user_id', type: 'uuid' })
  userId!: string;

  @ManyToOne(() => UserEntity, (user) => user.diaryLikes, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user!: UserEntity;

  @Column({ name: 'diary_id', type: 'uuid' })
  diaryId!: string;

  @ManyToOne(() => DiaryEntity, (diary) => diary.likes, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'diary_id' })
  diary!: DiaryEntity;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;
}
