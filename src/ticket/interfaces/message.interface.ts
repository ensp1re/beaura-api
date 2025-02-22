import { IAuthDocument } from '@auth/interfaces/transformation.interface';
import { Types } from 'mongoose';

export interface IMessage {
  id: Types.ObjectId;
  content: string;
  userId: Types.ObjectId;
  ticketId: Types.ObjectId;
  createdAt: Date;
}

export interface IMessageWithUser extends IMessage {
  user: IAuthDocument;
}

export interface ICreateMessageDto {
  userId: Types.ObjectId;
  content: string;
}
