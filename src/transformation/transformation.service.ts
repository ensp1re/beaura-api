/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UploadApiResponse } from 'cloudinary';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { UsersService } from 'src/users/users.service';
import { v4 as uuidv4 } from 'uuid';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { ICreateTransformationPayload, IGenerativeReplace, ILikeTransformationPayload, IShareTransformationPayload, ITransformationDocument, ITransformationDto } from '@auth/interfaces/main.interface';
import { createUrl } from '@auth/lib/utils';

import { TranformationImage } from './models/transformation.schema';

@Injectable()
export class TransformationService {
  private ITEM_RO_REPLACE: string =
    'haircut';
  constructor(
    @InjectModel(TranformationImage.name)
    private transformationModel: Model<TranformationImage>,
    @Inject(forwardRef(() => UsersService))
    private usersService: UsersService,
    private cloudinaryService: CloudinaryService,) { }

  async createOneImageTransformation(data: ITransformationDto) {
    try {
      const existingUser = await this.usersService.getUserById(data.userId);
      if (!existingUser) {
        throw new NotFoundException('User not found');
      }

      const transformationPublicIdFromImage: string = uuidv4();

      const uploadResultFromImage: UploadApiResponse | undefined =
        (await this.cloudinaryService.uploadImage(
          data.selectedImage!,
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
        transformationType: data.transformationType as string,
        prompt: data.prompt,
        tags: data.tags,
        // aspectRatio: data.aspectRatio,
        isQuality: data.isQuality,
      };

      const transformation = new this.transformationModel(transformationData);
      await transformation.save();

      return transformation.toObject() as ITransformationDocument;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`createOneImageTransformation error: ${error.message}`);
      } else {
        throw new Error(`createOneImageTransformation error: ${String(error)}`);
      }
    }
  }

  async getTransformationsByUserId(
    userId: string,
  ): Promise<ITransformationDocument[]> {
    try {


      const transformations = await this.transformationModel
        .find(
          { userId: userId },
        )
        .lean()
        .exec();

      if (!transformations || transformations.length === 0) {
        throw new NotFoundException('No transformations found for this user');
      }

      return transformations;

    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`getTransformationsByUserId error: ${error.message}`);
      } else {
        throw new Error(`getTransformationsByUserId error: ${String(error)}`);
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
        .populate('userId', 'username email profilePicture')
        .populate('likes.userId', 'username email profilePicture')
        .populate('shares.userId', 'username email profilePicture').exec();

      if (!transformation) {
        throw new NotFoundException('Transformation not found');
      }

      return transformation;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`getTransformationById error: ${error.message}`);
      } else {
        throw new Error(`getTransformationById error: ${String(error)}`);
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
        .populate('userId', 'username email profilePicture')
        .populate('likes.userId', 'username email profilePicture')
        .populate('shares.userId', 'username email profilePicture')
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
        .populate('userId', 'username email profilePicture')
        .populate('likes.userId', 'username email profilePicture')
        .populate('shares.userId', 'username email profilePicture')
        .exec();

      return transformations;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`getAllTransformations error: ${error.message}`);
      } else {
        throw new Error(`getAllTransformations error: ${String(error)}`);
      }
    }
  }


  async getTransformationByFilter(filter: Record<string, any>): Promise<ITransformationDocument[]> {
    try {
      const processedFilter = Object.entries(filter).reduce(
        (acc, [key, value]) => {
          if (value === 'true') {
            acc[key] = true;
          } else if (value === 'false') {
            acc[key] = false;
          } else {
            acc[key] = value;
          }
          return acc;
        },
        {} as Record<string, any>,
      );

      const transformations = await this.transformationModel
        .find(processedFilter)
        .lean()
        .populate('userId', 'username email profilePicture')
        .populate('likes.userId', 'username email profilePicture')
        .populate('shares.userId', 'username email profilePicture')
        .exec();

      return transformations;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`getTransformationByFilter error: ${error.message}`);
      } else {
        throw new Error(`getTransformationByFilter error: ${String(error)}`);
      }
    }
  }

  async getTransformationByText(text: string): Promise<ITransformationDocument[]> {
    try {
      const transformations = await this.transformationModel
        .find({
          $or: [
            { title: { $regex: text, $options: 'i' } },
            { prompt: { $regex: text, $options: 'i' } },
            { tags: { $regex: text, $options: 'i' } },
          ],
        })
        .lean()
        .populate('userId', 'username email profilePicture')
        .populate('likes.userId', 'username email profilePicture')
        .populate('shares.userId', 'username email profilePicture')
        .exec();

      return transformations;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`getTransformationByText error: ${error.message}`);
      } else {
        throw new Error(`getTransformationByText error: ${String(error)}`);
      }
    }
  };

  async getUserLikedTransformations(userId: string)
    : Promise<ITransformationDocument[]> {
    try {
      const transformations = await this.transformationModel
        .find({ 'likes.userId': userId })
        .populate('userId', 'username email profilePicture')
        .populate('likes.userId', 'username email profilePicture')
        .lean()
        .exec();

      return transformations as ITransformationDocument[];
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`getUserLikedTransformations error: ${error.message}`);
      } else {
        throw new Error(`getUserLikedTransformations error: ${String(error)}`);
      }
    }
  }


  async likeTransformation(likeData: ILikeTransformationPayload): Promise<ITransformationDocument> {
    try {
      const transformation = await this.transformationModel.findById(likeData.transformationId);
      if (!transformation) {
        throw new NotFoundException('Transformation not found');
      }

      if (!transformation.likes) {
        transformation.likes = [];
      }
      const existingLike = transformation.likes.find((like) => like.userId.toString() === likeData.userId);
      if (existingLike) {
        // unlike
        transformation.likes = transformation.likes.filter((like) => like.userId.toString() !== likeData.userId);
      } else {
        transformation.likes.push({
          userId: likeData.userId,
          transformationId: likeData.transformationId,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }

      await transformation.save();

      return transformation.toObject() as ITransformationDocument;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`likeTransformation error: ${error.message}`);
      } else {
        throw new Error(`likeTransformation error: ${String(error)}`);
      }
    }
  }

  async shareTransformation(shareData: IShareTransformationPayload): Promise<ITransformationDocument> {
    try {
      const transformation = await this.transformationModel.findById(shareData.transformationId);
      if (!transformation) {
        throw new NotFoundException('Transformation not found');
      }

      if (!transformation.shares) {
        transformation.shares = [];
      }
      transformation.shares.push({
        userId: shareData.userId,
        transformationId: shareData.transformationId,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      await transformation.save();

      return transformation.toObject() as ITransformationDocument;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`shareTransformation error: ${error.message}`);
      } else {
        throw new Error(`shareTransformation error: ${String(error)}`);
      }
    }
  }
}
