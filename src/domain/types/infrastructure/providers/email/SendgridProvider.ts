import sgMail from '@sendgrid/mail';

export class SendgridProvider {
  private static instance: SendgridProvider;

  private constructor() {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY as string);
  }

  public static getInstance(): SendgridProvider {
    if (!SendgridProvider.instance) {
      SendgridProvider.instance = new SendgridProvider();
    }
    return SendgridProvider.instance;
  }

  public async sendEmail(to: string, subject: string, text: string): Promise<void> {
    const msg = {
      to,
      from: 'your-email@example.com', // Substitua com o seu e-mail
      subject,
      text,
    };

    try {
      await sgMail.send(msg);
      console.log('E-mail enviado com sucesso!');
    } catch (error) {
      console.error('Erro ao enviar e-mail:', error);
      throw new Error('Erro ao enviar e-mail');
    }
  }
}
