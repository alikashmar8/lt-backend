import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Post } from '../../posts/entities/post.entity';

@Entity('singers')
export class Singer {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: string;

  @Column({ name: 'nameAr', nullable: false })
  nameAr: string;

  @Column({ name: 'nameEn', nullable: false })
  nameEn: string;

  @Column({ name: 'description', type: 'text', nullable: true })
  description?: string;

  @Column({ name: 'thumbnail', nullable: true })
  thumbnail?: string;

  @OneToMany(() => Post, (post) => post.singer)
  posts: Post[];
}
