import { UsersModule } from './modules/users/users.module';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { typeOrmConfig } from './config/typeorm.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './modules/auth/auth.module';
import { GuardModule } from './guard/guard.module';
import { MailModule } from './modules/mail/mail.module';
import { LoggerModule } from './logger';
import { AppointmentModule } from './modules/appointment/appointment.module';
import { ProviderAvailabilityModule } from './modules/provider-availability/provider-availability.module';
import { ServiceModule } from './modules/service/service.module';
import { ServiceProviderModule } from './modules/service-provider/service-provider.module';
import { NotificationModule } from './modules/notification/notification.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot(typeOrmConfig),
    UsersModule,
    AuthModule,
    GuardModule,
    MailModule,
    LoggerModule,
    AppointmentModule,
    ProviderAvailabilityModule,
    ServiceModule,
    ServiceProviderModule,
    NotificationModule,
  ],
})
export class AppModule {}
