import {
  AfterLoad,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Post } from '../../posts/entities/post.entity';
import { getImageFullUrl } from 'src/common/utils/functions';

@Entity('videos')
export class Video {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: string;

  @Column({ name: 'title', nullable: true })
  title: string;
  fullTitle: string;

  @Column({ name: 'postId', nullable: false })
  postId: string;

  @Column({ name: 'views', default: 0 })
  plays: number;

  @Column({ name: 'videoUrl', nullable: false })
  videoUrl: string;
  videoFullUrl: string;

  @Column({ name: 'videoType', nullable: true })
  videoType?: string;

  @Column({ name: 'videoSize', nullable: true })
  videoSize?: string;

  @Column({ name: 'videoDuration', nullable: true })
  videoDuration?: string;

  @ManyToOne(() => Post, (post) => post.videos, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'postId' })
  post: Post;

  @AfterLoad()
  public setImageUrl() {
    this.videoFullUrl = getImageFullUrl(this.videoUrl);
    const titleHasType = this.title?.split('.').length > 1;
    if (!titleHasType && this.videoType) {
      this.fullTitle = this.title + '.' + this.videoType;
    } else {
      this.fullTitle = this.title;
    }
  }
}
