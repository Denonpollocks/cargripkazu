"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.emailService = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const handlebars_1 = __importDefault(require("handlebars"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const config_1 = require("../config");
class EmailService {
    constructor() {
        this.transporter = nodemailer_1.default.createTransport({
            host: config_1.config.email.host,
            port: config_1.config.email.port,
            secure: true,
            auth: {
                user: config_1.config.email.user,
                pass: config_1.config.email.password,
            },
        });
    }
    async getTemplate(templateName) {
        const templatePath = path_1.default.join(__dirname, '../templates/email', `${templateName}.hbs`);
        const template = fs_1.default.readFileSync(templatePath, 'utf-8');
        return handlebars_1.default.compile(template);
    }
    async sendQuotationConfirmation(to, data) {
        const template = await this.getTemplate('quotation-confirmation');
        const html = template(data);
        await this.transporter.sendMail({
            from: `"Car Grip" <${config_1.config.email.user}>`,
            to,
            subject: `Quotation Request Received - ${data.quotationId}`,
            html,
        });
    }
    async sendQuotationResponse(to, data) {
        const template = await this.getTemplate('quotation-response');
        const html = template(data);
        await this.transporter.sendMail({
            from: `"Car Grip" <${config_1.config.email.user}>`,
            to,
            subject: `Quotation Response - ${data.quotationId}`,
            html,
        });
    }
    async sendOrderConfirmation(to, data) {
        const template = await this.getTemplate('order-confirmation');
        const html = template(data);
        await this.transporter.sendMail({
            from: `"Car Grip" <${config_1.config.email.user}>`,
            to,
            subject: `Order Confirmation - ${data.orderId}`,
            html,
        });
    }
    async sendShippingUpdate(to, data) {
        const template = await this.getTemplate('shipping-update');
        const html = template(data);
        await this.transporter.sendMail({
            from: `"Car Grip" <${config_1.config.email.user}>`,
            to,
            subject: `Shipping Update - Order ${data.orderId}`,
            html,
        });
    }
    async sendDeliveryConfirmation(to, data) {
        const template = await this.getTemplate('delivery-confirmation');
        const html = template(data);
        await this.transporter.sendMail({
            from: `"Car Grip" <${config_1.config.email.user}>`,
            to,
            subject: `Delivery Confirmation - Order ${data.orderId}`,
            html,
        });
    }
}
exports.emailService = new EmailService();
