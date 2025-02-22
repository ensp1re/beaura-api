import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  Query,
  ValidationPipe,
  NotFoundException,
  InternalServerErrorException
} from '@nestjs/common';
import { Types } from 'mongoose';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiParam } from '@nestjs/swagger';

import { TicketsService } from './ticket.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { IMessage, ITicket, ITicketDetails, TicketStatus } from './interfaces/ticket.interface';
import { UpdateTicketStatusDto } from './dto/update-ticket-status.dto';
import { CreateMessageDto } from './dto/create-message.dto';

@ApiTags('tickets')
@Controller('tickets')
export class TicketController {
  constructor(private readonly ticketsService: TicketsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new ticket' })
  @ApiResponse({ status: 201, description: 'The ticket has been successfully created.' })
  @ApiResponse({ status: 500, description: 'Failed to create ticket' })
  async createTicket(@Body(ValidationPipe) dto: CreateTicketDto): Promise<ITicket> {
    try {
      const response = await this.ticketsService.createTicket(dto);

      return response;
    } catch {
      throw new InternalServerErrorException('Failed to create ticket');
    }
  }
  @Get()
  @ApiOperation({ summary: 'Get all tickets' })
  @ApiResponse({ status: 200, description: 'Return all tickets.' })
  @ApiResponse({ status: 500, description: 'Failed to get tickets' })
  @ApiQuery({ name: 'status', required: false, enum: TicketStatus })
  async getTickets(@Query('status') status?: TicketStatus): Promise<ITicket[]> {
    try {
      return await this.ticketsService.getTickets(status);
    } catch {
      throw new InternalServerErrorException('Failed to get tickets');
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get ticket details by ID' })
  @ApiResponse({ status: 200, description: 'Return ticket details.' })
  @ApiResponse({ status: 404, description: 'Ticket not found' })
  @ApiResponse({ status: 500, description: 'Failed to get ticket details' })
  async getTicketDetails(@Param('id') id: Types.ObjectId): Promise<ITicketDetails> {
    try {
      const ticketDetails = await this.ticketsService.getTicketDetails(id);
      if (!ticketDetails) {
        throw new NotFoundException('Ticket not found');
      }
      return ticketDetails;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to get ticket details');
    }
  }

  @Put(':id/status')
  @ApiOperation({ summary: 'Update ticket status by ID' })
  @ApiResponse({ status: 200, description: 'The ticket status has been successfully updated.' })
  @ApiResponse({ status: 404, description: 'Ticket not found' })
  @ApiResponse({ status: 500, description: 'Failed to update ticket status' })
  @ApiParam({ name: 'id', type: String })
  async updateStatus(@Param('id') id: Types.ObjectId, @Body(ValidationPipe) dto: UpdateTicketStatusDto): Promise<ITicket> {
    try {
      const updatedTicket = await this.ticketsService.updateTicketStatus(id, dto);
      if (!updatedTicket) {
        throw new NotFoundException('Ticket not found');
      }
      return updatedTicket;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to update ticket status');
    }
  }

  @Post(':id/messages')
  @ApiOperation({ summary: 'Add a message to a ticket by ID' })
  @ApiResponse({ status: 201, description: 'The message has been successfully added.' })
  @ApiResponse({ status: 404, description: 'Ticket not found' })
  @ApiResponse({ status: 500, description: 'Failed to add message' })
  @ApiParam({ name: 'id', type: String })
  async addMessage(@Param('id') ticketId: Types.ObjectId, @Body(ValidationPipe) dto: CreateMessageDto): Promise<IMessage> {
    try {
      const message = await this.ticketsService.addMessage(ticketId, dto);
      if (!message) {
        throw new NotFoundException('Ticket not found');
      }
      return message;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to add message');
    }
  }
}
