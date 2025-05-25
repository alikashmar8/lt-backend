import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { DeviceToken } from '../device-tokens/entities/device-token.entity';
import { DeviceTokenStatus } from '../device-tokens/enums/device-token-status.enum';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { Admin } from './entities/admin.entity';

@Injectable()
export class AdminsService {
  constructor(
    @InjectRepository(Admin) private adminsRepository: Repository<Admin>,
    @InjectRepository(DeviceToken)
    private deviceTokensRepository: Repository<DeviceToken>,
  ) {}

  async findOneByToken(token: any) {
    const deviceToken = await this.deviceTokensRepository.findOne({
      where: { token, status: DeviceTokenStatus.ACTIVE },
      relations: ['admin'],
    });

    return deviceToken?.admin;
  }

  async findOneByEmailOrFail(email: string) {
    return await this.adminsRepository
      .findOneOrFail({ where: { email } })
      .catch(() => {
        throw new BadRequestException('Admin not found');
      });
  }
  create(createAdminDto: CreateAdminDto) {
    return 'This action adds a new admin';
  }

  findAll() {
    return `This action returns all admins`;
  }

  findOne(id: number) {
    return `This action returns a #${id} admin`;
  }

  update(id: number, updateAdminDto: UpdateAdminDto) {
    return `This action updates a #${id} admin`;
  }

  remove(id: number) {
    return `This action removes a #${id} admin`;
  }
}
