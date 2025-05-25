import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AdminsService } from '../admins/admins.service';
import { Admin } from '../admins/entities/admin.entity';
import { DeviceTokensService } from '../device-tokens/device-tokens.service';
import { DeviceToken } from '../device-tokens/entities/device-token.entity';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [TypeOrmModule.forFeature([DeviceToken, Admin])],
  controllers: [AuthController],
  providers: [AuthService, AdminsService, DeviceTokensService],
})
export class AuthModule {}
