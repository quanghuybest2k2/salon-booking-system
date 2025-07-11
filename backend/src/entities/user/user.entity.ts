import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  Index,
} from 'typeorm';
import { Exclude, Expose } from 'class-transformer';
import { UserRole } from 'src/common/enums';
import { ServiceProvider } from '../service-provider/service-provider.entity';
import { Appointment } from '../appointment/appointment.entity';
import { Notification } from '../notification/notification.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  @Expose()
  id: number;

  @Column()
  @Expose()
  username: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  @Expose()
  @Index('idx_users_email')
  email: string;

  @Column({ type: 'varchar', length: 255 })
  @Exclude()
  password: string;

  @Column({ type: 'varchar', length: 100 })
  @Expose()
  full_name: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  @Expose()
  phone_number: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.CUSTOMER })
  @Expose()
  role: UserRole;

  @Column({ nullable: true })
  @Exclude()
  refreshToken: string;

  @Column({ type: 'timestamp', nullable: true })
  @Exclude()
  refreshTokenExpiry: Date;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    precision: null,
  })
  @Expose()
  created_at: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    precision: null,
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  @Expose()
  updated_at: Date;

  @OneToMany(() => ServiceProvider, (serviceProvider) => serviceProvider.user)
  service_providers: ServiceProvider[];

  @OneToMany(() => Appointment, (appointment) => appointment.customer)
  appointments: Appointment[];

  @OneToMany(() => Notification, (notification) => notification.user)
  notifications: Notification[];
}
