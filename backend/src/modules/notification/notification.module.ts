import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notification } from 'src/entities/notification/notification.entity';
import { NotificationRepository } from './notification.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Notification])],
  controllers: [],
  providers: [NotificationRepository],
  exports: [NotificationRepository],
})
export class NotificationModule {}
