import { Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserEntity } from './user.entity';

@Entity({ name: 'user_consents' })
@Index(['userId', 'termsVersion', 'privacyVersion'], { unique: true })
export class UserConsentEntity {
  @PrimaryGeneratedColumn('uuid') id!: string;
  @Column({ name: 'user_id', type: 'uuid' }) userId!: string;
  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' }) @JoinColumn({ name: 'user_id' }) user!: UserEntity;
  @Column({ name: 'terms_version', type: 'varchar', length: 40 }) termsVersion!: string;
  @Column({ name: 'privacy_version', type: 'varchar', length: 40 }) privacyVersion!: string;
  @CreateDateColumn({ name: 'accepted_at' }) acceptedAt!: Date;
}
