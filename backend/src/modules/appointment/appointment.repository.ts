import { Injectable } from '@nestjs/common';
import { BaseRepository } from 'src/common/repositories/base.repository';
import { Appointment } from 'src/entities/appointment/appointment.entity';
import { DataSource } from 'typeorm';

@Injectable()
export class AppointmentRepository extends BaseRepository<Appointment> {
  constructor(dataSource: DataSource) {
    super(Appointment, dataSource);
  }
}
