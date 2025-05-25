import { BadRequestException, Injectable } from '@nestjs/common';
import * as argon from 'argon2';
import { AdminsService } from '../admins/admins.service';
import { DeviceTokensService } from '../device-tokens/device-tokens.service';
import { AdminLoginDTO } from './dtos/admin-login.dto';
@Injectable()
export class AuthService {
  constructor(
    private adminService: AdminsService,
    private deviceTokensService: DeviceTokensService,
  ) {}

  async adminLogin(body: AdminLoginDTO) {
    const exists = await this.adminService.findOneByEmailOrFail(body.email);

    if (!exists) throw new BadRequestException('Invalid email or password');

    const isValid = await argon.verify(exists.password, body.password);

    if (!isValid) throw new BadRequestException('Invalid email or password');

    const token = await this.deviceTokensService.generateToken({
      adminId: exists.id,
    });

    return {
      admin: exists,
      access_token: token.token,
    };
  }
}
