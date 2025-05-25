import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { UploadedFileType } from '../../common/enums/uploaded-file-type.enum';

export class InitiateUploadDTO {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  fileName: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  fileType: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEnum(UploadedFileType)
  uploadType: UploadedFileType;
}
