import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateAppointmentDto } from './dto/request/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/request/update-appointment.dto';
import { AppointmentRepository } from './appointment.repository';
import { Appointment } from 'src/entities/appointment/appointment.entity';
import * as dayjs from 'dayjs';
import * as customParseFormat from 'dayjs/plugin/customParseFormat';
import * as isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
dayjs.extend(customParseFormat);
dayjs.extend(isSameOrAfter);
import { ProviderAvailabilityRepository } from '../provider-availability/provider-availability.repository';
import { getDayOfWeekFromDate } from 'src/utils/day-of-week.utils';
import { Mapper, MapperArray } from 'src/utils/mapper';
import { SearchAppointmentDto } from './dto/request/search-appointment.dto';
import { paginate, PaginatedResult } from 'src/utils/paginate';
import { LessThanOrEqual, Like, MoreThan } from 'typeorm';
import { SortField, SortOrder } from 'src/common/enums';
import { GetAppointmentResponse } from './dto/response/get-appointment-response';

@Injectable()
export class AppointmentService {
  constructor(
    private readonly appointmentRepo: AppointmentRepository,
    private readonly providerAvailabilityRepository: ProviderAvailabilityRepository,
  ) {}

  async create(dto: CreateAppointmentDto): Promise<GetAppointmentResponse> {
    const start = dayjs(dto.start_time, 'DD/MM/YYYY HH:mm:ss', true);
    const end = dayjs(dto.end_time, 'DD/MM/YYYY HH:mm:ss', true);

    if (!start.isValid() || !end.isValid()) {
      throw new BadRequestException(
        'Thời gian không hợp lệ. Định dạng đúng: dd/MM/yyyy HH:mm:ss',
      );
    }

    if (start.isSameOrAfter(end)) {
      throw new BadRequestException(
        'Thời gian bắt đầu phải nhỏ hơn thời gian kết thúc.',
      );
    }

    // Kiểm tra thời gian có nằm trong khung giờ làm việc của provider
    await this.validateAvailability(
      dto.provider_id,
      start.toDate(),
      end.toDate(),
    );

    // Kiểm tra trùng thời gian với các cuộc hẹn khác
    await this.checkTimeConflict(dto.provider_id, start.toDate(), end.toDate());

    const dtoWithParsedDates = {
      ...dto,
      start_time: start.toDate(),
      end_time: end.toDate(),
    };
    const created = await this.appointmentRepo.createEntity(dtoWithParsedDates);
    return Mapper(Appointment, created);
  }

  async getAppointment(
    dto: SearchAppointmentDto,
  ): Promise<PaginatedResult<GetAppointmentResponse>> {
    const {
      customer_id,
      service_id,
      provider_id,
      start_time_from,
      start_time_to,
      notes,
      pageNumber = 1,
      pageSize = 10,
    } = dto;

    const where = () => ({
      ...(customer_id && { customer_id }),
      ...(service_id && { service_id }),
      ...(provider_id && { provider_id }),
      ...(start_time_from && {
        start_time: MoreThan(new Date(start_time_from)),
      }),
      ...(start_time_to && {
        start_time: LessThanOrEqual(new Date(start_time_to)),
      }),
      ...(notes && { notes: Like(`%${notes}%`) }),
    });

    return paginate<Appointment, GetAppointmentResponse>(
      () =>
        this.appointmentRepo.findAll({
          pageNumber,
          pageSize,
          sortField: SortField.CREATED_AT,
          sortOrder: SortOrder.DESC,
          where,
        }),
      pageSize,
      pageNumber,
    );
  }

  async findOne(id: number): Promise<GetAppointmentResponse> {
    const appointment = await this.appointmentRepo.findById(id, {
      relations: ['customer', 'service', 'provider'],
    });

    if (!appointment) {
      throw new NotFoundException(`Appointment with ID ${id} not found`);
    }

    return Mapper(Appointment, appointment);
  }

  async update(
    id: number,
    dto: UpdateAppointmentDto,
  ): Promise<GetAppointmentResponse> {
    const existing = await this.findOne(id);

    const start = dto.start_time
      ? dayjs(dto.start_time, 'DD/MM/YYYY HH:mm:ss', true)
      : dayjs(existing.start_time);

    const end = dto.end_time
      ? dayjs(dto.end_time, 'DD/MM/YYYY HH:mm:ss', true)
      : dayjs(existing.end_time);

    if (!start.isValid() || !end.isValid()) {
      throw new BadRequestException(
        'Thời gian không hợp lệ. Định dạng đúng: dd/MM/yyyy HH:mm:ss',
      );
    }

    if (start.isSameOrAfter(end)) {
      throw new BadRequestException(
        'Thời gian bắt đầu phải nhỏ hơn thời gian kết thúc.',
      );
    }

    await this.validateAvailability(
      existing.provider_id,
      start.toDate(),
      end.toDate(),
    );

    await this.checkTimeConflict(
      existing.provider_id,
      start.toDate(),
      end.toDate(),
      id,
    );

    const updated = await this.appointmentRepo.updateEntity(id, {
      ...existing,
      ...dto,
      start_time: start.toDate(),
      end_time: end.toDate(),
    });

    if (!updated) {
      throw new NotFoundException(`Appointment with ID ${id} not found`);
    }

    return Mapper(Appointment, updated);
  }

  async remove(id: number): Promise<void> {
    const existing = await this.appointmentRepo.findById(id);
    if (!existing) {
      throw new NotFoundException(`Appointment with ID ${id} not found`);
    }

    await this.appointmentRepo.deleteEntity(id);
  }

  private async checkTimeConflict(
    provider_id: number,
    start_time: Date,
    end_time: Date,
    appointmentIdToExclude?: number, // to exclude current appointment from conflict check
  ): Promise<void> {
    const hasConflict = await this.appointmentRepo.hasTimeConflict(
      provider_id,
      start_time,
      end_time,
      appointmentIdToExclude,
    );

    if (hasConflict) {
      throw new BadRequestException(
        'Thời gian này đã được đặt bởi một cuộc hẹn khác.',
      );
    }
  }

  private async validateAvailability(
    provider_id: number,
    start_time: Date,
    end_time: Date,
  ): Promise<void> {
    const start = dayjs(start_time);
    const end = dayjs(end_time);
    const dayOfWeek = getDayOfWeekFromDate(start.toDate()); // 0 - 6

    const availabilities = await this.providerAvailabilityRepository.find({
      where: { provider_id, day_of_week: dayOfWeek },
    });

    const isWithin = availabilities.some((avail) => {
      const [availStartHour, availStartMin] = avail.start_time
        .split(':')
        .map(Number);
      const [availEndHour, availEndMin] = avail.end_time.split(':').map(Number);

      const availStart = start
        .set('hour', availStartHour)
        .set('minute', availStartMin);
      const availEnd = start
        .set('hour', availEndHour)
        .set('minute', availEndMin);

      return (
        (start.isAfter(availStart) || start.isSame(availStart)) &&
        (end.isBefore(availEnd) || end.isSame(availEnd))
      );
    });

    if (!isWithin) {
      throw new BadRequestException(
        'Thời gian bạn chọn nằm ngoài khung giờ làm việc của nhân viên.',
      );
    }
  }
}
