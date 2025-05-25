import {
  AbortMultipartUploadCommand,
  CompleteMultipartUploadCommand,
  CreateMultipartUploadCommand,
  GetObjectCommand,
  GetObjectCommandInput,
  HeadObjectCommand,
  S3Client,
  S3ClientConfig,
  UploadPartCommand,
} from '@aws-sdk/client-s3';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { S3 } from 'aws-sdk';
import { InjectAwsService } from 'nest-aws-sdk';
import { extname } from 'path';
import { v4 as uuidv4 } from 'uuid';
import {
  generateFileUniqueName,
  getDirectoryFromFileType,
} from '../common/utils/functions';
import { InitiateUploadDTO } from '../posts/dto/initiate-upload.dto';

@Injectable()
export class S3Service {
  private s3Client: S3Client;

  constructor(@InjectAwsService(S3) private readonly s3: S3) {
    const configObject: S3ClientConfig =
      process.env.SERVER_ENV === 'development'
        ? {
            endpoint: process.env.MINIO_ENDPOINT,
            // accessKeyId: process.env.MINIO_ACCESS_KEY,
            // secretAccessKey: process.env.MINIO_SECRET_KEY,
            credentials: {
              accessKeyId: process.env.MINIO_ACCESS_KEY,
              secretAccessKey: process.env.MINIO_SECRET_KEY,
            },
            forcePathStyle: true,
            // region: process.env.MINIO_REGION,
            // s3ForcePathStyle: true,
            // signatureVersion: 'v4',
          }
        : {
            // accessKeyId: process.env['AWS_ACCESS_KEY_ID'],
            // secretAccessKey: process.env['AWS_SECRET_ACCESS_KEY'],
            credentials: {
              accessKeyId: process.env['AWS_ACCESS_KEY_ID'],
              secretAccessKey: process.env['AWS_SECRET_ACCESS_KEY'],
            },
            region: process.env['AWS_REGION'],
          };
    this.s3Client = new S3Client({
      ...configObject,
    });
  }

  async s3FileUpload(file: any, filepath: string): Promise<string> {
    const randomName = generateFileUniqueName();
    const fileName = `${randomName}${extname(file.originalname)}`;

    const urlKey = `${filepath}/${fileName}`;
    const params: S3.PutObjectRequest = {
      Body: file.buffer,
      Bucket:
        process.env.SERVER_ENV === 'development'
          ? process.env.MINIO_BUCKET
          : process.env.AWS_S3_BUCKET_NAME,
      Key: urlKey,
    };

    const data: S3.ManagedUpload.SendData = await this.s3
      .upload(params)
      .promise()
      .then(
        (data) => {
          return data;
        },
        (err) => {
          console.log('S3 upload error:');
          console.log(err);

          throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
        },
      );

    return data.Location;
  }

  async s3FileDelete(filePath: string): Promise<void> {
    const params: S3.DeleteObjectRequest = {
      Bucket:
        process.env.SERVER_ENV === 'development'
          ? process.env.MINIO_BUCKET
          : process.env.AWS_S3_BUCKET_NAME,
      Key: filePath.split(`.com/`)[1],
    };

    await this.s3
      .deleteObject(params)
      .promise()
      .then(
        (data) => {},
        (err) => {
          console.log('S3 delete error:');
          console.log(err);
          throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
        },
      );
  }

  async initiateMultipartUpload(data: InitiateUploadDTO) {
    const uploadDirectory = getDirectoryFromFileType(data.uploadType);
    const fileExt = extname(data.fileName);
    const createMultipartUploadParams = {
      Bucket:
        process.env.SERVER_ENV === 'development'
          ? process.env.MINIO_BUCKET
          : process.env.AWS_S3_BUCKET_NAME,
      Key: `${uploadDirectory}/${uuidv4()}${fileExt}`,
      ContentType: data.fileType,
    };

    const upload = await this.s3Client.send(
      new CreateMultipartUploadCommand(createMultipartUploadParams),
    );
    return upload;
  }

  async uploadPart(
    uploadId: string,
    partNumber: number,
    fileChunk: Buffer,
    key: string,
  ) {
    const uploadPartParams = {
      Bucket:
        process.env.SERVER_ENV === 'development'
          ? process.env.MINIO_BUCKET
          : process.env.AWS_S3_BUCKET_NAME,
      Key: key,
      PartNumber: partNumber,
      UploadId: uploadId,
      Body: fileChunk,
    };

    const part = await this.s3Client.send(
      new UploadPartCommand(uploadPartParams),
    );
    return part;
  }

  async completeMultipartUpload(uploadId: string, key: string, parts: any[]) {
    const completeMultipartUploadParams = {
      Bucket:
        process.env.SERVER_ENV === 'development'
          ? process.env.MINIO_BUCKET
          : process.env.AWS_S3_BUCKET_NAME,
      Key: key,
      UploadId: uploadId,
      MultipartUpload: {
        Parts: parts,
      },
    };

    await this.s3Client.send(
      new CompleteMultipartUploadCommand(completeMultipartUploadParams),
    );
  }

  async abortMultipartUpload(uploadId: string, key: string) {
    const abortMultipartUploadParams = {
      Bucket:
        process.env.SERVER_ENV === 'development'
          ? process.env.MINIO_BUCKET
          : process.env.AWS_S3_BUCKET_NAME,
      Key: key,
      UploadId: uploadId,
    };

    await this.s3Client.send(
      new AbortMultipartUploadCommand(abortMultipartUploadParams),
    );
  }

  async getFileMetadata(key: string) {
    const params = {
      Bucket:
        process.env.SERVER_ENV === 'development'
          ? process.env.MINIO_BUCKET
          : process.env.AWS_S3_BUCKET_NAME,
      Key: key,
    };

    return await this.s3Client.send(new HeadObjectCommand(params));
  }

  async getFileStream(key: string, startRange?: number, endRange?: number) {
    const data = await this.getFileMetadata(key);

    const fileSize = data.ContentLength;

    const end = Math.min(endRange, fileSize - 1);
    const range = `bytes=${startRange}-${end}`;

    const params: GetObjectCommandInput = {
      Bucket:
        process.env.SERVER_ENV === 'development'
          ? process.env.MINIO_BUCKET
          : process.env.AWS_S3_BUCKET_NAME,
      Key: key,
      Range: range,
    };

    return await this.s3Client.send(new GetObjectCommand(params));
  }
}
