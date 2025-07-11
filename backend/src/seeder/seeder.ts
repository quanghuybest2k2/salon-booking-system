import { NestFactory } from '@nestjs/core';
import { SeederModule } from './seeder.module';
import { UserSeeder } from './seeds/user.seeder';
import { ServiceProviderSeeder } from './seeds/service-provider.seeder';
import { ServiceSeeder } from './seeds/service.seeder';
import { ProviderAvailabilitySeeder } from './seeds/provider-availability.seeder';
import { AppointmentSeeder } from './seeds/appointment.seeder';
import { NotificationSeeder } from './seeds/notification.seeder';

async function bootstrap() {
  const app = await NestFactory.create(SeederModule);

  try {
    const userSeeder = app.get(UserSeeder);
    await userSeeder.seed();
    console.log('User seeding completed!');

    const serviceProviderSeeder = app.get(ServiceProviderSeeder);
    await serviceProviderSeeder.seed();
    console.log('ServiceProvider seeding completed!');

    const serviceSeeder = app.get(ServiceSeeder);
    await serviceSeeder.seed();
    console.log('Service seeding completed!');

    const providerAvailabilitySeeder = app.get(ProviderAvailabilitySeeder);
    await providerAvailabilitySeeder.seed();
    console.log('ProviderAvailability seeding completed!');

    const appointmentSeeder = app.get(AppointmentSeeder);
    await appointmentSeeder.seed();
    console.log('Appointment seeding completed!');

    const notificationSeeder = app.get(NotificationSeeder);
    await notificationSeeder.seed();
    console.log('Notification seeding completed!');

    console.log('All seeding completed successfully!');
  } catch (error) {
    console.error('Seeding failed:', error);
    throw error;
  } finally {
    await app.close();
  }
}
void bootstrap();
