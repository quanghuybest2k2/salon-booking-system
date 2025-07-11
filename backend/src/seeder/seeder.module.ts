import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { typeOrmConfig } from 'src/config/typeorm.config';
import { User } from 'src/entities/user/user.entity';
import { ServiceProvider } from 'src/entities/service-provider/service-provider.entity';
import { Service } from 'src/entities/service/service.entity';
import { ProviderAvailability } from 'src/entities/provider-availability/provider-availability.entity';
import { Appointment } from 'src/entities/appointment/appointment.entity';
import { Notification } from 'src/entities/notification/notification.entity';
import { UsersRepository } from 'src/modules/users/users.repository';
import { UserSeeder } from './seeds/user.seeder';
import { ServiceProviderSeeder } from './seeds/service-provider.seeder';
import { ServiceSeeder } from './seeds/service.seeder';
import { ProviderAvailabilitySeeder } from './seeds/provider-availability.seeder';
import { AppointmentSeeder } from './seeds/appointment.seeder';
import { NotificationSeeder } from './seeds/notification.seeder';
import { NotificationRepository } from 'src/modules/notification/notification.repository';
import { AppointmentRepository } from 'src/modules/appointment/appointment.repository';
import { ProviderAvailabilityRepository } from 'src/modules/provider-availability/provider-availability.repository';
import { ServiceRepository } from 'src/modules/service/service.repository';
import { ServiceProviderRepository } from 'src/modules/service-provider/service-provider.repository';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot(typeOrmConfig),
    TypeOrmModule.forFeature([
      User,
      ServiceProvider,
      Service,
      ProviderAvailability,
      Appointment,
      Notification,
    ]),
  ],
  providers: [
    UsersRepository,
    ServiceProviderRepository,
    ServiceRepository,
    ProviderAvailabilityRepository,
    AppointmentRepository,
    NotificationRepository,
    UserSeeder,
    ServiceProviderSeeder,
    ServiceSeeder,
    ProviderAvailabilitySeeder,
    AppointmentSeeder,
    NotificationSeeder,
  ],
})
export class SeederModule {}
