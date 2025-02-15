import nodemailer from 'nodemailer';
import handlebars from 'handlebars';
import fs from 'fs';
import path from 'path';
import { config } from '../config';

class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: config.email.host,
      port: config.email.port,
      secure: true,
      auth: {
        user: config.email.user,
        pass: config.email.password,
      },
    });
  }

  private async getTemplate(templateName: string): Promise<HandlebarsTemplateDelegate> {
    try {
      const templatePath = path.join(__dirname, '../templates/email', `${templateName}.hbs`);
      const template = fs.readFileSync(templatePath, 'utf-8');
      return handlebars.compile(template);
    } catch (error) {
      console.error(`Error loading template ${templateName}:`, error);
      throw new Error(`Email template ${templateName} not found`);
    }
  }

  public async sendQuotationConfirmation(to: string, data: {
    quotationId: string;
    type: string;
    details: any;
    userName: string;
  }): Promise<void> {
    const template = await this.getTemplate('quotation-confirmation');
    const html = template(data);

    await this.transporter.sendMail({
      from: `"Car Grip" <${config.email.user}>`,
      to,
      subject: `Quotation Request Received - ${data.quotationId}`,
      html,
    });
  }

  public async sendQuotationResponse(to: string, data: {
    quotationId: string;
    type: string;
    response: any;
    userName: string;
  }): Promise<void> {
    const template = await this.getTemplate('quotation-response');
    const html = template(data);

    await this.transporter.sendMail({
      from: `"Car Grip" <${config.email.user}>`,
      to,
      subject: `Quotation Response - ${data.quotationId}`,
      html,
    });
  }

  public async sendOrderConfirmation(to: string, data: {
    orderId: string;
    type: string;
    details: any;
    payment: any;
    userName: string;
  }): Promise<void> {
    const template = await this.getTemplate('order-confirmation');
    const html = template(data);

    await this.transporter.sendMail({
      from: `"Car Grip" <${config.email.user}>`,
      to,
      subject: `Order Confirmation - ${data.orderId}`,
      html,
    });
  }

  public async sendShippingUpdate(to: string, data: {
    orderId: string;
    trackingNumber: string;
    status: string;
    estimatedDelivery: string;
    userName: string;
  }): Promise<void> {
    const template = await this.getTemplate('shipping-update');
    const html = template(data);

    await this.transporter.sendMail({
      from: `"Car Grip" <${config.email.user}>`,
      to,
      subject: `Shipping Update - Order ${data.orderId}`,
      html,
    });
  }

  public async sendDeliveryConfirmation(to: string, data: {
    orderId: string;
    deliveryDate: string;
    userName: string;
  }): Promise<void> {
    const template = await this.getTemplate('delivery-confirmation');
    const html = template(data);

    await this.transporter.sendMail({
      from: `"Car Grip" <${config.email.user}>`,
      to,
      subject: `Delivery Confirmation - Order ${data.orderId}`,
      html,
    });
  }

  public async sendEmail(to: string, subject: string, template: string, data: any): Promise<void> {
    try {
      const compiledTemplate = await this.getTemplate(template);
      const html = compiledTemplate(data);

      await this.transporter.sendMail({
        from: `"Car Grip" <${config.email.user}>`,
        to,
        subject,
        html,
      });
    } catch (error) {
      console.error('Error sending email:', error);
      throw new Error('Failed to send email');
    }
  }
}

export const emailService = new EmailService(); 