import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { AppointmentRepository } from './appointment.repository';
import { Appointment } from 'src/entities/appointment/appointment.entity';
import { LessThan, MoreThan, Not } from 'typeorm';
import * as dayjs from 'dayjs';
import * as customParseFormat from 'dayjs/plugin/customParseFormat';
import * as isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
dayjs.extend(customParseFormat);
dayjs.extend(isSameOrAfter);
import { ProviderAvailabilityRepository } from '../provider-availability/provider-availability.repository';
import { getDayOfWeekFromDate } from 'src/utils/day-of-week.utils';
import { Mapper, MapperArray } from 'src/utils/mapper';

@Injectable()
export class AppointmentService {
  constructor(
    private readonly appointmentRepo: AppointmentRepository,
    private readonly providerAvailabilityRepository: ProviderAvailabilityRepository,
  ) {}

  async create(dto: CreateAppointmentDto): Promise<Appointment> {
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

  async findAll(): Promise<Appointment[]> {
    const appointments = await this.appointmentRepo.findAll();
    return MapperArray(Appointment, appointments);
  }

  async findOne(id: number): Promise<Appointment> {
    const appointment = await this.appointmentRepo.findById(id, {
      relations: ['customer', 'service', 'provider'],
    });

    if (!appointment) {
      throw new NotFoundException(`Appointment with ID ${id} not found`);
    }

    return Mapper(Appointment, appointment);
  }

  async update(id: number, dto: UpdateAppointmentDto): Promise<Appointment> {
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
    const conflict = await this.appointmentRepo.findOneWithOptions({
      where: {
        provider_id,
        start_time: LessThan(end_time),
        end_time: MoreThan(start_time),
        ...(appointmentIdToExclude && {
          id: Not(appointmentIdToExclude),
        }),
      },
    });

    if (conflict) {
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
