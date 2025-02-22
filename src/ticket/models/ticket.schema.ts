import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

import { TicketStatus } from '../interfaces/ticket.interface';

export type TicketDocument = Ticket &
  Document & {
    createdAt: Date;
    updatedAt: Date;
  };

@Schema({ _id: false })
class Message {
  @Prop({ type: Types.ObjectId, required: true })
  userId: Types.ObjectId | undefined;

  @Prop({ type: String, required: true })
  content: string | undefined;

  @Prop({ type: Date, default: Date.now })
  createdAt: Date | undefined;

  @Prop({ type: Date, default: Date.now })
  updatedAt: Date | undefined;
}

@Schema({ timestamps: true })
export class Ticket extends Document {
  @Prop({ type: String, required: true })
  subject: string | undefined;

  @Prop({ type: String, enum: TicketStatus, default: TicketStatus.OPEN })
  status: TicketStatus | undefined;

  @Prop({ type: Types.ObjectId, required: true, ref: 'User' })
  userId: Types.ObjectId | undefined;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Message' }] })
  messages: Message[] | undefined;
}

export const TicketSchema = SchemaFactory.createForClass(Ticket);
