/* eslint-disable @typescript-eslint/no-wrapper-object-types */
import { Types } from 'mongoose';

import { IAuthDocument } from './transformation.interface';

export interface ICreateTransformationPayload {
  [key: string]: unknown;
  userId: string;
  title: string;
  fromImage?: string;
  tags?: string[];
  isPublic?: boolean;
  aspectRatio?: IAspectRatioOption;
  isQuality?: boolean;
  toImage: string;
  transformationType?: string;
  prompt?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ILikeTransformationPayload {
  userId: string;
  transformationId: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IShareTransformationPayload {
  userId: string;
  transformationId: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ITransformationDocument {
  _id?: Object;
  isPublic?: boolean;
  likes?: ILikeTransformationPayload[];
  shares?: IShareTransformationPayload[];
  prompt?: string;
  userId: Types.ObjectId | undefined;
  title?: string;
  tags?: string[];
  aspectRatio?: IAspectRatioOption;
  isQuality?: boolean;
  fromImage?: string;
  toImage?: string;
  transformationType?: string; // "GenerativeReplace" || "HaircutGallery" || "HaircutPrompt" || "3DModel" || "ImageToImage"
  createdAt?: Date;
  updatedAt?: Date;
}

export interface HaircutGalleryPrompt {
  type?: string;
  itemToReplace?: string;
  replaceWith?: string;
  exampleImage?: string;
  sex?: string; // male, female
}

export interface ICreateTransformationImage {
  userId: string;
  prompt?: string;
  title?: string;
  fromImage?: string;
  toImage?: string;
}

export interface IGenerativeReplace {
  public_url?: string;
  effect?: string;
  public_id?: string;
}

export interface IAuthData {
  message?: string;
  accessToken?: string;
  user?: IAuthDocument;
}

export interface IGoogleAuthRegister {
  email: string;
  name: string;
  picture: string;
  email_verified: boolean;
  nickname: string;
}

export interface ITransformationDto {
  userId: string;
  title: string;
  prompt: string;
  transformationType: string;
  tags: string[];
  selectedImage: string;
  isPublic: boolean;
  aspectRatio: IAspectRatioOption;
  isQuality: boolean;
}

export interface IAspectRatioOption {
  aspectRatio: string;
  label: string;
  width: number;
  height: number;
}

export interface ITransaction {
  id?: string;
  amount: number;
  currency: string;
  status: string;
  date: Date;
  invoiceId: string;
}

export interface ISubscription {
  id?: string;
  status: string;
  planId: string;
  planName: string;
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  cancelAtPeriodEnd: boolean;
}
