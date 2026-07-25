import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { DiaryEntity } from './diary.entity';
import { UserEntity } from './user.entity';

@Entity({ name: 'diary_shares' })
@Index(['diaryId', 'userId'], { unique: true })
export class DiaryShareEntity {
  @PrimaryGeneratedColumn('uuid') id!: string;
  @Column({ name: 'diary_id', type: 'uuid' }) diaryId!: string;
  @ManyToOne(() => DiaryEntity, (diary) => diary.selectedShares, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'diary_id' }) diary!: DiaryEntity;
  @Column({ name: 'user_id', type: 'uuid' }) userId!: string;
  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' }) user!: UserEntity;
}
