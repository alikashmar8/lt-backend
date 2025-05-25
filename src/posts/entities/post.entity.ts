import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Audio } from '../../audios/entities/audio.entity';
import { Singer } from '../../singers/entities/singer.entity';
import { Video } from '../../videos/entities/video.entity';

@Entity('posts')
export class Post {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: string;

  @Column({ name: 'title', nullable: false })
  title: string;

  @Column({ name: 'description', nullable: true })
  description?: string;

  @Column({ name: 'lyrics', type: 'text', nullable: true })
  lyrics?: string;

  @Column({ name: 'releaseDate', type: 'date', nullable: true })
  releaseDate?: Date;

  @Column({ name: 'releaseDateHijri', type: 'date', nullable: true })
  releaseDateHijri?: Date;

  @Column({ name: 'location', nullable: true })
  location?: string;

  @Column({ name: 'event', nullable: true })
  event?: string;

  @Column({ name: 'thumbnail', nullable: true })
  thumbnail?: string;

  @Column({ name: 'externalLinks', nullable: true })
  externalLinks?: string;

  @Column({ name: 'views', default: 0 })
  views: number;

  @Column({ name: 'isActive', default: true })
  isActive: boolean;

  @Column({ name: 'singerId', nullable: false })
  singerId: string;

  @ManyToOne(() => Singer, (singer) => singer.posts)
  @JoinColumn({ name: 'singerId' })
  singer: Singer;

  @OneToMany(() => Audio, (audio) => audio.post, {
    cascade: true,
  })
  audios: Audio[];

  @OneToMany(() => Video, (video) => video.post, {
    cascade: true,
  })
  videos: Video[];

  @CreateDateColumn({ name: 'createdAt' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updatedAt' })
  updatedAt: Date;
}
