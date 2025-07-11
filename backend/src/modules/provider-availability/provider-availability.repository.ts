import { Injectable } from '@nestjs/common';
import { BaseRepository } from 'src/common/repositories/base.repository';
import { ProviderAvailability } from 'src/entities/provider-availability/provider-availability.entity';
import { DataSource } from 'typeorm';

@Injectable()
export class ProviderAvailabilityRepository extends BaseRepository<ProviderAvailability> {
  constructor(dataSource: DataSource) {
    super(ProviderAvailability, dataSource);
  }
}
