import { Column, CreateDateColumn, Entity, PrimaryColumn, UpdateDateColumn } from 'typeorm';

/** A theater as KOBIS (KOFIC's integrated ticketing network) lists it. */
@Entity({ name: 'kobis_theaters' })
export class KobisTheaterEntity {
  @PrimaryColumn({ type: 'varchar', length: 16 })
  code!: string;

  @Column({ type: 'varchar', length: 120 })
  name!: string;

  @Column({ name: 'wide_area_code', type: 'varchar', length: 16 })
  wideAreaCode!: string;

  /** "서울시", "경기도". */
  @Column({ name: 'wide_area_name', type: 'varchar', length: 40 })
  wideAreaName!: string;

  @Column({ name: 'basic_area_code', type: 'varchar', length: 16 })
  basicAreaCode!: string;

  /** "구로구", "수원시 팔달구". */
  @Column({ name: 'basic_area_name', type: 'varchar', length: 40 })
  basicAreaName!: string;

  @Column({ name: 'homepage_url', type: 'varchar', length: 300, nullable: true })
  homepageUrl!: string | null;

  @Column({ name: 'last_seen_at', type: 'timestamptz' })
  lastSeenAt!: Date;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt!: Date;
}
