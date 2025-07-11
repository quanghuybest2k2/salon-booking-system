import { Inject, Injectable } from '@nestjs/common';
import { MailService as MailServiceInterface } from './types/mail.interface';

@Injectable()
export class MailService {
  constructor(
    @Inject('SMTP_MAIL_SERVICE')
    private readonly mailService: MailServiceInterface,
  ) {}

  async SendMailSMTP(email: string) {
    await this.mailService.sendMail(
      email,
      'Welcome!',
      'Thanks for registering!',
    );
  }
}
