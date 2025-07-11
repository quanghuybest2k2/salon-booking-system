import { Module } from '@nestjs/common';
import { SendGridMailAdapter } from './types/sendgrid-mail.adapter';
import { SMTPMailAdapter } from '../../modules/mail/types/smtp-mail.adapter';
import { MailController } from './mail.controller';
import { MailService } from './mail.service';
import { ConfigService } from '@nestjs/config';

@Module({
  providers: [
    {
      provide: 'SMTP_MAIL_SERVICE',
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        new SMTPMailAdapter(configService),
    },
    {
      provide: 'SENDGRID_MAIL_SERVICE',
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        new SendGridMailAdapter(configService),
    },
    MailService,
  ],
  exports: ['SMTP_MAIL_SERVICE', 'SENDGRID_MAIL_SERVICE'],
  controllers: [MailController],
})
export class MailModule {}
