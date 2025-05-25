import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminsService } from '../admins/admins.service';
import { Admin } from '../admins/entities/admin.entity';
import { DeviceToken } from '../device-tokens/entities/device-token.entity';
import { S3Service } from '../s3/s3.service';
import { Post } from './entities/post.entity';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';

@Module({
  imports: [TypeOrmModule.forFeature([Post, Admin, DeviceToken])],
  controllers: [PostsController],
  providers: [PostsService, AdminsService, S3Service],
})
export class PostsModule {}
