import { Module } from '@nestjs/common';
import { SendGridMailAdapter } from './types/sendgrid-mail.adapter';
import { SMTPMailAdapter } from './types/smtp-mail.adapter';
import { MailController } from './mail.controller';
import { MailService } from './mail.service';

@Module({
  providers: [
    {
      provide: 'SMTP_MAIL_SERVICE',
      useClass: SMTPMailAdapter,
    },
    {
      provide: 'SENDGRID_MAIL_SERVICE',
      useClass: SendGridMailAdapter,
    },
    MailService,
  ],
  exports: ['SMTP_MAIL_SERVICE', 'SENDGRID_MAIL_SERVICE'],
  controllers: [MailController],
})
export class MailModule {}
