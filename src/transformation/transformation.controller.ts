import {
    BadRequestException,
    Body,
    Controller,
    Get,
    HttpCode,
    NotFoundException,
    Param,
    Post,
    Put,
    Query,
    Res,
    UseGuards,
} from '@nestjs/common';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { StatusCodes } from 'http-status-codes';
import { Response } from 'express';
import { ILikeTransformationPayload, IShareTransformationPayload, ITransformationDocument, ITransformationDto } from '@auth/interfaces/main.interface';
import { ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Types } from 'mongoose';

import { TransformationService } from './transformation.service';
import { LikeTransformationDto, ShareTransformationDto, TransformationDto } from './dto/transformation.dto';


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
        @Body() dto: TransformationDto,
        @Res() res: Response,
    ): Promise<Response> {
        try {

            const result =
                await this.transformationService.createOneImageTransformation(dto as unknown as ITransformationDto);
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
            const transformations =
                await this.transformationService.getTransformationsByUserId(userId);
            return transformations;
        } catch (error) {
            if (error instanceof Error) {
                throw new BadRequestException(
                    `getTransformationsByUserId error: ${error.message}`,
                );
            }
            throw new BadRequestException('An unknown error occurred');
        }
    }


    @UseGuards(AuthGuard)
    @Get(':id')
    @ApiOperation({ summary: 'Get transformation by ID' })
    @ApiResponse({ status: 200, description: 'Transformation retrieved successfully.' })
    @ApiResponse({ status: 400, description: 'Bad Request.' })
    @ApiResponse({ status: 404, description: 'Transformation not found.' })
    @ApiParam({ name: 'id', type: String, description: 'Transformation ID' })
    async getTransformationById(@Param('id') id: string): Promise<ITransformationDocument> {
        try {
            if (!Types.ObjectId.isValid(id)) {
                throw new BadRequestException('Invalid transformation ID');
            }
            const transformation = await this.transformationService.getTransformationById(id);
            if (!transformation) {
                throw new NotFoundException('Transformation not found');
            }
            return transformation;
        } catch (error) {
            if (error instanceof BadRequestException || error instanceof NotFoundException) {
                throw error;
            }
            if (error instanceof Error) {
                throw new BadRequestException(`getTransformationById error: ${error.message}`);
            }
            throw new BadRequestException('An unknown error occurred');
        }
    }
    @UseGuards(AuthGuard)
    @HttpCode(200)
    @Get('liked/:userId')
    @ApiOperation({ summary: 'Get liked transformations by user ID' })
    @ApiResponse({ status: 200, description: 'Liked transformations retrieved successfully.' })
    @ApiResponse({ status: 400, description: 'Bad Request.' })
    async getLikedTransformationsByUserId(
        @Param('userId') userId: string,
    ): Promise<ITransformationDocument[]> {
        try {
            const transformations =
                await this.transformationService.getUserLikedTransformations(userId);
            return transformations;
        } catch (error) {
            if (error instanceof Error) {
                throw new BadRequestException(
                    `getLikedTransformationsByUserId error: ${error.message}`,
                );
            }
            throw new BadRequestException('An unknown error occurred');
        }
    }

    @UseGuards(AuthGuard)
    @Get('filter/search')
    @ApiOperation({ summary: 'Get transformations by filter' })
    @ApiResponse({ status: 200, description: 'Transformations retrieved successfully.' })
    @ApiResponse({ status: 400, description: 'Bad Request.' })
    @ApiQuery({ name: 'isPublic', required: false, type: Boolean })
    @ApiQuery({ name: 'isQuality', required: false, type: Boolean })
    @ApiQuery({ name: 'userId', required: false, type: String })
    @ApiQuery({ name: 'transformationType', required: false, type: String })
    async getTransformationsByFilter(
        @Query() query: Record<string, string>
    ): Promise<ITransformationDocument[]> {
        try {
            const transformations = await this.transformationService.getTransformationByFilter(query);
            return transformations;
        } catch (error) {
            if (error instanceof Error) {
                throw new BadRequestException(`getTransformationsByFilter error: ${error.message}`);
            }
            throw new BadRequestException('An unknown error occurred');
        }
    }


    @UseGuards(AuthGuard)
    @HttpCode(200)
    @Get('search/text')
    @ApiOperation({ summary: 'Get transformations by text search' })
    @ApiResponse({ status: 200, description: 'Transformations retrieved successfully.' })
    @ApiResponse({ status: 400, description: 'Bad Request.' })
    @ApiQuery({ name: 'text', required: true, type: String })
    async getTransformationByText(
        @Query('text') text: string,
    ): Promise<ITransformationDocument[]> {
        try {
            const transformations = await this.transformationService.getTransformationByText(text);
            return transformations;
        } catch (error) {
            if (error instanceof Error) {
                throw new BadRequestException(`getTransformationByText error: ${error.message}`);
            }
            throw new BadRequestException('An unknown error occurred');
        }
    }


    @UseGuards(AuthGuard)
    @HttpCode(200)
    @Put('')
    @ApiOperation({ summary: 'Like a transformation' })
    @ApiResponse({ status: 200, description: 'Transformation liked successfully.' })
    @ApiResponse({ status: 400, description: 'Bad Request.' })
    async likeTransformation(@Body() likeData: LikeTransformationDto): Promise<ITransformationDocument> {
        try {
            return await this.transformationService.likeTransformation(likeData as unknown as ILikeTransformationPayload);
        } catch (error) {
            if (error instanceof Error) {
                throw new BadRequestException(`likeTransformation error: ${error.message}`);
            }
            throw new BadRequestException('An unknown error occurred');
        }
    }

    @UseGuards(AuthGuard)
    @HttpCode(200)
    @Put('share')
    @ApiOperation({ summary: 'Share a transformation' })
    @ApiResponse({ status: 200, description: 'Transformation shared successfully.' })
    @ApiResponse({ status: 400, description: 'Bad Request.' })
    async shareTransformation(@Body() shareData: ShareTransformationDto): Promise<ITransformationDocument> {
        try {
            return await this.transformationService.shareTransformation(shareData as unknown as IShareTransformationPayload);
        } catch (error) {
            if (error instanceof Error) {
                throw new BadRequestException(`shareTransformation error: ${error.message}`);
            }
            throw new BadRequestException('An unknown error occurred');
        }
    }

}
