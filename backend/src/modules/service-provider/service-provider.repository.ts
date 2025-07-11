import { Injectable } from '@nestjs/common';
import { BaseRepository } from 'src/common/repositories/base.repository';
import { ServiceProvider } from 'src/entities/service-provider/service-provider.entity';
import { DataSource } from 'typeorm';

@Injectable()
export class ServiceProviderRepository extends BaseRepository<ServiceProvider> {
  constructor(dataSource: DataSource) {
    super(ServiceProvider, dataSource);
  }
}
