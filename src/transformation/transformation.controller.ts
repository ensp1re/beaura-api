import {
    BadRequestException,
    Body,
    Controller,
    Get,
    HttpCode,
    Param,
    Post,
    Res,
    UseGuards,
} from '@nestjs/common';
import { TransformationService } from './transformation.service';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { CreateTransformationDto } from './dto/transformation.dto';
import { StatusCodes } from 'http-status-codes';
import { Response } from 'express';
import { ITransformationDocument } from '@auth/interfaces/main.interface';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Transformation')
@Controller('transformation')
export class TransformationController {
    constructor(private readonly transformationService: TransformationService) { }

    @UseGuards(AuthGuard)
    @HttpCode(200)
    @Post('create')
    @ApiOperation({ summary: 'Create a new transformation' })
    @ApiResponse({ status: 201, description: 'Transformation created successfully.' })
    @ApiResponse({ status: 400, description: 'Bad Request.' })
    async createTransformation(
        @Body() dto: CreateTransformationDto,
        @Res() res: Response,
    ): Promise<Response> {
        try {
            const result =
                await this.transformationService.createOneImageTransformation(dto as any);
            const response = { ...result, userId: result?.userId?.toString() };

            return res.status(StatusCodes.CREATED).json({
                message: 'Transformation created successfully',
                data: response,
            });
        } catch (error) {
            if (error instanceof Error) {
                throw new BadRequestException(error.message);
            }
            throw new BadRequestException('An unknown error occurred');
        }
    }

    @UseGuards(AuthGuard)
    @HttpCode(200)
    @Get('id/:userId')
    @ApiOperation({ summary: 'Get transformations by user ID' })
    @ApiResponse({ status: 200, description: 'Transformations retrieved successfully.' })
    @ApiResponse({ status: 400, description: 'Bad Request.' })
    async getTransformationsByUserId(
        @Param('userId') userId: string,
    ): Promise<ITransformationDocument[]> {
        try {
            console.log(userId);
            const transformations =
                await this.transformationService.getTransformationsByUserId(userId);
            return transformations;
        } catch (error) {
            if (error instanceof Error) {
                throw new BadRequestException(
                    'getTransformationsByUserId error: ' + error.message,
                );
            }
            throw new BadRequestException('An unknown error occurred');
        }
    }

    @UseGuards(AuthGuard)
    @HttpCode(200)
    @Get(':transformationId')
    @ApiOperation({ summary: 'Get transformation by ID' })
    @ApiResponse({ status: 200, description: 'Transformation retrieved successfully.' })
    @ApiResponse({ status: 400, description: 'Bad Request.' })
    async getTransformationById(
        @Param('transformationId') transformationId: string,
    ): Promise<ITransformationDocument> {
        try {
            const transformation =
                await this.transformationService.getTransformationById(
                    transformationId,
                );
            return transformation;
        } catch (error) {
            if (error instanceof Error) {
                throw new BadRequestException(
                    'getTransformationById error: ' + error.message,
                );
            }
            throw new BadRequestException('An unknown error occurred');
        }
    }
}
