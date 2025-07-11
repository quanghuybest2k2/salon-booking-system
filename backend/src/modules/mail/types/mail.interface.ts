export interface MailService {
  sendMail(to: string, subject: string, content: string): Promise<void>;
}
