import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Expose } from 'class-transformer';
import { DayOfWeek } from 'src/common/enums';
import { ServiceProvider } from '../service-provider/service-provider.entity';

@Entity('provider_availability')
export class ProviderAvailability {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  @Expose()
  id: number;

  @ManyToOne(() => ServiceProvider, (provider) => provider.availabilities, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'provider_id' })
  provider: ServiceProvider;

  @Column({ type: 'bigint' })
  provider_id: number;

  @Column({ type: 'enum', enum: DayOfWeek })
  @Expose()
  day_of_week: DayOfWeek;

  @Column({ type: 'time' })
  @Expose()
  start_time: string;

  @Column({ type: 'time' })
  @Expose()
  end_time: string;
}
