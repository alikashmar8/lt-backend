import { getImageFullUrl } from 'src/common/utils/functions';
import {
  AfterLoad,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Post } from '../../posts/entities/post.entity';

@Entity('audios')
export class Audio {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: string;

  @Column({ name: 'postId', nullable: false })
  postId: string;

  @Column({ name: 'title', nullable: true })
  title: string;
  fullTitle: string;

  @Column({ name: 'plays', default: 0 })
  plays: number;

  @Column({ name: 'audioUrl', nullable: false })
  audioUrl: string;
  audioFullUrl: string;

  @Column({ name: 'audioType', nullable: true })
  audioType?: string;

  @Column({ name: 'audioSize', nullable: true })
  audioSize?: string;

  @Column({ name: 'audioDuration', nullable: true })
  audioDuration?: string;

  @ManyToOne(() => Post, (post) => post.audios, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'postId' })
  post: Post;

  @CreateDateColumn({ name: 'createdAt' })
  createdAt: Date;

  @AfterLoad()
  public setImageUrl() {
    this.audioFullUrl = getImageFullUrl(this.audioUrl);
    const titleHasType = this.title?.split('.').length > 1;
    if (!titleHasType && this.audioType) {
      this.fullTitle = this.title + '.' + this.audioType;
    } else {
      this.fullTitle = this.title;
    }
  }
}
