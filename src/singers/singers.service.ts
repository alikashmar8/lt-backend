import { S3Service } from './../s3/s3.service';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateSingerDto } from './dto/create-singer.dto';
import { UpdateSingerDto } from './dto/update-singer.dto';
import { Singer } from './entities/singer.entity';

@Injectable()
export class SingersService {
  constructor(
    private s3Service: S3Service,
    @InjectRepository(Singer) private singersRepository: Repository<Singer>,
  ) {}

  async create(createSingerDto: CreateSingerDto) {
    return await this.singersRepository.save(createSingerDto).catch((err) => {
      console.error(err);
      throw new BadRequestException('Error saving record');
    });
  }

  async findAll(queryParams: { take: number; skip: number; search: string }) {
    const take = queryParams.take || 10;
    const skip = queryParams.skip || 0;

    const singersQuery = this.singersRepository
      .createQueryBuilder('singer')
      .take(take)
      .skip(skip);

    if (queryParams.search)
      singersQuery.where(
        'LOWER(singer.nameAr) LIKE :search OR LOWER(singer.nameEn) LIKE :search',
        { search: `%${queryParams.search.toLowerCase()}%` },
      );

    const result = await singersQuery.getManyAndCount();

    return {
      data: result[0],
      count: result[1],
    };
  }

  async findOne(id: string) {
    return await this.singersRepository
      .findOneOrFail({
        where: { id },
      })
      .catch((err) => {
        console.error(err);
        throw new BadRequestException('Singer not found');
      });
  }

  async update(id: string, updateSingerDto: UpdateSingerDto) {
    const singer = await this.findOne(id);
    
    let oldThumbnail = null;
    if (updateSingerDto.thumbnail && typeof updateSingerDto.thumbnail !== 'string') {
      // Store old thumbnail for deletion after successful update
      if (singer.thumbnail) {
        oldThumbnail = singer.thumbnail;
      }
      
      // Upload new thumbnail
      const path = `rawadeed`;
      const uploadedImageUrl = await this.s3Service.s3FileUpload(
        updateSingerDto.thumbnail,
        path,
      );
      updateSingerDto.thumbnail = uploadedImageUrl;
    }
    
    Object.assign(singer, updateSingerDto);
    
    return await this.singersRepository
      .save(singer)
      .catch((err) => {
        console.error(err);
        throw new BadRequestException('Error updating singer');
      })
      .then(async (updatedSinger) => {
        // Delete old thumbnail if it was replaced
        if (oldThumbnail) {
          try {
            await this.s3Service.s3FileDelete(oldThumbnail);
          } catch (error) {
            console.error('Error deleting old thumbnail:', error);
          }
        }
        return updatedSinger;
      });
  }

  async remove(id: string) {
    return await this.singersRepository.delete(id).catch((err) => {
      console.error(err);
      throw new BadRequestException('Error deleting record');
    });
  }
}
