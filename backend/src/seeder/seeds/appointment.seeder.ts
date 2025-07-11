import { Injectable } from '@nestjs/common';
import { Seeder } from 'nestjs-seeder';
import { Faker, vi } from '@faker-js/faker';
import { Appointment } from 'src/entities/appointment/appointment.entity';
import { UsersRepository } from 'src/modules/users/users.repository';
import { UserRole, AppointmentStatus } from 'src/common/enums';
import { ServiceRepository } from 'src/modules/service/service.repository';
import { ServiceProviderRepository } from 'src/modules/service-provider/service-provider.repository';
import { AppointmentRepository } from 'src/modules/appointment/appointment.repository';

const faker = new Faker({ locale: vi });

@Injectable()
export class AppointmentSeeder implements Seeder {
  constructor(
    private readonly userRepository: UsersRepository,
    private readonly serviceRepository: ServiceRepository,
    private readonly serviceProviderRepository: ServiceProviderRepository,
    private readonly appointmentRepository: AppointmentRepository,
  ) {}

  async seed(): Promise<Appointment[]> {
    try {
      await this.drop();
      const customers = await this.userRepository.find({
        where: { role: UserRole.CUSTOMER },
      });
      const services = await this.serviceRepository.find({
        relations: ['provider'],
      });
      if (!customers.length || !services.length) {
        throw new Error(
          'No customers or services found. Run UserSeeder and ServiceSeeder first.',
        );
      }

      const appointments: Partial<Appointment>[] = [];
      for (let i = 0; i < 5; i++) {
        const customer = faker.helpers.arrayElement(customers);
        const service = faker.helpers.arrayElement(services);
        const startTime = faker.date.soon(7);
        const endTime = new Date(
          startTime.getTime() + service.duration_minutes * 60 * 1000,
        );
        appointments.push({
          customer,
          customer_id: customer.id,
          service,
          service_id: service.id,
          provider: service.provider,
          provider_id: service.provider.id,
          start_time: startTime,
          end_time: endTime,
          status: faker.helpers.arrayElement(Object.values(AppointmentStatus)),
          notes: faker.lorem.sentence(),
        });
      }

      const savedAppointments =
        await this.appointmentRepository.save(appointments);
      console.log(`Seeded ${savedAppointments.length} appointments`);
      return savedAppointments;
    } catch (error) {
      console.error('Appointment seeding failed:', error);
      throw error;
    }
  }

  async drop(): Promise<any> {
    await this.appointmentRepository.deleteAll();
  }
}
