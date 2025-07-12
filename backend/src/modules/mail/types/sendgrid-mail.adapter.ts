import { MailService } from './mail.interface';
import * as sgMail from '@sendgrid/mail';
import envConfig from 'src/config/env.config';

export class SendGridMailAdapter implements MailService {
  constructor() {
    sgMail.setApiKey(envConfig.MAIL.SENDGRID_API_KEY);
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
