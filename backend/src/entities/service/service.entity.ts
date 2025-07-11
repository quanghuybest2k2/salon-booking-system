import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Expose } from 'class-transformer';
import { ServiceProvider } from '../service-provider/service-provider.entity';
import { Appointment } from '../appointment/appointment.entity';

@Entity('services')
export class Service {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  @Expose()
  id: number;

  @ManyToOne(() => ServiceProvider, (provider) => provider.services, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'provider_id' })
  provider: ServiceProvider;

  @Column({ type: 'bigint' })
  provider_id: number;

  @Column({ type: 'varchar', length: 100 })
  @Expose()
  name: string;

  @Column({ type: 'text', nullable: true })
  @Expose()
  description: string;

  @Column({ type: 'int' })
  @Expose()
  duration_minutes: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  @Expose()
  price: number;

  @OneToMany(() => Appointment, (appointment) => appointment.service)
  appointments: Appointment[];
}
