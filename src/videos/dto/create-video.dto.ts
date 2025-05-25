import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateVideoDto {

  @ApiProperty()
  @IsNotEmpty()
  title: string;
  
  @ApiProperty()
  @IsNotEmpty()
  videoUrl: string;

  @ApiProperty()
  @IsOptional()
  videoType?: string;

  @ApiProperty()
  @IsOptional()
  videoSize?: string;

  @ApiProperty()
  @IsOptional()
  videoDuration?: string;
}
