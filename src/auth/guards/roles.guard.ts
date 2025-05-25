import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AdminsService } from '../../admins/admins.service';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private adminsService: AdminsService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    const request = context.switchToHttp().getRequest();
    const authorization = request.headers.authorization;
    if (!authorization) return false;
    const token = authorization.split(' ')[1];
    console.log('token', token);
    
    if (!token) {
      return false;
    }

    try {
      const admin = await this.adminsService.findOneByToken(token);
      console.log('admin', admin);

      console.log('roles', roles);

      console.log('!admin || !roles.includes(admin.role)');
      console.log(!admin || !roles.includes(admin.role));
      
      
      
      if (!admin || !roles.includes(admin.role)) return false;

      request.admin = admin;
      return true;
    } catch (err) {
      throw new HttpException('Token Invalid', HttpStatus.FORBIDDEN);
    }
  }
}
