import { Module } from '@nestjs/common';
import { ServiceRepository } from './service.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Service } from 'src/entities/service/service.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Service])],
  controllers: [],
  providers: [ServiceRepository],
  exports: [ServiceRepository],
})
export class ServiceModule {}
