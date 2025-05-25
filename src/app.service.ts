import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Admin } from './admins/entities/admin.entity';
import { AdminRole } from './admins/enums/admin-role.enum';

@Injectable()
export class AppService {
  constructor(private dataSource: DataSource) {}
  getHello(): string {
    return 'Hello World!';
  }

  async initData() {
    return await this.dataSource.transaction(async (txManager) => {
      const superAdminExists = await txManager.getRepository(Admin).findOne({
        where: { role: AdminRole.SUPERADMIN },
      });

      if (!superAdminExists) {
        const superAdmin = txManager.getRepository(Admin).create({
          name: 'Super Admin',
          email: 'admin@admin.com',
          password: '12345678',
          role: AdminRole.SUPERADMIN,
        });

        await txManager.getRepository(Admin).save(superAdmin);
      }

      return {
        message: 'Data initialized successfully',
      };
    });
  }
}
