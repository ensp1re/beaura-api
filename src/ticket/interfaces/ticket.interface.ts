import { IAuthDocument } from '@auth/interfaces/transformation.interface';
import { Types } from 'mongoose';

export enum TicketStatus {
  OPEN = 'Open',
  IN_PROGRESS = 'In Progress',
  CLOSED = 'Closed'
}

export interface IMessage {
  id?: Types.ObjectId;
  userId: Types.ObjectId;
  content: string;
  createdAt: Date;
}

export interface ITicket {
  id: Types.ObjectId;
  subject: string;
  status: TicketStatus;
  userId: Types.ObjectId | null;
  messages: IMessage[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ITicketDetails extends ITicket {
  user: IAuthDocument;
}

export interface ICreateTicketDto {
  email: string | undefined;
  userId?: Types.ObjectId | undefined;
  subject: string | undefined;
  content: string | undefined;
}

export interface IUpdateTicketStatusDto {
  status: TicketStatus | undefined;
}

export interface ICreateMessageDto {
  userId: Types.ObjectId | undefined;
  content: string | undefined;
}
