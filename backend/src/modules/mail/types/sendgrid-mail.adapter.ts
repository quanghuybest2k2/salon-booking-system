import { ConfigService } from '@nestjs/config';
import { MailService } from './mail.interface';
import * as sgMail from '@sendgrid/mail';

export class SendGridMailAdapter implements MailService {
  constructor(private readonly configService: ConfigService) {
    sgMail.setApiKey(this.configService.get<string>('SENDGRID_API_KEY') ?? '');
  }

  async sendMail(to: string, subject: string, content: string): Promise<void> {
    const msg = {
      to,
      from: 'quanghuybest@gmail.com',
      subject,
      text: content,
    };
    await sgMail.send(msg);
  }
}
