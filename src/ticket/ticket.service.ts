import { forwardRef, Inject, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { UsersService } from '@auth/users/users.service';
import { MailService } from '@auth/mail/mail.service';

import { Ticket } from './models/ticket.schema';
import {
  ICreateMessageDto,
  ICreateTicketDto,
  IMessage,
  ITicket,
  ITicketDetails,
  IUpdateTicketStatusDto,
  TicketStatus
} from './interfaces/ticket.interface';

@Injectable()
export class TicketsService {
  constructor(
    @Inject(forwardRef(() => UsersService))
    private usersService: UsersService,
    @Inject(forwardRef(() => MailService))
    private mailService: MailService,
    @InjectModel(Ticket.name)
    private ticketModel: Model<Ticket>
  ) {}

  async createTicket(dto: ICreateTicketDto): Promise<ITicket> {
    const user = await this.usersService.findByEmail(dto.email as unknown as string);

    if (!user) {
      throw new NotFoundException(`User with ID ${dto.userId} not found`);
    }

    const ticket = new this.ticketModel({
      subject: dto.subject,
      status: TicketStatus.OPEN,
      userId: user._id,
      messages: [
        {
          userId: user._id,
          content: dto.content,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ]
    });

    try {
      const savedTicket = await ticket.save();

      const emailData = {
        email: user.email,
        title: 'New Ticket Created',
        notificationTitle: 'New Ticket Created',
        notificationContent: `Your ticket with the subject "${dto.subject}" has been successfully created.`
      };

      const response = await this.mailService.sendGeneralNotificationEmail(
        emailData.email!,
        emailData.title,
        emailData.notificationTitle,
        emailData.notificationContent
      );

      if (!response.success) {
        throw new InternalServerErrorException('Failed to send email notification');
      }

      return savedTicket as unknown as ITicket;
    } catch (error) {
      console.error('Error saving ticket:', error);
      throw new InternalServerErrorException('Failed to create ticket');
    }
  }

  async getTickets(status?: TicketStatus): Promise<ITicket[]> {
    try {
      const query = status ? { status } : {};
      const tickets = await this.ticketModel.find(query).sort('-updatedAt').populate('userId', 'username email profilePicture').exec();

      for (const ticket of tickets) {
        if (!ticket.messages) {
          ticket.messages = [];
        }
        ticket.messages = await Promise.all(
          ticket.messages.map(async (message) => {
            const user = await this.usersService.findById(message.userId as unknown as string);
            return {
              ...message,
              userId: user._id,
              username: user.username,
              email: user.email,
              profilePicture: user.profilePicture
            };
          })
        );
      }

      return tickets as unknown as ITicket[];
    } catch (error) {
      console.error('Error fetching tickets:', error);
      throw new InternalServerErrorException('Failed to get tickets');
    }
  }

  async getTicketById(id: Types.ObjectId): Promise<ITicket> {
    try {
      const ticket = await this.ticketModel.findById(id).lean().populate('userId', 'username email profilePicture').exec();
      if (!ticket) {
        throw new NotFoundException(`Ticket with ID ${id} not found`);
      }

      return ticket as unknown as ITicket;
    } catch (error) {
      console.error(`Error fetching ticket with ID ${id}:`, error);
      throw new InternalServerErrorException('Failed to fetch ticket');
    }
  }

  async deleteTicket(id: Types.ObjectId): Promise<void> {
    try {
      const result = await this.ticketModel.findByIdAndDelete(id);
      if (!result) {
        throw new NotFoundException(`Ticket with ID ${id} not found`);
      }
    } catch (error) {
      console.error(`Error deleting ticket with ID ${id}:`, error);
      throw new InternalServerErrorException('Failed to delete ticket');
    }
  }
  async getTicketDetails(id: Types.ObjectId): Promise<ITicketDetails> {
    try {
      const ticket = await this.ticketModel.findById(id).lean().populate('userId', 'username email profilePicture').exec();

      if (!ticket) {
        throw new NotFoundException(`Ticket with ID ${id} not found`);
      }

      return ticket as unknown as ITicketDetails;
    } catch (error) {
      console.error(`Error fetching ticket details for ID ${id}:`, error);
      throw new InternalServerErrorException('Failed to fetch ticket details');
    }
  }

  async updateTicketStatus(id: Types.ObjectId, dto: IUpdateTicketStatusDto): Promise<ITicket> {
    try {
      const updatedTicket = await this.ticketModel
        .findByIdAndUpdate(id, { status: dto.status }, { new: true })
        .populate('userId', 'username email profilePicture')
        .lean()
        .exec();

      if (!updatedTicket) {
        throw new NotFoundException(`Ticket with ID ${id} not found`);
      }

      return updatedTicket as unknown as ITicket;
    } catch (error) {
      console.error(`Error updating ticket status for ID ${id}:`, error);
      throw new InternalServerErrorException('Failed to update ticket status');
    }
  }

  async addMessage(ticketId: Types.ObjectId, dto: ICreateMessageDto): Promise<IMessage> {
    try {
      const ticket = await this.ticketModel.findById(ticketId);
      if (!ticket) {
        throw new NotFoundException(`Ticket with ID ${ticketId} not found`);
      }

      const user = await this.usersService.findById(dto.userId as unknown as string);
      if (!user) {
        throw new NotFoundException(`User with ID ${dto.userId} not found`);
      }

      const newMessage = {
        userId: user._id,
        content: dto.content || '',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      if (!ticket.messages) {
        ticket.messages = [];
      }
      ticket.messages.push(newMessage);

      const ticketUserFullInfo = await this.usersService.findById(ticket.userId as unknown as string);

      if ((ticket.userId && ticket.userId.toString() !== user._id.toString()) || ticketUserFullInfo.role?.toLowerCase() === 'admin') {
        const emailData = {
          email: user.email,
          title: 'New Ticket Message',
          notificationTitle: 'New Ticket Message',
          notificationContent: `
            You have a new message on your ticket with the subject "${ticket.subject}" (Ticket ID: ${ticket._id}).
            <br><br>
            <strong>Message:</strong><br>
            ${dto.content}
            <br><br>
            Please reply to this email to respond to the message.
          `
        };

        const response = await this.mailService.sendGeneralNotificationEmail(
          emailData.email!,
          emailData.title,
          emailData.notificationTitle,
          emailData.notificationContent
        );

        if (!response.success) {
          throw new InternalServerErrorException('Failed to send email notification');
        }
      }

      await ticket.save();

      return newMessage;
    } catch (error) {
      console.error(`Error adding message to ticket with ID ${ticketId}:`, error);
      throw new InternalServerErrorException('Failed to add message to ticket');
    }
  }
}
