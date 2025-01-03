import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';
import {
    registerDecorator,
    ValidationOptions,
    ValidationArguments,
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
        example: 'john_doe',
        description: 'The username of the user',
    })
    @IsString()
    @MinLength(3, {
        message: 'Username must be at least 3 characters long',
    })
    username!: string;

    @ApiProperty({
        example: 'john.doe@example.com',
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
        example: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQF-ts8ef0ULc3wXS7uMqNbMbMl0sspMzxObsJIL8tobMq1h3LyZ1GMjyUTSfljpiiiRJs&usqp=CAU',
        description: 'The profile picture URL of the user',
    })
    @IsString()
    profilePicture!: string;
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