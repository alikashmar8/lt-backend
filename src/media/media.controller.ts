import {
  Controller,
  Get,
  Head,
  HttpStatus,
  Query,
  Req,
  Res,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { Readable } from 'stream';
import { UploadedFileType } from '../common/enums/uploaded-file-type.enum';
import { S3Service } from '../s3/s3.service';
import { DataSource } from 'typeorm';
import { Video } from '../videos/entities/video.entity';
import { Audio } from '../audios/entities/audio.entity';

@Controller('media')
export class MediaController {
  constructor(private s3Service: S3Service, private dataSource: DataSource) {}

  @Head()
  async getMediaHead(@Query('key') key: string, @Res() res: Response) {
    if (!key) {
      return res.status(HttpStatus.BAD_REQUEST).send('Key is required');
    }

    try {
      const fileData = await this.s3Service.getFileMetadata(key);

      res.setHeader('Content-Type', fileData.ContentType);
      res.setHeader('Content-Length', fileData.ContentLength);
      res.setHeader('Accept-Ranges', 'bytes');
      res.setHeader('Cache-Control', 'public, max-age=86400'); // 1 day caching
      res.setHeader('ETag', fileData.ETag);
      res.status(HttpStatus.OK).end();
    } catch (error) {
      console.error('Error retrieving file metadata:', error);
      res.status(HttpStatus.NOT_FOUND).send('File not found');
    }
  }

  @Get()
  async getMedia(
    @Query('key') key: string,
    @Query('type') type: UploadedFileType,
    @Query('download') download: string,
    @Res() res: Response,
    @Req() req: Request,
  ) {
    if (!key) {
      return res.status(HttpStatus.BAD_REQUEST).send('Key is required');
    }

    try {
      const fileData = await this.s3Service.getFileMetadata(key);
      const fileSize = fileData.ContentLength;
      const range = req.headers.range;

      let fileName = key.split('/').pop();
      if (download) {
        const isAudio = type === UploadedFileType.AUDIO;
        const model = isAudio ? Audio : Video;
        const filter = isAudio ? { audioUrl: key } : { videoUrl: key };
        const mediaRecord = await this.dataSource.getRepository(model).findOne({
          where: filter,
          select: ['id', 'title'],
        });

        if (mediaRecord) {
          fileName = mediaRecord.title;
        }
      }

      // Set content disposition based on download parameter
      const contentDisposition =
        download === 'true'
          ? `attachment; filename=${encodeURIComponent(key.split('/').pop())}`
          : `inline; filename=${encodeURIComponent(key.split('/').pop())}`;

      // Set common headers
      res.setHeader('Content-Type', fileData.ContentType);
      res.setHeader('Accept-Ranges', 'bytes');
      res.setHeader('Cache-Control', 'public, max-age=86400'); // 1 day caching
      res.setHeader('Content-Disposition', contentDisposition);
      res.setHeader('ETag', fileData.ETag);

      // If no range request, serve the entire file
      if (!range) {
        const fileStream = await this.s3Service.getFileStream(key);
        res.setHeader('Content-Length', fileSize);
        res.status(HttpStatus.OK);

        const readStream = fileStream.Body as Readable;
        readStream.pipe(res);
        return;
      }

      // Handle range request
      const rangeParts = range.replace(/bytes=/, '').split('-');
      const start = parseInt(rangeParts[0], 10);
      // If end is not specified, use a reasonable chunk size or the end of file
      const end = rangeParts[1]
        ? parseInt(rangeParts[1], 10)
        : Math.min(start + 1024 * 1024 * 5, fileSize - 1); // Default 5MB chunks

      // Validate range
      if (isNaN(start) || start < 0 || start >= fileSize) {
        res.setHeader('Content-Range', `bytes */${fileSize}`);
        return res.status(HttpStatus.REQUESTED_RANGE_NOT_SATISFIABLE).end();
      }

      const contentLength = end - start + 1;
      const fileStream = await this.s3Service.getFileStream(key, start, end);

      res.setHeader('Content-Length', contentLength);
      res.setHeader('Content-Range', `bytes ${start}-${end}/${fileSize}`);
      res.status(HttpStatus.PARTIAL_CONTENT);

      const readStream = fileStream.Body as Readable;
      readStream.pipe(res);
    } catch (error) {
      console.error('Error streaming file:', error);
      res.status(HttpStatus.NOT_FOUND).send('File not found');
    }
  }
}
