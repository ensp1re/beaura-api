import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class TransformationDto {
    @ApiProperty({ description: 'User ID' })
    @IsString()
    userId: string | undefined;

    @ApiProperty({ description: 'Title of the transformation', required: false })
    @IsString()
    title?: string;

    @ApiProperty({ description: 'Source image for the transformation', required: false })
    @IsString()
    fromImage?: string;

    @ApiProperty({ description: 'Type of transformation', required: false })
    @IsString()
    transformationType?: string;
}

export class CreateTransformationDto {
    @ApiProperty({ example: '6727e1cb83261f541471a403', description: 'User ID' })
    @IsString()
    userId: string | undefined;

    @ApiProperty({ description: 'Prompt for the transformation', required: false })
    @IsString()
    prompt?: string;

    @ApiProperty({ description: 'Title of the transformation', required: false })
    @IsString()
    title?: string;

    @ApiProperty({
        example: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS_FflWswTCQqbbiuk4PJaL1_73k4VwSrSHYA&s',
        description: 'Source image for the transformation', required: false
    })
    @IsString()
    fromImage?: string;
}