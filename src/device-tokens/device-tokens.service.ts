import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateDeviceTokenDto } from './dto/create-device-token.dto';
import { UpdateDeviceTokenDto } from './dto/update-device-token.dto';
import { DeviceToken } from './entities/device-token.entity';
import { DeviceTokenStatus } from './enums/device-token-status.enum';

@Injectable()
export class DeviceTokensService {
  constructor(
    @InjectRepository(DeviceToken)
    private deviceTokensRepository: Repository<DeviceToken>,
  ) {}

  async generateToken(data: {
    adminId?: string;
    userId?: string;
    fcmToken?: string;
  }) {
    if (!data.adminId && !data.userId) return null;

    const token = Math.random().toString(36).substring(2);

    return await this.deviceTokensRepository.save({
      token,
      fcmToken: data.fcmToken,
      status: DeviceTokenStatus.ACTIVE,
      adminId: data.adminId,
      userId: data.userId,
    });
  }
  create(createDeviceTokenDto: CreateDeviceTokenDto) {
    return 'This action adds a new deviceToken';
  }

  findAll() {
    return `This action returns all deviceTokens`;
  }

  findOne(id: number) {
    return `This action returns a #${id} deviceToken`;
  }

  update(id: number, updateDeviceTokenDto: UpdateDeviceTokenDto) {
    return `This action updates a #${id} deviceToken`;
  }

  remove(id: number) {
    return `This action removes a #${id} deviceToken`;
  }
}
