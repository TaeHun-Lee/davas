import { ReactionEmoji } from '@davas/shared';
import { Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { DiaryEntity } from './diary.entity';
import { UserEntity } from './user.entity';

@Entity({ name: 'diary_reactions' })
@Index(['userId', 'diaryId', 'emoji'], { unique: true })
export class DiaryReactionEntity {
  @PrimaryGeneratedColumn('uuid') id!: string;
  @Column({ name: 'user_id', type: 'uuid' }) userId!: string;
  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' }) @JoinColumn({ name: 'user_id' }) user!: UserEntity;
  @Column({ name: 'diary_id', type: 'uuid' }) diaryId!: string;
  @ManyToOne(() => DiaryEntity, (diary) => diary.reactions, { onDelete: 'CASCADE' }) @JoinColumn({ name: 'diary_id' }) diary!: DiaryEntity;
  @Column({ type: 'varchar', length: 16 }) emoji!: ReactionEmoji;
  @CreateDateColumn({ name: 'created_at' }) createdAt!: Date;
}
