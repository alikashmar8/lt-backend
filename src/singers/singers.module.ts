import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminsService } from '../admins/admins.service';
import { Admin } from '../admins/entities/admin.entity';
import { DeviceToken } from '../device-tokens/entities/device-token.entity';
import { S3Service } from '../s3/s3.service';
import { Singer } from './entities/singer.entity';
import { SingersController } from './singers.controller';
import { SingersService } from './singers.service';

@Module({
  imports: [TypeOrmModule.forFeature([Singer, Admin, DeviceToken])],
  controllers: [SingersController],
  providers: [SingersService, AdminsService, S3Service],
})
export class SingersModule {}
