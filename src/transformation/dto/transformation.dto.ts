import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IAspectRatioOption } from '@auth/interfaces/main.interface';

export class TransformationDto {
    @ApiProperty({ description: 'User ID', required: true })
    @IsString()
    userId!: string | undefined;

    @ApiProperty({ description: 'Title of the transformation', required: true })
    @IsString()
    title!: string;

    @ApiProperty({ description: 'Prompt for the transformation', required: true })
    @IsString()
    prompt!: string;

    @IsOptional()
    @ApiProperty({ description: 'Type of transformation', required: false })
    @IsString()
    transformationType?: string;

    @IsOptional()
    @ApiProperty({ description: 'Tags for the transformation', required: false, type: [String] })
    tags?: string[];

    @ApiProperty({ description: 'Selected image name', required: true })
    @IsString()
    selectedImage!: ArrayBuffer | string | null;

    @IsOptional()
    @ApiProperty({ description: 'Is the transformation public', required: false })
    isPublic?: boolean;

    @IsOptional()
    @ApiProperty({ description: 'Aspect ratio of the transformation', required: false })
    aspectRatio!: IAspectRatioOption;

    @IsOptional()
    @ApiProperty({ description: 'Is the transformation of high quality', required: false })
    isQuality?: boolean;
}

export class CreateTransformationDto {
    @ApiProperty({ example: '6727e1cb83261f541471a403', description: 'User ID' })
    @IsString()
    userId!: string | undefined;

    @ApiProperty({ description: 'Prompt for the transformation', required: false })
    @IsString()
    prompt!: string;

    @ApiProperty({ description: 'Title of the transformation', required: false })
    @IsString()
    title!: string;

    @ApiProperty({
        example: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS_FflWswTCQqbbiuk4PJaL1_73k4VwSrSHYA&s',
        description: 'Source image for the transformation', required: false
    })
    @IsString()
    fromImage?: string;
}