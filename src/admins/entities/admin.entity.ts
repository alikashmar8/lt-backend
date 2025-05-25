import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import * as argon from 'argon2';
import { AdminRole } from '../enums/admin-role.enum';

@Entity('admins')
export class Admin {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: string;

  @Column({ name: 'name', nullable: false })
  name: string;

  @Column({ name: 'email', nullable: true, unique: true })
  email?: string;

  @Column({ name: 'password', nullable: false })
  password: string;

  @Column({ name: 'role', type: 'enum', enum: AdminRole, nullable: false })
  role: AdminRole;

  @CreateDateColumn({ name: 'createdAt' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updatedAt' })
  updatedAt: Date;

  @BeforeInsert()
  async hashPassword() {
    const hash = await argon.hash(this.password);
    this.password = hash;
    this.email = this.email.toLowerCase();
  }
}
