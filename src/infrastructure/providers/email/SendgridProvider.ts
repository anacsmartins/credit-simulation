import { injectable } from 'inversify';
import sgMail from '@sendgrid/mail';

@injectable()
export class SendgridProvider {
  constructor() {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY as string);
  }

  public async sendEmail(to: string, subject: string, text: string): Promise<void> {
    const msg = {
      to,
      from: 'email@example.com',
      subject,
      text,
    };

    try {
      //await sgMail.send(msg);
      console.log('E-mail enviado com sucesso!');
    } catch (error) {
      console.error('Erro ao enviar e-mail:', error);
      throw new Error('Erro ao enviar e-mail');
    }
  }
}
