import { PartialType } from '@nestjs/mapped-types';
import { CreateAppointmentDto } from './create-appointment.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateAppointmentDto extends PartialType(CreateAppointmentDto) {
  @ApiPropertyOptional({
    example: '12/07/2025 10:00:00',
    description: 'Thời gian bắt đầu cuộc hẹn (dd/MM/yyyy HH:mm:ss)',
  })
  @IsOptional()
  @IsString()
  start_time?: string;

  @ApiPropertyOptional({
    example: '12/07/2025 11:00:00',
    description: 'Thời gian kết thúc cuộc hẹn (dd/MM/yyyy HH:mm:ss)',
  })
  @IsOptional()
  @IsString()
  end_time?: string;
}
