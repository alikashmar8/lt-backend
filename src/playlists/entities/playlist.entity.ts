import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Audio } from '../../audios/entities/audio.entity';
import { User } from '../../users/entities/user.entity';

@Entity('playlists')
export class Playlist {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'name', nullable: false })
  name: string;

  @Column({ name: 'userId', nullable: false })
  userId: string;

  @ManyToOne(() => User, (user) => user.playlists)
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToMany(() => Audio)
  @JoinTable()
  audios: Audio[];
}
