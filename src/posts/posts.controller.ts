import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiConsumes } from '@nestjs/swagger';
import { extname } from 'path';
import { IsAdminGuard } from '../auth/guards/is-admin.guard';
import { S3Service } from '../s3/s3.service';
import { CreatePostDto } from './dto/create-post.dto';
import { InitiateUploadDTO } from './dto/initiate-upload.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostsService } from './posts.service';

@UsePipes(new ValidationPipe({ transform: true, forbidUnknownValues: false }))
@Controller('posts')
export class PostsController {
  constructor(
    private readonly postsService: PostsService,
    private readonly s3Service: S3Service,
  ) {}

  @UseGuards(IsAdminGuard)
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileInterceptor(
      'thumbnail',
      // getMulterSettings({ destination: './public/uploads/ads' }),
      {
        fileFilter: (_req: any, file: any, callback: any) => {
          if (extname(file.originalname).match('jpg|jpeg|png')) {
            callback(null, true);
          } else {
            callback(
              new HttpException(
                `Unsupported file type ${extname(file.originalname)}`,
                HttpStatus.BAD_REQUEST,
              ),
              false,
            );
          }
        },
        limits: { fileSize: 1024 * 1024 * 5 }, // 5MB
      },
    ),
  )
  @Post()
  async create(
    @Body() body: CreatePostDto,
    @UploadedFile() thumbnail: any /* Express.Multer.File */,
  ) {
    if (thumbnail) body.thumbnail = thumbnail;
    return await this.postsService.create(body);
  }

  @Get()
  async findAll(
    @Query() queryParams: { limit: number; offset: number; search: string },
  ) {
    return await this.postsService.findAll(queryParams);
  }

  @Get(':id')
  async findOne(
    @Param('id') id: string,
    @Query('relations') relations: string[],
  ) {
    if (!relations?.length) relations = ['singer', 'videos', 'audios'];
    return await this.postsService.findOneByIdOrFail(id, relations);
  }

  @UseGuards(IsAdminGuard)
  @Post('initiate-upload')
  async initiateUpload(@Body() body: InitiateUploadDTO) {
    return this.s3Service.initiateMultipartUpload(body);
  }

  @UseGuards(IsAdminGuard)
  @Put('upload-part')
  @UseInterceptors(FileInterceptor('fileChunk'))
  async uploadPart(
    @Body('uploadId') uploadId: string,
    @Body('key') key: string,
    @Body('partNumber') partNumber: number,
    @UploadedFile() fileChunk: any, //Express.Multer.File
  ) {
    const uploadedPart = await this.s3Service.uploadPart(
      uploadId,
      partNumber,
      fileChunk.buffer,
      key,
    );
    return { ETag: uploadedPart.ETag, PartNumber: partNumber };
  }

  @UseGuards(IsAdminGuard)
  @Post('complete-upload')
  async completeUpload(
    @Body('uploadId') uploadId: string,
    @Body('key') key: string,
    @Body('parts') parts: { ETag: string; PartNumber: number }[],
  ) {
    await this.s3Service.completeMultipartUpload(uploadId, key, parts);
    return { message: 'Upload completed successfully' };
  }

  @UseGuards(IsAdminGuard)
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileInterceptor('thumbnail', {
      fileFilter: (_req: any, file: any, callback: any) => {
        if (extname(file.originalname).match('jpg|jpeg|png')) {
          callback(null, true);
        } else {
          callback(
            new HttpException(
              `Unsupported file type ${extname(file.originalname)}`,
              HttpStatus.BAD_REQUEST,
            ),
            false,
          );
        }
      },
      limits: { fileSize: 1024 * 1024 * 5 }, // 5MB
    }),
  )
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() body: UpdatePostDto,
    @UploadedFile() thumbnail: any,
  ) {
    if (thumbnail) body.thumbnail = thumbnail;
    return await this.postsService.update(id, body);
  }

  @UseGuards(IsAdminGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.postsService.remove(id);
  }
}
