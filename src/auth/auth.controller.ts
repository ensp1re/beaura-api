import {
    Body,
    Controller,
    Get,
    HttpCode,
    Post,
    Req,
    Res,
    ValidationPipe,
    UseGuards,
    UsePipes,
    NotFoundException,
    Put,
    Query,
    Delete,
    BadRequestException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from './guards/auth.guard';
import {
    AuthLoginDto,
    AuthSignUpDto,
    ChangePasswordDto,
    ForgotPasswordDto,
    ResetPasswordDto,
} from './dto/auth.dto';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { firebaseAdmin } from 'src/config/firebase.config';
import { DecodedIdToken } from 'firebase-admin/lib/auth/token-verifier';
import { ApiCookieAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';


@ApiTags('auth')
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }


    @Post('google-login')
    @ApiOperation({ summary: 'Google Auth' })
    @ApiResponse({ status: 200, description: 'Google Auth' })
    async googleAuth(@Body('idToken') idToken: string) {
        try {
            const decodedToken: DecodedIdToken = await firebaseAdmin
                .auth()
                .verifyIdToken(idToken);

            return decodedToken;
        } catch (error) {
            if (error instanceof Error) {
                throw new BadRequestException(error.message);
            }
            throw new BadRequestException('An unknown error occurred');
        }
    }

    @UsePipes(new ValidationPipe())
    @HttpCode(StatusCodes.OK)
    @Post('register')
    @ApiOperation({ summary: 'Register' })
    @ApiResponse({ status: 200, description: 'Register' })
    async register(
        @Body() dto: AuthSignUpDto,
        @Res({ passthrough: true }) res: Response,
    ): Promise<any> {
        try {

            console.log('dto', dto);
            const { refreshToken, ...data } = await this.authService.register(dto);


            console.log('data', data);

            this.authService.addRefreshTokenToResponse(res, refreshToken!);

            return data;
        } catch (error) {
            if (error instanceof Error) {
                throw new NotFoundException(error.message);
            }
            throw new NotFoundException('An unknown error occurred');
        }
    }

    @UsePipes(new ValidationPipe())
    @HttpCode(StatusCodes.OK)
    @Post('login')
    @ApiOperation({ summary: 'Login' })
    @ApiResponse({ status: 200, description: 'Login' })
    async login(
        @Body() dto: AuthLoginDto,
        @Res({ passthrough: true }) res: Response,
    ): Promise<any> {
        const { refreshToken, ...data } = await this.authService.login(dto);
        if (!data) {
            throw new NotFoundException('Something went wrong');
        }

        console.log('data', refreshToken);

        this.authService.addRefreshTokenToResponse(res, refreshToken!);

        return data;
    }

    @UsePipes(new ValidationPipe())
    @HttpCode(StatusCodes.OK)
    @Post('logout')
    @ApiOperation({ summary: 'Logout' })
    @ApiResponse({ status: 200, description: 'Logout' })
    async logout(
        @Res({ passthrough: true }) res: Response,
    ): Promise<{ message: string; result: boolean }> {
        const result = this.authService.removeRefreshTokenFromResponse(res);
        return result;
    }

    @UsePipes(new ValidationPipe())
    @HttpCode(StatusCodes.OK)
    @Post('login/access-token')
    @ApiOperation({ summary: 'Access Token' })
    @ApiResponse({ status: 200, description: 'Access Token' })
    async getNewTokens(
        @Req() req: Request,
        @Res({ passthrough: true }) res: Response,
    ) {
        const refreshTOenFromCookie =
            req.cookies[this.authService.REFRESH_TOKEN_NAME];

        if (!refreshTOenFromCookie) {
            this.authService.removeRefreshTokenFromResponse(res);
            throw new NotFoundException('Refresh token not found');
        }

        const { refreshToken, ...data } = await this.authService.getNewTokens(
            refreshTOenFromCookie,
        );

        this.authService.addRefreshTokenToResponse(res, refreshToken);

        return data;
    }

    @UsePipes(new ValidationPipe())
    @HttpCode(StatusCodes.OK)
    @Put('verify-email')
    @ApiOperation({ summary: 'Verify Email' })
    @ApiResponse({ status: 200, description: 'Verify Email' })
    async verifyEmail(
        @Query('token') emailVerificationToken: string,
        @Res() res: Response,
    ) {
        try {
            await this.authService.verifyEmail(emailVerificationToken);

            res.status(StatusCodes.OK).send('Email verified');
        } catch (error) {
            if (error instanceof Error) {
                throw new NotFoundException('verifyEmail error: ' + error.message);
            }
            throw new NotFoundException('An unknown error occurred');
        }
    }

    @UsePipes(new ValidationPipe())
    @HttpCode(StatusCodes.OK)
    @Put('resend-email')
    @ApiOperation({ summary: 'Resend Email' })
    @ApiResponse({ status: 200, description: 'Resend Email' })
    async resendEmail(@Body() data: ForgotPasswordDto, @Res() res: Response) {
        try {
            const { email } = data;

            await this.authService.redendEmailVerificationToken(email);

            res.status(StatusCodes.OK).send('Email sent');
        } catch (error) {
            if (error instanceof Error) {
                throw new NotFoundException('resendEmail error: ' + error.message);
            }
            throw new NotFoundException('An unknown error occurred');
        }
    }

    @UsePipes(new ValidationPipe())
    @HttpCode(StatusCodes.OK)
    @Put('forgot-password')
    @ApiOperation({ summary: 'Forgot Password' })
    @ApiResponse({ status: 200, description: 'Forgot Password' })
    async forgotPassword(@Body() data: ForgotPasswordDto, @Res() res: Response) {
        try {
            const { email } = data;

            const response = await this.authService.forgotPassword(email);

            // delete after testing
            res.status(StatusCodes.OK).send({
                message: 'Password reset token sent',
                response,
            });
        } catch (error) {
            if (error instanceof Error) {
                throw new NotFoundException('forgotPassword error: ' + error.message);
            }
            throw new NotFoundException('An unknown error occurred');
        }
    }

    @UsePipes(new ValidationPipe())
    @HttpCode(StatusCodes.OK)
    @Put('reset-password')
    @ApiOperation({ summary: 'Reset Password' })
    @ApiResponse({ status: 200, description: 'Reset Password' })
    async resetPassword(
        @Body() data: ResetPasswordDto,
        @Query('token') token: string,
        @Res() res: Response,
    ): Promise<Response> {
        try {
            const { password, confirmPassword } = data;

            if (password !== confirmPassword) {
                throw new NotFoundException('Passwords do not match');
            }

            await this.authService.resetPassword(token, password);

            return res.status(StatusCodes.OK).send({ message: 'Password reset' });
        } catch (error) {
            if (error instanceof Error) {
                throw new NotFoundException('resetPassword error: ' + error.message);
            }
            throw new NotFoundException('An unknown error occurred');
        }
    }

    @UseGuards(AuthGuard)
    @UsePipes(new ValidationPipe())
    @HttpCode(StatusCodes.OK)
    @Put('change-password')
    @ApiOperation({ summary: 'Change Password' })
    @ApiResponse({ status: 200, description: 'Change Password' })
    async changePassword(
        @Body() data: ChangePasswordDto,
        @Req() req: Request,
        @Res() res: Response,
    ): Promise<Response> {
        try {
            const { oldPassword, newPassword } = data;

            await this.authService.changePassword(
                `${req.currentUser?.id}`,
                oldPassword,
                newPassword,
            );

            return res.status(StatusCodes.OK).send({ message: 'Password changed' });
        } catch (error) {
            if (error instanceof Error) {
                throw new NotFoundException('changePassword error: ' + error.message);
            }
            throw new NotFoundException('An unknown error occurred');
        }
    }

    @UseGuards(AuthGuard)
    @UsePipes(new ValidationPipe())
    @HttpCode(StatusCodes.OK)
    @Delete('delete-account')
    @ApiOperation({ summary: 'Delete Account' })
    @ApiResponse({ status: 200, description: 'Delete Account' })
    async deleteAccount(@Req() req: Request, @Res() res: Response) {
        try {
            await this.authService.deleteAccount(`${req.currentUser?.id}`);

            return res.status(StatusCodes.OK).send({ message: 'Account deleted' });
        } catch (error) {
            if (error instanceof Error) {
                throw new NotFoundException('deleteAccount error: ' + error.message);
            }
            throw new NotFoundException('An unknown error occurred');
        }
    }

    @Get('profile')
    @ApiOperation({ summary: 'Profile' })
    @ApiResponse({ status: 200, description: 'Profile' })
    getProfiles(@Req() req: Request) {
        return req.headers.authorization;
    }

    @Get('health')
    @HttpCode(StatusCodes.OK)
    @ApiOperation({ summary: 'Health Check' })
    @ApiResponse({ status: 200, description: 'Health Check' })
    healthCheck() {
        return {
            status: 'ok',
        };
    }

    @UseGuards(AuthGuard)
    @HttpCode(StatusCodes.OK)
    @Get('current-user')
    @ApiCookieAuth('refreshToken')
    @ApiOperation({ summary: 'Current User' })
    @ApiResponse({ status: 200, description: 'Current User' })
    getProfile(@Req() req: Request) {
        return {
            data: req.currentUser,
        };
    }
}
