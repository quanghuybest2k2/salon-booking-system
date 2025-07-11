import { Service } from 'src/entities/service/service.entity';
import { Injectable } from '@nestjs/common';
import { BaseRepository } from 'src/common/repositories/base.repository';
import { DataSource } from 'typeorm';

@Injectable()
export class ServiceRepository extends BaseRepository<Service> {
  constructor(dataSource: DataSource) {
    super(Service, dataSource);
  }
}
