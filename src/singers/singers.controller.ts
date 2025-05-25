import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post,
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
import { Admin } from '../admins/entities/admin.entity';
import { AdminRole } from '../admins/enums/admin-role.enum';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/user.decorator';
import { S3Service } from '../s3/s3.service';
import { CreateSingerDto } from './dto/create-singer.dto';
import { UpdateSingerDto } from './dto/update-singer.dto';
import { SingersService } from './singers.service';

@Controller('singers')
@UsePipes(new ValidationPipe())
export class SingersController {
  constructor(
    private readonly singersService: SingersService,
    private s3Service: S3Service,
  ) {}

  @ApiConsumes('multipart/form-data')
  @Roles(AdminRole.SUPERADMIN)
  @UseGuards(RolesGuard)
  @Post()
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
  async create(
    @UploadedFile() thumbnail: any,
    @CurrentUser() loggedInAdmin: Admin,
    @Body() createSingerDto: CreateSingerDto,
  ) {
    if (thumbnail) {
      let path = `rawadeed`;
      const uploadedImageUrl = await this.s3Service.s3FileUpload(
        thumbnail,
        path,
      );
      createSingerDto.thumbnail = uploadedImageUrl;
    }

    return await this.singersService.create(createSingerDto);
  }

  @Get()
  async findAll(
    @Query() queryParams: { take: number; skip: number; search: string },
  ) {
    return await this.singersService.findAll(queryParams);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.singersService.findOne(id);
  }

  @ApiConsumes('multipart/form-data')
  @Roles(AdminRole.SUPERADMIN)
  @UseGuards(RolesGuard)
  @Patch(':id')
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
  async update(
    @Param('id') id: string,
    @Body() updateSingerDto: UpdateSingerDto,
    @UploadedFile() thumbnail: any,
    @CurrentUser() loggedInAdmin: Admin,
  ) {
    if (thumbnail) {
      updateSingerDto.thumbnail = thumbnail;
    }

    return await this.singersService.update(id, updateSingerDto);
  }

  @Roles(AdminRole.SUPERADMIN)
  @UseGuards(RolesGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.singersService.remove(id);
  }
}
