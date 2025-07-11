import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  Index,
  JoinColumn,
} from 'typeorm';
import { Expose } from 'class-transformer';
import { AppointmentStatus } from 'src/common/enums';
import { User } from '../user/user.entity';
import { Service } from '../service/service.entity';
import { ServiceProvider } from '../service-provider/service-provider.entity';
import { Notification } from '../notification/notification.entity';

@Entity('appointments')
@Index('idx_appointments_time', ['provider_id', 'start_time', 'end_time'])
export class Appointment {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  @Expose()
  id: number;

  @ManyToOne(() => User, (user) => user.appointments, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'customer_id' })
  customer: User;

  @Column({ type: 'bigint' })
  customer_id: number;

  @ManyToOne(() => Service, (service) => service.appointments, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'service_id' })
  service: Service;

  @Column({ type: 'bigint' })
  service_id: number;

  @ManyToOne(() => ServiceProvider, (provider) => provider.appointments, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'provider_id' })
  provider: ServiceProvider;

  @Column({ type: 'bigint' })
  provider_id: number;

  @Column({ type: 'datetime' })
  @Expose()
  start_time: Date;

  @Column({ type: 'datetime' })
  @Expose()
  end_time: Date;

  @Column({
    type: 'enum',
    enum: AppointmentStatus,
    default: AppointmentStatus.PENDING,
  })
  @Expose()
  status: AppointmentStatus;

  @Column({ type: 'text', nullable: true })
  @Expose()
  notes: string;

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

  @OneToMany(() => Notification, (notification) => notification.appointment)
  notifications: Notification[];
}
