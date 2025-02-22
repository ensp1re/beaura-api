import { forwardRef, Inject, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { UsersService } from '@auth/users/users.service';
import { IAuthDocument } from '@auth/interfaces/transformation.interface';

import { Ticket, TicketDocument } from './models/ticket.schema';
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
    @InjectModel(Ticket.name)
    private ticketModel: Model<Ticket>
  ) {}

  async createTicket(dto: ICreateTicketDto): Promise<ITicket> {
    const user = await this.usersService.findById(dto.userId as unknown as string);

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
      return this.mapToTicketInterface(savedTicket as unknown as TicketDocument);
    } catch (error) {
      console.error('Error saving ticket:', error);
      throw new InternalServerErrorException('Failed to create ticket');
    }
  }

  async getTickets(status?: TicketStatus): Promise<ITicket[]> {
    try {
      const query = status ? { status } : {};
      const tickets = await this.ticketModel.find(query).sort('-updatedAt').populate('userId');
      return tickets.map((ticket) => this.mapToTicketInterface(ticket as unknown as TicketDocument));
    } catch (error) {
      console.error('Error fetching tickets:', error);
      throw new InternalServerErrorException('Failed to get tickets');
    }
  }

  async getTicketById(id: Types.ObjectId): Promise<ITicket> {
    try {
      const ticket = await this.ticketModel.findById(id).populate('user');
      if (!ticket) {
        throw new NotFoundException(`Ticket with ID ${id} not found`);
      }
      return this.mapToTicketInterface(ticket as unknown as TicketDocument);
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
      const ticket = await this.ticketModel.findById(id).populate('user');

      if (!ticket) {
        throw new NotFoundException(`Ticket with ID ${id} not found`);
      }

      return this.mapToTicketDetailsInterface(ticket as unknown as TicketDocument);
    } catch (error) {
      console.error(`Error fetching ticket details for ID ${id}:`, error);
      throw new InternalServerErrorException('Failed to fetch ticket details');
    }
  }

  async updateTicketStatus(id: Types.ObjectId, dto: IUpdateTicketStatusDto): Promise<ITicket> {
    try {
      const updatedTicket = await this.ticketModel.findByIdAndUpdate(id, { status: dto.status }, { new: true }).populate('userId');

      if (!updatedTicket) {
        throw new NotFoundException(`Ticket with ID ${id} not found`);
      }

      return this.mapToTicketInterface(updatedTicket as unknown as TicketDocument);
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

      await ticket.save();

      return newMessage;
    } catch (error) {
      console.error(`Error adding message to ticket with ID ${ticketId}:`, error);
      throw new InternalServerErrorException('Failed to add message to ticket');
    }
  }

  private mapToTicketInterface(ticket: TicketDocument): ITicket {
    return {
      id: ticket._id as Types.ObjectId,
      subject: ticket.subject || '',
      status: ticket.status || TicketStatus.OPEN,
      userId: ticket.userId ? ticket.userId._id : null,
      messages:
        (ticket.messages ?? []).map((message) => ({
          ...message,
          userId: message.userId as Types.ObjectId,
          content: message.content || '',
          createdAt: message.createdAt || new Date(),
          updatedAt: message.updatedAt || new Date()
        })) || [],
      createdAt: ticket.createdAt,
      updatedAt: ticket.updatedAt
    };
  }

  private mapToTicketDetailsInterface(ticket: TicketDocument): ITicketDetails {
    return {
      ...this.mapToTicketInterface(ticket),
      user: {
        _id: ticket.userId ? (ticket.userId as IAuthDocument)._id : null,
        nickname: ticket.userId ? (ticket.userId as IAuthDocument).nickname : '',
        email: ticket.userId ? (ticket.userId as IAuthDocument).email : ''
      }
    };
  }
}
