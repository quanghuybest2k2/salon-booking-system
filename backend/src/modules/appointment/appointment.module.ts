import { Module } from '@nestjs/common';
import { AppointmentController } from './appointment.controller';
import { AppointmentService } from './appointment.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Appointment } from 'src/entities/appointment/appointment.entity';
import { AppointmentRepository } from './appointment.repository';
import { ProviderAvailabilityRepository } from '../provider-availability/provider-availability.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Appointment])],
  controllers: [AppointmentController],
  providers: [
    AppointmentService,
    AppointmentRepository,
    ProviderAvailabilityRepository,
  ],
})
export class AppointmentModule {}
