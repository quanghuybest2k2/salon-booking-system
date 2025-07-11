import { MailService } from './mail.interface';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';

export class SMTPMailAdapter implements MailService {
  private transporter;

  constructor(private readonly configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get<string>('MAIL_HOST'),
      port: this.configService.get<number>('MAIL_PORT'),
      secure: false,
      auth: {
        user: this.configService.get<string>('MAIL_USER'),
        pass: this.configService.get<string>('MAIL_PASSWORD'),
      },
    });
  }

  async sendMail(to: string, subject: string, content: string): Promise<void> {
    await this.transporter.sendMail({
      from: `"No Reply" <${this.configService.get<string>('SMTP_USER')}>`,
      to,
      subject,
      text: content,
    });
  }
}
