/* eslint-disable @typescript-eslint/no-unused-vars */
import {
    BadRequestException,
    Injectable,
    NotFoundException,
    UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { AuthSignUpDto, AuthLoginDto } from './dto/auth.dto';
import { verify } from 'argon2';
import { Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { UploadApiResponse } from 'cloudinary';
import * as crypto from 'crypto';
import { toLowerCase } from 'src/lib/utils';
import { IAuthDocument, IAuthResponse, IIssueTokensResponse, IPayload } from '@auth/interfaces/transformation.interface';

@Injectable()
/**
 * AuthService handles the authentication logic for the application.
 * It provides methods for user registration, login, token issuance, and token validation.
 *
 * @class AuthService
 *
 * @property {number} EXPIRE_DAY_REFRESH_TOKEN - Number of days before the refresh token expires.
 * @property {string} REFRESH_TOKEN_NAME - Name of the refresh token cookie.
 *
 * @constructor
 * @param {UsersService} usersService - Service for user-related operations.
 * @param {JwtService} jwtService - Service for JWT operations.
 * @param {CloudinaryService} cloudinaryService - Service for Cloudinary operations.
 *
 * @method register - Registers a new user.
 * @param {AuthDto} dto - Data transfer object containing user registration details.
 * @returns {Promise<IAuthResponse>} - Response containing user details and tokens.
 *
 * @method login - Logs in an existing user.
 * @param {AuthDto} dto - Data transfer object containing user login details.
 * @returns {Promise<IAuthResponse>} - Response containing user details and tokens.
 *
 * @method issueTokens - Issues access and refresh tokens.
 * @param {IPayload} payload - Payload containing user details.
 * @returns {IIssueTokensResponse} - Response containing access and refresh tokens.
 *
 * @method validateUser - Validates user credentials.
 * @param {AuthDto} dto - Data transfer object containing user login details.
 * @returns {Promise<IAuthDocument>} - Validated user document.
 *
 * @method addRefreshTokenToResponse - Adds refresh token to the response cookies.
 * @param {Response} res - HTTP response object.
 * @param {string} refreshToken - Refresh token to be added.
 *
 * @method removeRefreshTokenFromResponse - Removes refresh token from the response cookies.
 * @param {Response} res - HTTP response object.
 * @returns {boolean} - Returns true if the refresh token was successfully removed.
 *
 * @method getNewTokens - Issues new access and refresh tokens using a valid refresh token.
 * @param {string} refreshToken - Refresh token used to issue new tokens.
 * @returns {Promise<IAuthResponse>} - Response containing user details and new tokens.
 */
export class AuthService {
    // Removed duplicate getNewTokens method

    EXPIRE_DAY_REFRESH_TOKEN = 1;
    REFRESH_TOKEN_NAME = 'refreshToken';

    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
        private cloudinaryService: CloudinaryService,
    ) { }

    async register(dto: AuthSignUpDto): Promise<IAuthResponse> {
        try {

            console.log(dto, "dto2");
            const existingUser = await this.usersService.getUserByUsernameOrEmail(
                dto.username,
                dto.email,
            );

            console.log(existingUser);

            if (existingUser) {
                throw new BadRequestException('These credentials are already taken');
            }

            const profilePublicId: string = uuidv4();


            console.log(profilePublicId);

            const uploadResult: UploadApiResponse | undefined =
                (await this.cloudinaryService.uploadImage(
                    dto.profilePicture as string,
                    profilePublicId as string,
                    true,
                    true,
                )) as UploadApiResponse;


            console.log(uploadResult);

            if (!uploadResult.public_id) {
                throw new BadRequestException(
                    'Could not upload image to cloudinary. Please try again',
                );
            }

            const randomBytes = await Promise.resolve(crypto.randomBytes(16));
            const randomCharacters = randomBytes.toString('hex');

            const url: string = `${process.env.BASE_URL}/verify-email?token=${randomCharacters}`;

            console.log(url);

            // Example of data
            // dto: {
            //   username: 'JohnDoe',
            //   email: 'johndoe@example.com',
            //   password: 'securePassword123'
            // }
            // uploadResult: {
            //   secure_url: 'https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg',
            //   public_id: 'sample'
            // }
            // randomCharacters: 'a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6'

            const authData: IAuthDocument = {
                username: toLowerCase(dto.username),
                email: toLowerCase(dto.email),
                profilePublicId,
                password: dto.password,
                profilePicture: uploadResult?.secure_url,
                emailVerificationToken: randomCharacters,
            };

            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { password, ...user } =
                await this.usersService.createUser(authData);

            const tokens = this.issueTokens({
                _id: user._id,
                username: user.username!,
                email: user.email!,
                role: user.role!,
            });

            return {
                message: 'User was created',
                user,
                ...tokens,
            };
        } catch (error) {
            if (error instanceof Error) {
                throw new BadRequestException(error.message);
            }
            throw new BadRequestException('An unknown error occurred');
        }
    }

    async redendEmailVerificationToken(email: string): Promise<void> {
        try {
            const user = await this.usersService.getUserByEmail(email);

            if (!user) {
                throw new NotFoundException('User not found');
            }

            const randomBytes = await Promise.resolve(crypto.randomBytes(16));
            const randomCharacters = randomBytes.toString('hex');

            // add email notification here later

            const url: string = `${process.env.BASE_URL}/verify-email?token=${randomCharacters}`;

            console.log(url);

            await this.usersService.updateEmailVerificationToken(
                user._id,
                randomCharacters,
            );
        } catch (error) {
            throw new BadRequestException(
                `resendEmailVerificationToken error: ${error instanceof Error ? error.message : 'Unknown error'}`,
            );
        }
    }

    async login(dto: AuthLoginDto): Promise<IAuthResponse> {
        try {
            const { password, ...user } = await this.validateUser(dto);

            const tokens = this.issueTokens({
                _id: user._id,
                username: user.username!,
                email: user.email!,
                role: user.role!,
            });

            return {
                message: 'User was successfully logged in',
                user,
                ...tokens,
            };
        } catch (error) {
            throw new UnauthorizedException(
                `login error: ${error instanceof Error ? error.message : 'Unknown error'}`,
            );
        }
    }

    private issueTokens(payload: IPayload): IIssueTokensResponse {
        const data = {
            username: payload.username,
            id: payload._id,
            email: payload.email,
            role: payload.role,
        };

        const accessToken = this.jwtService.sign(data, {
            expiresIn: '1h',
        });

        const refreshToken = this.jwtService.sign(data, {
            expiresIn: '7d',
        });

        return {
            accessToken,
            refreshToken,
        };
    }

    private async validateUser(dto: AuthLoginDto): Promise<IAuthDocument> {
        const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(dto.credential);
        let user: IAuthDocument;

        if (isEmail) {
            user = (await this.usersService.getUserByEmail(
                dto.credential,
            )) as IAuthDocument;
        } else {
            user = (await this.usersService.findUserByUsername(
                dto.credential,
            )) as IAuthDocument;
        }

        if (!user) {
            throw new NotFoundException('User not found');
        }

        const isValid = await verify(user.password!, dto.password);

        if (!isValid) {
            throw new UnauthorizedException('Invalid credentials');
        }

        return user;
    }

    addRefreshTokenToResponse(res: Response, refreshToken: string) {
        const expiresIn = new Date();

        expiresIn.setDate(expiresIn.getDate() + this.EXPIRE_DAY_REFRESH_TOKEN);

        res.cookie(this.REFRESH_TOKEN_NAME, refreshToken, {
            httpOnly: true,
            domain: 'localhost',
            expires: expiresIn,
            secure: false,
            sameSite: 'none',
        });
    }

    removeRefreshTokenFromResponse(res: Response) {
        res.cookie(this.REFRESH_TOKEN_NAME, '', {
            httpOnly: true,
            domain: 'localhost',
            expires: new Date(0),
            secure: false,
            sameSite: 'none',
        });

        return {
            message: 'Successfully logged out',
            result: true,
        };
    }

    async getNewTokens(refreshToken: string) {
        const result = await this.jwtService.verify(refreshToken);
        if (!result) {
            throw new UnauthorizedException('Invalid refresh token');
        }

        const { password, ...user } = await this.usersService.findUserByUsername(
            result.username,
        );
        if (!user) {
            throw new NotFoundException('User not found');
        }

        const tokens = this.issueTokens({
            _id: user._id,
            username: user.username!,
            email: user.email!,
            role: user.role!,
        });

        return {
            message: 'New tokens were successfully issued',
            user,
            ...tokens,
        };
    }

    async verifyEmail(emailVerificationToken: string): Promise<void> {
        try {
            const user = await this.usersService.getUserByEmailVerificationToken(
                emailVerificationToken,
            );

            if (!user) {
                throw new NotFoundException('User not found');
            }

            await this.usersService.updateVerifyEmailField(user._id, true);
        } catch (error) {
            throw new BadRequestException(
                `verifyEmail error: ${error instanceof Error ? error.message : 'Unknown error'}`,
            );
        }
    }

    async forgotPassword(email: string): Promise<IAuthDocument> {
        try {
            const user = await this.usersService.getUserByEmail(email);

            if (!user) {
                throw new NotFoundException('User not found');
            }

            const randomBytes = await Promise.resolve(crypto.randomBytes(16));
            const randomCharacters = randomBytes.toString('hex');

            // add email notification here later

            const url: string = `${process.env.BASE_URL}/reset-password?token${randomCharacters}`;

            console.log(url);

            const response = await this.usersService.updatePasswordResetToken(
                user._id,
                randomCharacters,
                new Date(Date.now() + 3600000), // 1 hour,
            );

            return response;
        } catch (error) {
            throw new BadRequestException(
                `forgotPassword error: ${error instanceof Error ? error.message : 'Unknown error'}`,
            );
        }
    }

    async resetPassword(
        passwordResetToken: string,
        password: string,
    ): Promise<void> {
        try {
            const user =
                await this.usersService.getUserByPasswordResetToken(passwordResetToken);

            if (!user) {
                throw new NotFoundException('User not found');
            }

            if (user.passwordResetTokenExpires! < new Date()) {
                throw new UnauthorizedException('Password reset token has expired');
            }

            // add email notification here later

            await this.usersService.updatePassword(user._id, password);
        } catch (error) {
            throw new BadRequestException(
                `resetPassword error: ${error instanceof Error ? error.message : 'Unknown error'}`,
            );
        }
    }

    async changePassword(
        userId: string,
        oldPassword: string,
        newPassword: string,
    ): Promise<void> {
        try {
            const user = await this.usersService.getUserById(userId);

            if (!user) {
                throw new NotFoundException('User not found');
            }

            const isValid = await verify(user.password!, oldPassword);

            if (!isValid) {
                throw new UnauthorizedException('Current password is incorrect');
            }

            await this.usersService.updatePassword(user._id, newPassword);
        } catch (error) {
            throw new BadRequestException(
                `changePassword error: ${error instanceof Error ? error.message : 'Unknown error'}`,
            );
        }
    }

    async deleteAccount(userId: string): Promise<void> {
        try {
            const user = await this.usersService.getUserById(userId);

            if (!user) {
                throw new NotFoundException('User not found');
            }

            await this.usersService.deleteAccount(user._id);
        } catch (error) {
            throw new BadRequestException(
                `deleteAccount error: ${error instanceof Error ? error.message : 'Unknown error'}`,
            );
        }
    }
}
