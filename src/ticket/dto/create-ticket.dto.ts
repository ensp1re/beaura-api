import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

import { ICreateTicketDto } from '../interfaces/ticket.interface';

export class CreateTicketDto implements ICreateTicketDto {
  @ApiProperty({
    description: 'The ID of the user creating the ticket',
    type: String,
    example: '60d0fe4f5311236168a109ca'
  })
  @IsEmail()
  @IsNotEmpty()
  email: string | undefined;

  @ApiProperty({
    description: 'The subject of the ticket',
    minLength: 3,
    example: 'Issue with login'
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  subject: string | undefined;

  @ApiProperty({
    description: 'The content of the ticket',
    minLength: 10,
    example: 'I am unable to login with my credentials. Please assist.'
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  content: string | undefined;
}
