import { Body, Controller, Post } from '@nestjs/common';
import { MailService } from './mail.service';
import { SendMailDto } from './dto/mail.dto';

@Controller('mail')
export class MailController {
    constructor(private readonly mailService: MailService) {
    }

    @Post('welcome')
    async sendEmail(@Body() sendMailDto: SendMailDto) {
        const { to, subject } = sendMailDto;
        const response = await this.mailService.sendWelcomeEmail(to, subject);
        return response;
    }
}
