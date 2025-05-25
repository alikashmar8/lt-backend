import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Admin } from '../../admins/entities/admin.entity';
import { User } from '../../users/entities/user.entity';
import { DeviceTokenStatus } from '../enums/device-token-status.enum';

@Entity({ name: 'device_tokens' })
export class DeviceToken {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @Column({ name: 'token', nullable: false })
  token: string;

  @Column({ name: 'fcmToken', nullable: true })
  fcmToken?: string;

  @Column({
    name: 'status',
    type: 'enum',
    enum: DeviceTokenStatus,
    default: DeviceTokenStatus.ACTIVE,
  })
  status: DeviceTokenStatus;

  @Column({ name: 'userId', nullable: true })
  userId?: string;

  @Column({ name: 'adminId', nullable: true })
  adminId?: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user?: User;

  @ManyToOne(() => Admin, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'adminId' })
  admin?: Admin;

  @CreateDateColumn({ name: 'createdAt' })
  createdAt: Date;
}
