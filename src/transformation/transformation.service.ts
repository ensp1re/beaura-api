import {
    BadRequestException,
    Injectable,
    NotFoundException,
  } from '@nestjs/common';
  import { UploadApiResponse } from 'cloudinary';
  import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
  import { UsersService } from 'src/users/users.service';
  import { v4 as uuidv4 } from 'uuid';
  import { Model } from 'mongoose';
  import { TranformationImage } from './models/transformation.schema';
  import { InjectModel } from '@nestjs/mongoose';
import { ICreateTransformationImage, ICreateTransformationPayload, IGenerativeReplace, ITransformationDocument } from '@auth/interfaces/main.interface';
import { createUrl } from '@auth/lib/utils';
  
  @Injectable()
  export class TransformationService {
    private ITEM_RO_REPLACE: string =
      "I need to change the haircut of the person in the photo but don't change anything except hair";
    constructor(
      @InjectModel(TranformationImage.name)
      private transformationModel: Model<TranformationImage>,
      private usersService: UsersService,
      private cloudinaryService: CloudinaryService,
    ) {}
  
    async createOneImageTransformation(data: ICreateTransformationImage) {
      try {
        const existingUser = await this.usersService.getUserById(data.userId);
        if (!existingUser) {
          throw new NotFoundException('User not found');
        }
  
        const transformationPublicIdFromImage: string = uuidv4();
  
        const uploadResultFromImage: UploadApiResponse | undefined =
          (await this.cloudinaryService.uploadImage(
            data.fromImage!,
            transformationPublicIdFromImage,
          )) as UploadApiResponse;
  
        if (!uploadResultFromImage.public_id) {
          throw new NotFoundException('Image not uploaded');
        }
  
        const transformationPublicIdToImage: string = uuidv4();
  
        const generativeReplaceData: IGenerativeReplace = {
          public_url: createUrl(
            this.ITEM_RO_REPLACE,
            data.prompt,
            uploadResultFromImage.public_id,
            uploadResultFromImage.format,
          ),
          public_id: transformationPublicIdToImage,
        };
  
        const uploadToImage: UploadApiResponse | undefined =
          (await this.cloudinaryService.generativeReplace(
            generativeReplaceData,
          )) as UploadApiResponse;
  
        if (!uploadToImage.public_id) {
          throw new BadRequestException('uploadToImage error');
        }
  
        const transformationData: ICreateTransformationPayload = {
          userId: existingUser._id,
          title: data.title as string,
          fromImage: uploadResultFromImage.secure_url,
          toImage: uploadToImage.secure_url,
          transformationType: 'GenerativeReplace',
          prompt: data.prompt,
        };
  
        const transformation = new this.transformationModel(transformationData);
        await transformation.save();
  
        return transformation.toObject();
      } catch (error) {
        if (error instanceof Error) {
          throw new Error('createOneImageTransformation error: ' + error.message);
        } else {
          throw new Error('createOneImageTransformation error: ' + String(error));
        }
      }
    }
  
    async getTransformationsByUserId(
      userId: string,
    ): Promise<ITransformationDocument[]> {
      try {
        const transformations = await this.transformationModel
          .find()
          .lean()
          .exec();
  
        if (!transformations || transformations.length === 0) {
          throw new NotFoundException('No transformations found for this user');
        }
  
        return transformations.filter(
          (transformation) => transformation.userId?.toString() === userId,
        );
      } catch (error) {
        if (error instanceof Error) {
          throw new Error('getTransformationsByUserId error: ' + error.message);
        } else {
          throw new Error('getTransformationsByUserId error: ' + String(error));
        }
      }
    }
  
    async getTransformationById(
      transformationId: string,
    ): Promise<ITransformationDocument> {
      try {
        const transformation = await this.transformationModel
          .findById(transformationId)
          .lean()
          .exec();
  
        if (!transformation) {
          throw new NotFoundException('Transformation not found');
        }
  
        return transformation;
      } catch (error) {
        if (error instanceof Error) {
          throw new Error('getTransformationById error: ' + error.message);
        } else {
          throw new Error('getTransformationById error: ' + String(error));
        }
      }
    }
  
    async getTransformationsByType(
      type: string,
    ): Promise<ITransformationDocument[]> {
      try {
        const transformations = await this.transformationModel
          .find({ transformationType: type })
          .lean()
          .exec();
  
        return transformations;
      } catch (error) {
        if (error instanceof Error) {
          throw new Error(`getTransformationsByType error: ${error.message}`);
        } else {
          throw new Error(`getTransformationsByType error: ${String(error)}`);
        }
      }
    }
  
    async getAllTransformations(): Promise<ITransformationDocument[]> {
      try {
        const transformations = await this.transformationModel
          .find()
          .lean()
          .exec();
  
        return transformations;
      } catch (error) {
        if (error instanceof Error) {
          throw new Error('getAllTransformations error: ' + error.message);
        } else {
          throw new Error('getAllTransformations error: ' + String(error));
        }
      }
    }
  }
  