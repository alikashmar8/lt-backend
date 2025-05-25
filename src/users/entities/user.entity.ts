import argon from 'argon2';
import {
  BeforeInsert,
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Playlist } from '../../playlists/entities/playlist.entity';
import { Post } from '../../posts/entities/post.entity';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @Column({ name: 'name', nullable: false })
  name: string;

  @Column({ name: 'email', nullable: false, unique: true })
  email: string;

  @Column({ name: 'password', nullable: false })
  password: string;

  @Column({ name: 'emailVerificationCode', nullable: true })
  emailVerificationCode?: string;

  @Column({ name: 'emailVerificationExpiry', nullable: true })
  emailVerificationExpiry?: Date;

  @Column({ name: 'emailVerifiedAt', nullable: true })
  emailVerifiedAt?: Date;

  @ManyToOne(() => Playlist, (playlist) => playlist.user)
  playlists: Playlist[];

  @ManyToMany(() => Post)
  @JoinTable()
  favoritePosts: Post[];

  @BeforeInsert()
  async hashPassword() {
    const hash = await argon.hash(this.password);
    this.password = hash;
    this.email = this.email.toLowerCase();
  }
}
