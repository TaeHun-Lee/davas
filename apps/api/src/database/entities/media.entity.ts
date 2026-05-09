import { Column, CreateDateColumn, Entity, Index, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { MediaType } from '@davas/shared';
import { DiaryEntity } from './diary.entity';
import { MediaFavoriteEntity } from './media-favorite.entity';
import { MediaImageEntity } from './media-image.entity';

export type ExternalProvider = 'TMDB' | 'OMDB' | 'MANUAL';

@Entity({ name: 'media' })
@Index(['externalProvider', 'externalId'], { unique: true })
@Index(['title'])
export class MediaEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'external_provider', type: 'varchar', length: 20 })
  externalProvider!: ExternalProvider;

  @Column({ name: 'external_id', type: 'varchar' })
  externalId!: string;

  @Column({ name: 'media_type', type: 'varchar', length: 20 })
  mediaType!: MediaType;

  @Column({ type: 'varchar' })
  title!: string;

  @Column({ name: 'original_title', type: 'varchar', nullable: true })
  originalTitle!: string | null;

  @Column({ type: 'text', nullable: true })
  overview!: string | null;

  @Column({ name: 'short_plot', type: 'text', nullable: true })
  shortPlot!: string | null;

  @Column({ name: 'poster_url', type: 'varchar', nullable: true })
  posterUrl!: string | null;

  @Column({ name: 'backdrop_url', type: 'varchar', nullable: true })
  backdropUrl!: string | null;

  @Column({ name: 'release_date', type: 'date', nullable: true })
  releaseDate!: string | null;

  @Column('text', { array: true, default: () => "'{}'" })
  genres!: string[];

  @Column({ type: 'varchar', nullable: true })
  country!: string | null;

  @Column({ type: 'int', nullable: true })
  runtime!: number | null;

  @OneToMany(() => DiaryEntity, (diary) => diary.media)
  diaries!: DiaryEntity[];

  @OneToMany(() => MediaImageEntity, (image) => image.media)
  images!: MediaImageEntity[];

  @OneToMany(() => MediaFavoriteEntity, (favorite) => favorite.media)
  favorites?: MediaFavoriteEntity[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}
