import { IsEmail, IsOptional, IsString } from "class-validator";



export class SendMailDto {
    @IsEmail()
    @IsString()
    to!: string;

    @IsString()
    subject!: string;

    @IsOptional()
    @IsString()
    template!: string;

    @IsOptional()
    context!: Record<string, any>;
}
