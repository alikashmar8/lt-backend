import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminsModule } from './admins/admins.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AudiosModule } from './audios/audios.module';
import { PlaylistsModule } from './playlists/playlists.module';
import { PostsModule } from './posts/posts.module';
import { SingersModule } from './singers/singers.module';
import { UsersModule } from './users/users.module';
import { VideosModule } from './videos/videos.module';
import { AuthModule } from './auth/auth.module';
import { DeviceTokensModule } from './device-tokens/device-tokens.module';
import { S3Service } from './s3/s3.service';
import { AwsSdkModule } from 'nest-aws-sdk';
import { S3 } from 'aws-sdk';
import ormconfig = require('./config/ormconfig'); //path mapping doesn't work here
import { ConfigModule } from '@nestjs/config';
import { DataSource } from 'typeorm';
import { Video } from './videos/entities/video.entity';
import { Audio } from './audios/entities/audio.entity';
import { Post } from './posts/entities/post.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      cache: true,
      isGlobal: true,
      // validationSchema: validationSchema,
      // load: [configuration],
    }),
    TypeOrmModule.forRoot({
      ...ormconfig,
      // type: 'postgres',
      // // url: `${process.env.POSTGRES_HOST}://${process.env.POSTGRES_USERNAME}:${process.env.POSTGRES_PASSWORD}@localhost:${process.env.POSTGRES_PORT}/${process.env.POSTGRES_DB}`,
      // host: process.env.POSTGRES_HOST,
      // port: parseInt(process.env.POSTGRES_PORT),
      // username: process.env.POSTGRES_USERNAME,
      // password: process.env.POSTGRES_PASSWORD,
      // database: process.env.POSTGRES_DB,
      // // port: 5433,
      // // username: 'dev',
      // // password: 'password',
      // // database: 'my_database',
      // entities: ['src/**/*.entity{.ts,.js}'],
      // synchronize: true,
    }),
    AwsSdkModule.forRoot({
      defaultServiceOptions:
        process.env.SERVER_ENV === 'development'
          ? {
              endpoint: process.env.MINIO_ENDPOINT,
              accessKeyId: process.env.MINIO_ACCESS_KEY,
              secretAccessKey: process.env.MINIO_SECRET_KEY,
              // region: process.env.MINIO_REGION,
              s3ForcePathStyle: true,
              // signatureVersion: 'v4',
            }
          : {
              accessKeyId: process.env['AWS_ACCESS_KEY_ID'],
              secretAccessKey: process.env['AWS_SECRET_ACCESS_KEY'],
              region: process.env['AWS_REGION'],
            },
      services: [S3],
    }),
    UsersModule,
    AdminsModule,
    SingersModule,
    PostsModule,
    AudiosModule,
    VideosModule,
    PlaylistsModule,
    AuthModule,
    DeviceTokensModule,
  ],
  controllers: [AppController],
  providers: [AppService, S3Service],
})
export class AppModule {
  constructor(private dataSource: DataSource) {
    // this.dataSource.getRepository(Audio).delete({});
    // this.dataSource.getRepository(Video).delete({});
    // this.dataSource.getRepository(Post).delete({});
    console.log('AppModule ---------------');
    console.log(
      process.env.SERVER_ENV === 'development'
        ? {
            endpoint: process.env.MINIO_ENDPOINT,
            accessKeyId: process.env.MINIO_ACCESS_KEY,
            secretAccessKey: process.env.MINIO_SECRET_KEY,

            // region: process.env.MINIO_REGION,
            s3ForcePathStyle: true,
            // signatureVersion: 'v4',
          }
        : {
            accessKeyId: process.env['AWS_ACCESS_KEY_ID'],
            secretAccessKey: process.env['AWS_SECRET_ACCESS_KEY'],
            region: process.env['AWS_REGION'],
          },
    );
  }
}
