import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export type ReviewStatus = 'pending' | 'approved' | 'rejected';

@Entity({ name: 'reviews' })
export class Review {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text' })
  name: string;

  @Column({ type: 'text', nullable: true })
  company: string | null;

  @Column({ type: 'text', nullable: true })
  email: string | null;

  @Column({ type: 'text' })
  message: string;

  // WebDAV-пути к загруженным фото на Synology.
  @Column({ type: 'jsonb', default: () => "'[]'" })
  photos: string[];

  @Column({ type: 'text', default: 'pending' })
  status: ReviewStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
