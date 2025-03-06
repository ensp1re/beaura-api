/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { BadGatewayException, Body, Controller, Get, NotFoundException, Param, Put, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
// import { RolesGuard } from 'src/auth/guards/role.guard';
import { AuthGuard } from 'src/auth/guards/auth.guard';
// import { Role } from '@auth/interfaces/transformation.interface';

import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/users.dto';
import { Roles } from '@auth/auth/guards/role.guard';
import { Role } from '@auth/interfaces/transformation.interface';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(AuthGuard)
  // @Roles(Role.Admin)
  @Get('id/:id')
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiResponse({ status: 200, description: 'User found' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 502, description: 'Bad Gateway' })
  async getUserById(@Param('id') id: string) {
    try {
      const user = await this.usersService.getUserById(id);
      if (!user) {
        throw new NotFoundException('User not found');
      }
      const { password, tickets, ...data } = user;
      return data;
    } catch (error) {
      throw new BadGatewayException(`getUserById: ${(error as any).message}`);
    }
  }

  @UseGuards(AuthGuard)
  // @Roles(Role.Admin)
  @Get('username/:username')
  @ApiOperation({ summary: 'Get user by username' })
  @ApiResponse({ status: 200, description: 'User found' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 502, description: 'Bad Gateway' })
  async getUserByUsername(@Param('username') username: string) {
    try {
      const user = await this.usersService.getUserByUsernameOrEmail(username, '');
      if (!user) {
        throw new NotFoundException('User not found');
      }
      const { password, tickets, ...data } = user;
      return data;
    } catch (error) {
      throw new BadGatewayException(`getUserByUsername: ${(error as any).message}`);
    }
  }

  @UseGuards(AuthGuard)
  // @Roles(Role.Admin)
  @Get('token/:token')
  @ApiOperation({ summary: 'Get user by verification token' })
  @ApiResponse({ status: 200, description: 'User found' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 502, description: 'Bad Gateway' })
  async getUserByVerificationToken(@Param('token') token: string) {
    try {
      const user = await this.usersService.getUserByEmailVerificationToken(token);
      if (!user) {
        throw new NotFoundException('User not found');
      }
      const { password, tickets, ...data } = user;
      return data;
    } catch (error) {
      throw new BadGatewayException(`getUserByVerificationToken: ${(error as any).message}`);
    }
  }

  @UseGuards(AuthGuard)
  // @Roles(Role.Admin)
  @Get('email')
  @ApiOperation({ summary: 'Get user by email' })
  @ApiResponse({ status: 200, description: 'User found' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 502, description: 'Bad Gateway' })
  async getUserByEmail(@Body() dto: { email: string }) {
    try {
      const user = await this.usersService.getUserByEmail(dto.email);
      if (!user) {
        throw new NotFoundException('User not found');
      }
      const { password, tickets, ...data } = user;
      return data;
    } catch (error) {
      throw new BadGatewayException(`getUserByEmail: ${(error as any).message}`);
    }
  }

  @UseGuards(AuthGuard)
  @Put('update/:id')
  @ApiOperation({ summary: 'Update user by ID' })
  @ApiResponse({ status: 200, description: 'User updated' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 502, description: 'Bad Gateway' })
  async updateUserById(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    try {
      const user = await this.usersService.updateUser(id, dto);
      if (!user) {
        throw new NotFoundException('User not found');
      }
      const { password, tickets, ...data } = user;
      return data;
    } catch (error) {
      throw new BadGatewayException(`updateUserById: ${(error as any).message}`);
    }
  }

  @UseGuards(AuthGuard)
  @Roles(Role.Admin)
  @Get('all')
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: 200, description: 'Users found' })
  @ApiResponse({ status: 404, description: 'Users not found' })
  @ApiResponse({ status: 502, description: 'Bad Gateway' })
  async getAllUsers() {
    try {
      const users = await this.usersService.getAllUsers();
      if (!users) {
        throw new NotFoundException('Users not found');
      }
      return users.map(({ password, ...data }) => data);
    } catch (error) {
      throw new BadGatewayException(`getAllUsers: ${(error as any).message}`);
    }
  }
}
