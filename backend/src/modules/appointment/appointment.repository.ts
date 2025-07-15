import { Injectable } from '@nestjs/common';
import { BaseRepository } from 'src/common/repositories/base.repository';
import { Appointment } from 'src/entities/appointment/appointment.entity';
import { DataSource, LessThan, MoreThan, Not } from 'typeorm';

@Injectable()
export class AppointmentRepository extends BaseRepository<Appointment> {
  constructor(dataSource: DataSource) {
    super(Appointment, dataSource);
  }

  /**
   * Checks if there is any time conflict with existing appointments
   * for the same provider. Returns true if a conflict exists.
   *
   * @param provider_id - ID of the provider
   * @param start_time - Proposed appointment start time
   * @param end_time - Proposed appointment end time
   * @param excludeAppointmentId - Optional: appointment ID to exclude (for updates)
   * @returns boolean - true if conflict exists, false otherwise
   */
  async hasTimeConflict(
    provider_id: number,
    start_time: Date,
    end_time: Date,
    excludeAppointmentId?: number,
  ): Promise<boolean> {
    const conflict = await this.findOneWithOptions({
      where: {
        provider_id,
        start_time: LessThan(end_time),
        end_time: MoreThan(start_time),
        ...(excludeAppointmentId && { id: Not(excludeAppointmentId) }),
      },
    });

    return !!conflict;
  }
}
