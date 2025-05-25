import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';
import { join } from 'path';

dotenv.config();

export = {
  type: 'postgres',
  host: process.env.POSTGRES_HOST,
  username: process.env.POSTGRES_USERNAME,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  // options: {
  //   instanceName: process.env.DEFAULT_DB_INSTANCE,
  //   enableArithAbort: false,
  // },
  logging: false,
  // dropSchema: false,
  synchronize: true,
  // migrationsRun: parseBoolean(process.env.DEFAULT_DB_RUN_MIGRATIONS),
  migrations: [join(__dirname, '..', 'migrations/*.{ts,js}')],
  cli: {
    migrationsDir: 'src/migrations',
  },
  entities: [join(__dirname, '..', '**/*.entity.{ts,js}')],
} as TypeOrmModuleOptions;
