import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayMinSize,
  IsArray,
  IsDateString,
  IsNotEmpty,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { CreateAudioDto } from '../../audios/dto/create-audio.dto';
import { CreateVideoDto } from '../../videos/dto/create-video.dto';
import { Transform, Type } from 'class-transformer';

export class CreatePostDto {
  @ApiProperty()
  @IsNotEmpty()
  title: string;

  @ApiProperty()
  @IsOptional()
  description?: string;

  @ApiProperty()
  @IsOptional()
  lyrics?: string;

  @ApiProperty()
  @IsOptional()
  @IsDateString()
  releaseDate?: Date;

  @ApiProperty()
  @IsOptional()
  @IsDateString()
  releaseDateHijri?: Date;

  @ApiProperty()
  @IsOptional()
  location?: string;

  @ApiProperty()
  @IsOptional()
  event?: string;

  @ApiProperty()
  @IsOptional()
  externalLinks?: string;

  @ApiProperty()
  @IsNotEmpty()
  singerId: string;

  @ApiProperty()
  @IsOptional()
  @IsArray()
  @ArrayMinSize(0)
  @Transform(({ value }) => {
    // if (typeof value === 'string') {
    return JSON.parse(value);
    // }
    // return value;
  })
  @Type(() => CreateAudioDto)
  @ValidateNested({ each: true })
  audios: CreateAudioDto[];

  @ApiProperty()
  @IsOptional()
  @ArrayMinSize(0)
  @IsArray()
  @Transform(({ value }) => {
    // if (typeof value === 'string') {
    return JSON.parse(value);
    // }
    // return value;
  })
  @Type(() => CreateVideoDto)
  @ValidateNested({ each: true })
  videos: CreateVideoDto[];

  thumbnail?: string;
}
