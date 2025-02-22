import { IsString, IsEmail, IsBoolean, IsOptional, IsNumber } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiPropertyOptional({ type: String, description: 'Username of the user' })
  @IsString()
  @IsOptional()
  username: string | undefined;

  @ApiPropertyOptional({ type: String, description: 'Email of the user' })
  @IsEmail()
  @IsOptional()
  email: string | undefined;

  @ApiPropertyOptional({ type: String, description: 'Nickname of the user' })
  @IsOptional()
  @IsString()
  nickname?: string;

  @ApiPropertyOptional({ type: Boolean, description: 'Privacy status of the user' })
  @IsOptional()
  @IsBoolean()
  isPrivate?: boolean;

  @ApiPropertyOptional({ type: String, description: 'Profile picture URL of the user' })
  @IsOptional()
  @IsString()
  profilePicture?: string;

  @ApiPropertyOptional({ type: String, description: 'Bio of the user' })
  @IsOptional()
  @IsString()
  bio?: string;

  @ApiPropertyOptional({ type: Number, description: 'Credit balance of the user' })
  @IsOptional()
  @IsNumber()
  creditBalance?: number;

  @ApiPropertyOptional({ type: Boolean, description: 'Notification enabled status' })
  @IsOptional()
  @IsBoolean()
  isNotificationEnabled?: boolean;

  @ApiPropertyOptional({ type: String, description: 'Status of the user' })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiPropertyOptional({ type: Boolean, description: 'Email verified status of the user' })
  @IsOptional()
  @IsBoolean()
  emailVerified?: boolean;

  @ApiPropertyOptional({ type: String, description: 'Role of the user' })
  @IsOptional()
  @IsString()
  role?: string;
}
