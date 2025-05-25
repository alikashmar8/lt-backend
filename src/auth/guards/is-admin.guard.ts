import {
  CanActivate,
  ExecutionContext,
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
} from '@nestjs/common';

import { AdminsService } from '../../admins/admins.service';

export class IsAdminGuard implements CanActivate {
  constructor(
    @Inject(forwardRef(() => AdminsService))
    private adminsService: AdminsService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authorization = request.headers.authorization;
    if (!authorization) return false;
    const token = authorization.split(' ')[1];

    if (!token) {
      return false;
    }
    try {
      const admin = await this.adminsService.findOneByToken(token);
      if (!admin) return false;

      request.admin = admin;
      return true;
    } catch (err) {
      throw new HttpException('Token Invalid', HttpStatus.FORBIDDEN);
    }
  }
}
