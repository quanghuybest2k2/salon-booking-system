import { Injectable } from '@nestjs/common';
import { Seeder } from 'nestjs-seeder';
import { Faker, vi } from '@faker-js/faker';
import { ProviderAvailability } from 'src/entities/provider-availability/provider-availability.entity';
import { DayOfWeek } from 'src/common/enums';
import { ServiceProviderRepository } from 'src/modules/service-provider/service-provider.repository';
import { ProviderAvailabilityRepository } from 'src/modules/provider-availability/provider-availability.repository';

const faker = new Faker({ locale: vi });

@Injectable()
export class ProviderAvailabilitySeeder implements Seeder {
  constructor(
    private readonly serviceProviderRepository: ServiceProviderRepository,
    private readonly providerAvailabilityRepository: ProviderAvailabilityRepository,
  ) {}

  async seed(): Promise<ProviderAvailability[]> {
    try {
      await this.drop();
      const providers = await this.serviceProviderRepository.find();
      if (!providers.length) {
        throw new Error(
          'No service providers found. Run ServiceProviderSeeder first.',
        );
      }

      const availabilities: Partial<ProviderAvailability>[] = [];
      for (const provider of providers) {
        const days = Object.values(DayOfWeek);
        const numDays = faker.number.int({ min: 1, max: 5 });
        const selectedDays = faker.helpers.arrayElements(days, numDays);
        for (const day of selectedDays) {
          availabilities.push({
            provider,
            provider_id: provider.id,
            day_of_week: day,
            start_time: '08:00:00',
            end_time: '17:00:00',
          });
        }
      }

      const savedAvailabilities =
        await this.providerAvailabilityRepository.save(availabilities);
      console.log(
        `Seeded ${savedAvailabilities.length} provider availabilities`,
      );
      return savedAvailabilities;
    } catch (error) {
      console.error('ProviderAvailability seeding failed:', error);
      throw error;
    }
  }

  async drop(): Promise<any> {
    await this.providerAvailabilityRepository.deleteAll();
  }
}
