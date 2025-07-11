import { Injectable } from '@nestjs/common';
import { Seeder } from 'nestjs-seeder';
import { Faker, vi } from '@faker-js/faker';
import { Notification } from 'src/entities/notification/notification.entity';
import { NotificationType, NotificationStatus } from 'src/common/enums';
import { AppointmentRepository } from 'src/modules/appointment/appointment.repository';
import { NotificationRepository } from 'src/modules/notification/notification.repository';

const faker = new Faker({ locale: vi });

@Injectable()
export class NotificationSeeder implements Seeder {
  constructor(
    private readonly appointmentRepository: AppointmentRepository,
    private readonly notificationRepository: NotificationRepository,
  ) {}

  async seed(): Promise<Notification[]> {
    try {
      await this.drop();
      const appointments = await this.appointmentRepository.find({
        relations: ['customer'],
      });
      if (!appointments.length) {
        throw new Error('No appointments found. Run AppointmentSeeder first.');
      }

      const notifications: Partial<Notification>[] = [];
      for (const appointment of appointments) {
        notifications.push({
          appointment,
          appointment_id: appointment.id,
          user: appointment.customer,
          user_id: appointment.customer.id,
          type: faker.helpers.arrayElement(Object.values(NotificationType)),
          status: faker.helpers.arrayElement(Object.values(NotificationStatus)),
          message: `Thông báo về lịch hẹn #${appointment.id}: ${faker.lorem.sentence()}`,
        });
      }

      const savedNotifications =
        await this.notificationRepository.save(notifications);
      console.log(`Seeded ${savedNotifications.length} notifications`);
      return savedNotifications;
    } catch (error) {
      console.error('Notification seeding failed:', error);
      throw error;
    }
  }

  async drop(): Promise<any> {
    await this.notificationRepository.deleteAll();
  }
}
