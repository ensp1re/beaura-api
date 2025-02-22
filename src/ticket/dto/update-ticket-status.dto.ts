import { IsEnum, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

import { IUpdateTicketStatusDto, TicketStatus } from '../interfaces/ticket.interface';

export class UpdateTicketStatusDto implements IUpdateTicketStatusDto {
  @ApiProperty({
    enum: TicketStatus,
    description: 'The status of the ticket',
    example: TicketStatus.OPEN
  })
  @IsEnum(TicketStatus)
  @IsNotEmpty()
  status: TicketStatus | undefined;
}
