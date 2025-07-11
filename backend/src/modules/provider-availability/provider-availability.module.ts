import { Module } from '@nestjs/common';
import { ProviderAvailabilityController } from './provider-availability.controller';
import { ProviderAvailabilityService } from './provider-availability.service';
import { ProviderAvailability } from 'src/entities/provider-availability/provider-availability.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProviderAvailabilityRepository } from './provider-availability.repository';

@Module({
  imports: [TypeOrmModule.forFeature([ProviderAvailability])],
  controllers: [ProviderAvailabilityController],
  providers: [ProviderAvailabilityService, ProviderAvailabilityRepository],
  exports: [ProviderAvailabilityRepository],
})
export class ProviderAvailabilityModule {}
