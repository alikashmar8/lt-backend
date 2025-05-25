import { Module } from '@nestjs/common';
import { S3Service } from '../s3/s3.service';
import { VideosController } from './videos.controller';
import { VideosService } from './videos.service';

@Module({
  controllers: [VideosController],
  providers: [VideosService],
})
export class VideosModule {}
