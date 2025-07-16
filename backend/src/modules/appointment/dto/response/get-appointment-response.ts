import { Expose } from 'class-transformer';
import { AppointmentStatus } from 'src/common/enums';

export class GetAppointmentResponse {
  @Expose()
  id: number;

  @Expose()
  customer_id: number;

  @Expose()
  service_id: number;

  @Expose()
  provider_id: number;

  @Expose()
  start_time: Date;

  @Expose()
  end_time: Date;

  @Expose()
  status: AppointmentStatus;

  @Expose()
  notes?: string;

  @Expose()
  created_at: Date;

  @Expose()
  updated_at: Date;
}
