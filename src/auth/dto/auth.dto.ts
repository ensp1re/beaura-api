/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-wrapper-object-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { ApiProperty } from '@nestjs/swagger';
import {
    IsEmail, IsString, MinLength,
    registerDecorator,
    ValidationOptions,
    ValidationArguments,
    IsOptional,
} from 'class-validator';

export function IsEmailOrUsername(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            name: 'isEmailOrUsername',
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            validator: {
                validate(value: any, _args: ValidationArguments) {
                    // Email regex to validate email format
                    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

                    const isUsername =
                        typeof value === 'string' && value.length >= 3 && !/\s/.test(value);

                    return isEmail || isUsername;
                },
                defaultMessage(_args: ValidationArguments) {
                    return 'Value must be a valid email address or a username with at least 3 characters.';
                },
            },
        });
    };
}

export class AuthSignUpDto {
    @ApiProperty({
        example: 'john_does',
        description: 'The username of the user',
    })
    @IsString()
    @MinLength(3, {
        message: 'Username must be at least 3 characters long',
    })
    username!: string;

    @ApiProperty({
        example: 'john.does@example.com',
        description: 'The email of the user',
    })
    @IsEmail()
    email!: string;

    @ApiProperty({
        example: 'password123',
        description: 'The password of the user',
    })
    @MinLength(6, {
        message: 'Password must be at least 6 characters long',
    })
    @IsString()
    password!: string;

    @ApiProperty({
        example: 'bio123',
        description: 'bio',
        required: false,
    })
    @MinLength(6, {
        message: 'Bio must not be that short!',
    })
    @IsOptional()
    @IsString()
    bio?: string;

    @ApiProperty({
        example: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQF-ts8ef0ULc3wXS7uMqNbMbMl0sspMzxObsJIL8tobMq1h3LyZ1GMjyUTSfljpiiiRJs&usqp=CAU',
        description: 'The profile picture URL of the user',
        required: false,
    })
    @IsOptional()
    @IsString()
    profilePicture?: string;
}

export class AuthLoginDto {
    @ApiProperty({
        example: 'john_doe',
        description: 'The email or username of the user',
    })
    @IsString()
    @IsEmailOrUsername()
    credential!: string;

    @ApiProperty({
        example: 'password123',
        description: 'The password of the user',
    })
    @IsString()
    password!: string;
}

export class ForgotPasswordDto {
    @ApiProperty({
        example: 'john.doe@example.com',
        description: 'The email of the user',
    })
    @IsEmail()
    email!: string;
}

export class ResetPasswordDto {
    @ApiProperty({
        example: 'newpassword123',
        description: 'The new password of the user',
    })
    @IsString()
    @MinLength(6, {
        message: 'Password must be at least 6 characters long',
    })
    password!: string;

    @ApiProperty({
        example: 'newpassword123',
        description: 'The confirmation of the new password',
    })
    @IsString()
    @MinLength(6, {
        message: 'Password must be at least 6 characters long',
    })
    confirmPassword!: string;
}

export class ChangePasswordDto {
    @ApiProperty({
        example: 'oldpassword123',
        description: 'The old password of the user',
    })
    @IsString()
    @MinLength(6, {
        message: 'Password must be at least 6 characters long',
    })
    oldPassword!: string;

    @ApiProperty({
        example: 'newpassword123',
        description: 'The new password of the user',
    })
    @IsString()
    @MinLength(6, {
        message: 'Password must be at least 6 characters long',
    })
    newPassword!: string;
}

export class VerifyEmailDto {
    @ApiProperty({
        example: 'verificationtoken123',
        description: 'The email verification token',
    })
    @IsString()
    emailVerificationToken!: string;
}

export class RefreshToken {
    @ApiProperty({
        example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImpvaG5fZG9lcyIsImlkIjoiNjc4YTk3ZjNlNzk1ZjAyNDMwZmU0NjQ0IiwiZW1haWwiOiJqb2huLmRvZXNAZXhhbXBsZS5jb20iLCJyb2xlIjoiVXNlciIsImlhdCI6MTczNzEzNjExNiwiZXhwIjoxNzM3NzQwOTE2fQ.3qyw22B7KOfWxVkPjZB6p897GbKk9igtRbwjMF0U7kU',
        description: 'new refresh token',
    })

    @IsString()
    refreshToken!: string;
}