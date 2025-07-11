import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Expose } from 'class-transformer';
import { User } from '../user/user.entity';
import { Service } from '../service/service.entity';
import { ProviderAvailability } from '../provider-availability/provider-availability.entity';
import { Appointment } from '../appointment/appointment.entity';

@Entity('service_providers')
export class ServiceProvider {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  @Expose()
  id: number;

  @ManyToOne(() => User, (user) => user.service_providers, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'bigint' })
  user_id: number;

  @Column({ type: 'varchar', length: 100 })
  @Expose()
  business_name: string;

  @Column({ type: 'text', nullable: true })
  @Expose()
  address: string;

  @Column({ type: 'text', nullable: true })
  @Expose()
  description: string;

  @OneToMany(() => Service, (service) => service.provider)
  services: Service[];

  @OneToMany(
    () => ProviderAvailability,
    (availability) => availability.provider,
  )
  availabilities: ProviderAvailability[];

  @OneToMany(() => Appointment, (appointment) => appointment.provider)
  appointments: Appointment[];
}
