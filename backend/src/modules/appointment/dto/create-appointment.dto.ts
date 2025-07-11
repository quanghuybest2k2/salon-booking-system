import { IsInt, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateAppointmentDto {
  @ApiProperty({ example: 1, description: 'ID của khách hàng' })
  @IsInt()
  customer_id: number;

  @ApiProperty({ example: 2, description: 'ID của dịch vụ' })
  @IsInt()
  service_id: number;

  @ApiProperty({ example: 3, description: 'ID của nhân viên cung cấp dịch vụ' })
  @IsInt()
  provider_id: number;

  @ApiProperty({
    example: '12/07/2025 10:00:00',
    description: 'Thời gian bắt đầu cuộc hẹn (dd/MM/yyyy HH:mm:ss)',
  })
  @IsString()
  start_time: string;

  @ApiProperty({
    example: '12/07/2025 11:00:00',
    description: 'Thời gian kết thúc cuộc hẹn (dd/MM/yyyy HH:mm:ss)',
  })
  @IsString()
  end_time: string;

  @ApiPropertyOptional({
    example: 'Khám tổng quát',
    description: 'Ghi chú thêm',
  })
  @IsOptional()
  @IsString()
  notes?: string;
}
