import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { Seeder } from 'nestjs-seeder';
import { Faker, vi } from '@faker-js/faker';
import { User } from 'src/entities/user/user.entity';
import { UserRole } from 'src/common/enums';
import { UsersRepository } from 'src/modules/users/users.repository';

const faker = new Faker({ locale: vi });

@Injectable()
export class UserSeeder implements Seeder {
  constructor(private readonly userRepository: UsersRepository) {}

  async seed(): Promise<User[]> {
    await this.drop(); // Ensure the database is clean before seeding
    const password = await bcrypt.hash('123456', 10);
    const users: Partial<User>[] = [
      {
        id: 1,
        username: 'admin',
        email: 'admin@gmail.com',
        password,
        full_name: faker.name.fullName(),
        phone_number: this.generateVietnamMobileNumber(),
        role: UserRole.ADMIN,
      },
      {
        id: 2,
        username: 'customer',
        email: 'customer@gmail.com',
        password,
        full_name: faker.name.fullName(),
        phone_number: this.generateVietnamMobileNumber(),
        role: UserRole.CUSTOMER,
      },
      {
        id: 3,
        username: 'provider',
        email: 'provider@gmail.com',
        password,
        full_name: faker.name.fullName(),
        phone_number: this.generateVietnamMobileNumber(),
        role: UserRole.PROVIDER,
      },
    ];

    return this.userRepository.save(users);
  }

  generateVietnamMobileNumber(): string {
    const mobilePrefixes = [
      '032', // Viettel
      '033', // Viettel
      '034', // Viettel
      '035', // Viettel
      '036', // Viettel
      '037', // Viettel
      '038', // Viettel
      '039', // Viettel
      '070', // Mobifone
      '076', // Mobifone
      '077', // Mobifone
      '078', // Mobifone
      '079', // Mobifone
      '081', // Vinaphone
      '082', // Vinaphone
      '083', // Vinaphone
      '084', // Vinaphone
      '085', // Vinaphone
    ];
    const prefix = faker.helpers.arrayElement(mobilePrefixes);
    const lineNumber = faker.string.numeric(7); // 7 số sau
    return `0${prefix}${lineNumber}`; // Example: 0321234567
  }

  async drop(): Promise<any> {
    await this.userRepository.deleteAll();
  }
}
