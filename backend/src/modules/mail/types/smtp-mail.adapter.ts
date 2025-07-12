import { MailService } from './mail.interface';
import * as nodemailer from 'nodemailer';
import envConfig from 'src/config/env.config';

export class SMTPMailAdapter implements MailService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: envConfig.MAIL.MAIL_HOST,
      port: envConfig.MAIL.MAIL_PORT,
      secure: false,
      auth: {
        user: envConfig.MAIL.MAIL_USER,
        pass: envConfig.MAIL.MAIL_PASSWORD,
      },
    });
  }

  async sendMail(to: string, subject: string, content: string): Promise<void> {
    await this.transporter.sendMail({
      from: `"No Reply" <${envConfig.MAIL.MAIL_USER}>`,
      to,
      subject,
      text: content,
    });
  }
}
