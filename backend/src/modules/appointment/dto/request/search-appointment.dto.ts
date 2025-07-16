import { IsOptional, IsString, IsInt } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class SearchAppointmentDto {
  @ApiPropertyOptional({ example: 1, description: 'Lọc theo ID khách hàng' })
  @IsOptional()
  @IsInt()
  customer_id?: number;

  @ApiPropertyOptional({ example: 2, description: 'Lọc theo ID dịch vụ' })
  @IsOptional()
  @IsInt()
  service_id?: number;

  @ApiPropertyOptional({ example: 3, description: 'Lọc theo ID nhân viên' })
  @IsOptional()
  @IsInt()
  provider_id?: number;

  @ApiPropertyOptional({
    example: '12/07/2025 00:00:00',
    description: 'Tìm cuộc hẹn bắt đầu từ thời gian này (start_time >=)',
  })
  @IsOptional()
  @IsString()
  start_time_from?: string;

  @ApiPropertyOptional({
    example: '12/07/2025 23:59:59',
    description: 'Tìm cuộc hẹn bắt đầu trước thời gian này (start_time <=)',
  })
  @IsOptional()
  @IsString()
  start_time_to?: string;

  @ApiPropertyOptional({
    example: 'Khám tổng quát',
    description: 'Tìm kiếm theo ghi chú',
  })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiPropertyOptional({ example: 1, description: 'Số trang' })
  @IsOptional()
  @IsInt()
  pageNumber?: number;

  @ApiPropertyOptional({ example: 10, description: 'Kích thước trang' })
  @IsOptional()
  @IsInt()
  pageSize?: number;
}
