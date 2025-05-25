import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateSingerDto {
  @ApiProperty()
  @IsNotEmpty()
  nameAr: string;

  @ApiProperty()
  @IsNotEmpty()
  nameEn: string;

  @ApiProperty()
  @IsOptional()
  description?: string;

  @ApiProperty()
  @IsOptional()
  thumbnail?: any;
}
