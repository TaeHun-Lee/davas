import { Column, CreateDateColumn, DeleteDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { CommentEntity } from './comment.entity';
import { DiaryEntity } from './diary.entity';

@Entity({ name: 'users' })
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', unique: true })
  email!: string;

  @Column({ name: 'password_hash', type: 'varchar' })
  passwordHash!: string;

  @Column({ type: 'varchar', unique: true })
  nickname!: string;

  @Column({ name: 'profile_image_url', type: 'varchar', nullable: true })
  profileImageUrl!: string | null;

  @Column({ type: 'text', nullable: true })
  bio!: string | null;

  @Column('text', { name: 'preferred_genres', array: true, default: () => "'{}'" })
  preferredGenres!: string[];

  @OneToMany(() => DiaryEntity, (diary) => diary.user)
  diaries!: DiaryEntity[];

  @OneToMany(() => CommentEntity, (comment) => comment.user)
  comments!: CommentEntity[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  deletedAt!: Date | null;
}
