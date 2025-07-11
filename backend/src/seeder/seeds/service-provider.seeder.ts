import { Injectable } from '@nestjs/common';
import { Seeder } from 'nestjs-seeder';
import { Faker, vi, en } from '@faker-js/faker';
import { ServiceProvider } from 'src/entities/service-provider/service-provider.entity';
import { UsersRepository } from 'src/modules/users/users.repository';
import { UserRole } from 'src/common/enums';
import { ServiceProviderRepository } from 'src/modules/service-provider/service-provider.repository';

const faker = new Faker({ locale: [vi, en] });

@Injectable()
export class ServiceProviderSeeder implements Seeder {
  constructor(
    private readonly userRepository: UsersRepository,
    private readonly serviceProviderRepository: ServiceProviderRepository,
  ) {}

  async seed(): Promise<ServiceProvider[]> {
    try {
      await this.drop();
      const providers = await this.userRepository.find({
        where: { role: UserRole.PROVIDER },
      });
      if (!providers.length) {
        throw new Error(
          'No users with PROVIDER role found. Run UserSeeder first.',
        );
      }

      const serviceProviders: Partial<ServiceProvider>[] = providers.map(
        (user) => ({
          user,
          user_id: user.id,
          business_name: faker.company.name(),
          address: faker.location.streetAddress(),
          description: faker.lorem.paragraph(),
        }),
      );

      const savedProviders =
        await this.serviceProviderRepository.save(serviceProviders);
      console.log(`Seeded ${savedProviders.length} service providers`);
      return savedProviders;
    } catch (error) {
      console.error('ServiceProvider seeding failed:', error);
      throw error;
    }
  }

  async drop(): Promise<any> {
    await this.serviceProviderRepository.deleteAll();
  }
}
