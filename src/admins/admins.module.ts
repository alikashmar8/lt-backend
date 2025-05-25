import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { DeviceToken } from '../device-tokens/entities/device-token.entity';
import { AdminsController } from './admins.controller';
import { AdminsService } from './admins.service';
import { Admin } from './entities/admin.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Admin, DeviceToken])],
  controllers: [AdminsController],
  providers: [AdminsService],
})
export class AdminsModule {}
