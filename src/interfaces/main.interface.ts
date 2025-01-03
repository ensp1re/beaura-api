import { Types } from 'mongoose';

export interface ICreateTransformationPayload {
    [key: string]: any;
    userId: string;
    title: string;
    fromImage?: string;
    toImage: string;
    transformationType?: string;
    prompt?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface ITransformationDocument {
    userId: Types.ObjectId | undefined;
    title?: string;
    fromImage?: string;
    toImage?: string;
    transformationType?: string; // "GenerativeReplace" || "HaircutGallery" || "HaircutPrompt" || "3DModel" || "ImageToImage"
    createdAt?: Date;
    updatedAt?: Date;
    _id?: Object;
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
