/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
    BadGatewayException,
    Body,
    Controller,
    Get,
    NotFoundException,
    Param,
    UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Roles, RolesGuard } from 'src/auth/guards/role.guard';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { Role } from '@auth/interfaces/transformation.interface';

import { UsersService } from './users.service';

@ApiTags('users')
@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @UseGuards(AuthGuard, RolesGuard)
    @Roles(Role.Admin)
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
            const { password, ...data } = user;
            return data;
        } catch (error) {
            throw new BadGatewayException(`getUserById: ${(error as any).message}`);
        }
    }

    @UseGuards(AuthGuard, RolesGuard)
    @Roles(Role.Admin)
    @Get('username/:username')
    @ApiOperation({ summary: 'Get user by username' })
    @ApiResponse({ status: 200, description: 'User found' })
    @ApiResponse({ status: 404, description: 'User not found' })
    @ApiResponse({ status: 502, description: 'Bad Gateway' })
    async getUserByUsername(@Param('username') username: string) {
        try {
            const user = await this.usersService.getUserByUsernameOrEmail(
                username,
                '',
            );
            if (!user) {
                throw new NotFoundException('User not found');
            }
            const { password, ...data } = user;
            return data;
        } catch (error) {
            throw new BadGatewayException(`getUserByUsername: ${(error as any).message}`);
        }
    }

    @UseGuards(AuthGuard, RolesGuard)
    @Roles(Role.Admin)
    @Get('token/:token')
    @ApiOperation({ summary: 'Get user by verification token' })
    @ApiResponse({ status: 200, description: 'User found' })
    @ApiResponse({ status: 404, description: 'User not found' })
    @ApiResponse({ status: 502, description: 'Bad Gateway' })
    async getUserByVerificationToken(@Param('token') token: string) {
        try {
            const user =
                await this.usersService.getUserByEmailVerificationToken(token);
            if (!user) {
                throw new NotFoundException('User not found');
            }
            const { password, ...data } = user;
            return data;
        } catch (error) {
            throw new BadGatewayException(
                `getUserByVerificationToken: ${(error as any).message}`,
            );
        }
    }

    @UseGuards(AuthGuard, RolesGuard)
    @Roles(Role.Admin)
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
            const { password, ...data } = user;
            return data;
        } catch (error) {
            throw new BadGatewayException(`getUserByEmail: ${(error as any).message}`);
        }
    }
}