import { MailerOptions } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { join } from 'path';

export const mailConfig: MailerOptions = {
    transport: {
        host: process.env.MAIL_HOST || 'smtp.maileroo.com',
        port: parseInt(process.env.MAIL_PORT!, 10) || 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.MAIL_USER! || 'beura@59c458fa25c345ed.maileroo.org',
            pass: process.env.MAIL_PASS! || 'efd8ef15f6c4f9d9920f9ea0',
        },
    },
    defaults: {
        from: '"No Reply" <no-reply@example.com>',
    },
    template: {
        dir: join(__dirname, '../templates'),
        adapter: new HandlebarsAdapter(),
        options: {
            strict: true,
        },
    },
    options: {
        onError: (err: Error, info: any) => {
            console.error('Error occurred while sending email:', err);
            console.info('Error info:', info);
        },
    },
};
