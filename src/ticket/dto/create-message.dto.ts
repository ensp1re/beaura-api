import { IsString, IsNotEmpty, MinLength, IsMongoId } from 'class-validator';
import { Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

import { ICreateMessageDto } from '../interfaces/ticket.interface';

export class CreateMessageDto implements ICreateMessageDto {
  @ApiProperty({
    description: 'The ID of the user creating the message',
    example: '60d0fe4f5311236168a109ca'
  })
  @IsMongoId()
  @IsNotEmpty()
  userId: Types.ObjectId | undefined;

  @ApiProperty({
    description: 'The content of the message',
    minLength: 1,
    example: 'This is a sample message content'
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  content: string | undefined;
}
