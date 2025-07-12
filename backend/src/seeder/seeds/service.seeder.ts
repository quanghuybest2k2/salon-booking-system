import { Injectable } from '@nestjs/common';
import { Seeder } from 'nestjs-seeder';
import { Faker, vi, en } from '@faker-js/faker';
import { Service } from 'src/entities/service/service.entity';
import { ServiceRepository } from 'src/modules/service/service.repository';
import { ServiceProviderRepository } from 'src/modules/service-provider/service-provider.repository';

const faker = new Faker({ locale: [vi, en] });

@Injectable()
export class ServiceSeeder implements Seeder {
  constructor(
    private readonly serviceProviderRepository: ServiceProviderRepository,
    private readonly serviceRepository: ServiceRepository,
  ) {}

  async seed(): Promise<Service[]> {
    try {
      await this.drop();
      const providers = await this.serviceProviderRepository.find();
      if (!providers.length) {
        throw new Error(
          'No service providers found. Run ServiceProviderSeeder first.',
        );
      }

      const services: Partial<Service>[] = [];
      for (const provider of providers) {
        const numServices = faker.number.int({ min: 1, max: 3 });
        for (let i = 0; i < numServices; i++) {
          services.push({
            provider,
            provider_id: provider.id,
            name: faker.commerce.productName(),
            description: faker.lorem.sentence(),
            duration_minutes: faker.number.int({ min: 30, max: 120 }),
            price: parseFloat(
              faker.commerce.price({ min: 50000, max: 500000, dec: 0 }),
            ),
          });
        }
      }

      const savedServices = await this.serviceRepository.save(services);
      console.log(`Seeded ${savedServices.length} services`);
      return savedServices;
    } catch (error) {
      console.error('Service seeding failed:', error);
      throw error;
    }
  }

  async drop(): Promise<any> {
    await this.serviceRepository.deleteAll();
  }
}
