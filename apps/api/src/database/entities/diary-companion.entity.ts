import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { DiaryEntity } from './diary.entity';
import { UserEntity } from './user.entity';

@Entity({ name: 'diary_companions' })
@Index(['diaryId', 'userId'], { unique: true, where: '"user_id" IS NOT NULL' })
export class DiaryCompanionEntity {
  @PrimaryGeneratedColumn('uuid') id!: string;
  @Column({ name: 'diary_id', type: 'uuid' }) diaryId!: string;
  @ManyToOne(() => DiaryEntity, (diary) => diary.companions, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'diary_id' }) diary!: DiaryEntity;
  @Column({ name: 'user_id', type: 'uuid', nullable: true }) userId!: string | null;
  @ManyToOne(() => UserEntity, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'user_id' }) user!: UserEntity | null;
  @Column({ name: 'display_name', type: 'varchar', length: 60 }) displayName!: string;
}
