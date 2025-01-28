import { Module } from '@nestjs/common';
import { MailController } from './mail.controller';
import { MailService } from './mail.service';
import { ConfigModule } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';
import { mailConfig } from './config/mail.config';

@Module({
  controllers: [MailController],
  providers: [MailService],
  imports: [
    ConfigModule.forRoot(
      {
        isGlobal: true,
        envFilePath: '.env',
      }
    ),
    MailerModule.forRoot(mailConfig),
  ],
  exports: [MailService]
})
export class MailModule { }
