import {bind, BindingScope} from '@loopback/core';
import {createTransport, SentMessageInfo} from 'nodemailer';
import {EmailTemplate} from '../models';

@bind({scope: BindingScope.TRANSIENT})
export class EmailService {
  private static async setupTransporter() {
    return createTransport({
      host: process.env.MAIL_HOST!,
      port: +process.env.MAIL_PORT!,
      secure: false, // upgrade later with STARTTLS
      auth: {
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD,
      },
    });
  }
  async sendResetPasswordMail(
    to: string,
    html?: string,
    text?: string,
  ): Promise<SentMessageInfo> {
    const transporter = await EmailService.setupTransporter();
    const emailTemplate = new EmailTemplate({
      from: process.env.MAIL_PASSWORD,
      to,
      subject: '[Treejer] Email',
      html,
      text,
    });
    return transporter.sendMail(emailTemplate);
  }
}
