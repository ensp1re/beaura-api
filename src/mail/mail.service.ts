import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendWelcomeEmail(to: string, subject: string): Promise<{ message: string; success: boolean }> {
    try {
      const email = to;
      const name = subject;
      const currentYear = new Date().getFullYear();
      const dashboardLink = `${process.env.BASE_URL}/dashboard`;
      const companyName = 'Beaura';

      // from is set temporarily to a maileroo email address

      await this.mailerService.sendMail({
        from: 'Beaura <beura@59c458fa25c345ed.maileroo.org>',
        to: email,
        subject: 'Welcome to Beaura',
        template: 'welcome',
        context: {
          name: name,
          currentYear: currentYear,
          dashboardLink: dashboardLink,
          companyName: companyName
        }
      });

      return {
        message: 'Email sent',
        success: true
      };
    } catch (error) {
      console.log('Error sending email', error);
      return {
        message: 'Error sending email',
        success: false
      };
    }
  }

  async sendResetPasswordEmail(email: string, name: string, resetLink: string): Promise<{ message: string; success: boolean }> {
    try {
      const currentYear = new Date().getFullYear();
      const companyName = 'Beaura';

      await this.mailerService.sendMail({
        from: 'Beaura <beura@59c458fa25c345ed.maileroo.org>',
        to: email,
        subject: 'Reset your password',
        template: 'reset-password',
        context: {
          resetLink: resetLink,
          name: name,
          currentYear: currentYear,
          companyName: companyName
        }
      });

      return {
        message: 'Email sent',
        success: true
      };
    } catch (error) {
      console.log('Error sending email', error);
      return {
        message: 'Error sending email',
        success: false
      };
    }
  }

  async sendVerificationEmail(email: string, name: string, verificationLink: string): Promise<{ message: string; success: boolean }> {
    try {
      const currentYear = new Date().getFullYear();
      const companyName = 'Beaura';

      await this.mailerService.sendMail({
        from: 'Beaura <beura@59c458fa25c345ed.maileroo.org>',
        to: email,
        subject: 'Verify your email',
        template: 'verify-email',
        context: {
          verificationLink: verificationLink,
          name: name,
          currentYear: currentYear,
          companyName: companyName
        }
      });

      return {
        message: 'Email sent',
        success: true
      };
    } catch (error) {
      console.log('Error sending email', error);
      return {
        message: 'Error sending email',
        success: false
      };
    }
  }

  async sendGeneralNotificationEmail(
    email: string,
    title: string,
    notificationTitle: string,
    notificationContent: string
  ): Promise<{ message: string; success: boolean }> {
    try {
      const currentYear = new Date().getFullYear();
      const companyName = 'Beaura';

      await this.mailerService.sendMail({
        from: 'Beaura <beura@59c458fa25c345ed.maileroo.org>',
        to: email,
        subject: title,
        template: 'general-notification',
        context: {
          logoUrl: 'https://res.cloudinary.com/dzivbyc4z/image/upload/v1737740103/favicon_zxnv9v.ico',
          title: title,
          notificationTitle: notificationTitle,
          notificationContent: notificationContent,
          currentYear: currentYear,
          companyName: companyName
        }
      });
      return {
        message: 'Email sent',
        success: true
      };
    } catch (error) {
      console.log('Error sending email', error);
      return {
        message: 'Error sending email',
        success: false
      };
    }
  }
}
