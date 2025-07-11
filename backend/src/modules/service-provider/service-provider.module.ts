import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServiceProvider } from 'src/entities/service-provider/service-provider.entity';
import { ServiceProviderRepository } from './service-provider.repository';

@Module({
  imports: [TypeOrmModule.forFeature([ServiceProvider])],
  controllers: [],
  providers: [ServiceProviderRepository],
  exports: [ServiceProviderRepository],
})
export class ServiceProviderModule {}
