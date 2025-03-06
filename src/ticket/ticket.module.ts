import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from '@auth/users/users.module';
import { AuthModule } from '@auth/auth/auth.module';
import { MailModule } from '@auth/mail/mail.module';

import { TicketsService } from './ticket.service';
import { TicketController } from './ticket.controller';
import { Ticket, TicketSchema } from './models/ticket.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Ticket.name, schema: TicketSchema }]),

    forwardRef(() => UsersModule),
    forwardRef(() => AuthModule),
    forwardRef(() => MailModule)
  ],
  controllers: [TicketController],
  providers: [
    TicketsService,
    {
      provide: 'Model',
      useValue: TicketSchema
    }
  ]
})
export class TicketModule {}
