import { S3Service } from './../s3/s3.service';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post } from './entities/post.entity';

@Injectable()
export class PostsService {
  constructor(
    private readonly s3Service: S3Service,
    @InjectRepository(Post) private postsRepository: Repository<Post>,
  ) {}

  async findAll(queryParams: {
    limit: number;
    offset: number;
    search: string;
  }) {
    const limit = queryParams.limit || 10;
    const offset = queryParams.offset || 0;

    const postsQuery = this.postsRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.singer', 'singer')
      .take(limit)
      .skip(offset);

    if (queryParams.search)
      postsQuery.where(
        `post.title LIKE :search OR post.description LIKE :search 
        OR post.location LIKE :search OR post.event LIKE :search`,
        { search: `%${queryParams.search}%` },
      );

    const result = await postsQuery
      .orderBy(`post.createdAt`, 'DESC')
      .getManyAndCount();

    return {
      data: result[0],
      count: result[1],
    };
  }

  async create(createPostDto: CreatePostDto) {
    if (createPostDto.thumbnail) {
      const path = `posts`;
      const uploadedImageUrl = await this.s3Service.s3FileUpload(
        createPostDto.thumbnail,
        path,
      );
      createPostDto.thumbnail = uploadedImageUrl;
    }

    if (createPostDto?.videos?.length) {
      createPostDto.videos = createPostDto.videos.map((video) => {
        video.videoType = video.videoUrl.split('.').pop();
        return video;
      });
    }
    if (createPostDto?.audios?.length) {
      createPostDto.audios = createPostDto.audios.map((audio) => {
        audio.audioType = audio.audioUrl.split('.').pop();
        return audio;
      });
    }
    return await this.postsRepository.save(createPostDto).catch((err) => {
      console.error(err);
      throw new BadRequestException('Error saving post');
    });
  }

  async findOne(id: string, relations?: string[]) {
    return await this.postsRepository
      .findOneOrFail({
        where: { id },
        relations,
      })
      .catch((err) => {
        console.error(err);
        throw new BadRequestException('Post not found');
      });
  }

  async findOneByIdOrFail(id: string, relations?: string[]) {
    return await this.postsRepository
      .findOneOrFail({
        where: { id },
        relations,
      })
      .catch((err) => {
        console.error(err);
        throw new BadRequestException('Post not found');
      });
  }

  async update(id: string, updatePostDto: UpdatePostDto) {
    const post = await this.findOneByIdOrFail(id);

    let oldThumbnail = null;
    if (
      updatePostDto.thumbnail &&
      typeof updatePostDto.thumbnail !== 'string'
    ) {
      // Delete old thumbnail if exists
      if (post.thumbnail) {
        oldThumbnail = post.thumbnail;
      }

      // Upload new thumbnail
      const path = `posts`;
      const uploadedImageUrl = await this.s3Service.s3FileUpload(
        updatePostDto.thumbnail,
        path,
      );
      updatePostDto.thumbnail = uploadedImageUrl;
    }
    if (updatePostDto?.videos?.length) {
      updatePostDto.videos = updatePostDto.videos.map((video) => {
        video.videoType = video.videoUrl.split('.').pop();
        return video;
      });
    }
    if (updatePostDto?.audios?.length) {
      updatePostDto.audios = updatePostDto.audios.map((audio) => {
        audio.audioType = audio.audioUrl.split('.').pop();
        return audio;
      });
    }

    Object.assign(post, updatePostDto);

    return await this.postsRepository
      .save(post)
      .catch((err) => {
        console.error(err);
        throw new BadRequestException('Error updating post');
      })
      .then(async () => {
        // Delete old thumbnail if it was replaced
        if (oldThumbnail) {
          // const oldKey = oldThumbnail.split('/').pop();
          try {
            await this.s3Service.s3FileDelete(oldThumbnail);
          } catch (error) {
            console.error('Error deleting old thumbnail:', error);
          }
        }
      });
  }

  async remove(id: string) {
    return await this.postsRepository.delete(id).catch((err) => {
      console.error(err);
      throw new BadRequestException('Error deleting record');
    });
  }
}
