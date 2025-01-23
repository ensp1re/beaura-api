import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ILikeTransformationPayload, IShareTransformationPayload } from 'src/interfaces/main.interface';

@Schema()
export class TranformationImage extends Document {
    @Prop({ type: Types.ObjectId, required: true, ref: 'User' })
    userId: Types.ObjectId | undefined;

    @Prop({ type: String, required: true })
    title: string | undefined;

    @Prop({ required: true, type: String })
    fromImage: string | undefined;

    @Prop({ required: true, type: String })
    toImage: string | undefined;

    @Prop({ type: [String], default: [], required: false })
    tags: string[] | undefined;

    @Prop({ type: String, required: false, default: '' })
    aspectRatio: string | undefined;

    @Prop({ type: Boolean, default: false, required: false })
    isQuality: boolean | undefined;

    @Prop({ type: Boolean, default: false, required: false })
    isPublic: boolean | undefined;

    @Prop({ type: [Object], default: [], required: false })
    likes: ILikeTransformationPayload[] | undefined;

    @Prop({ type: [Object], default: [], required: false })
    shares: IShareTransformationPayload[] | undefined;

    @Prop({ type: String, required: false, default: '' })
    transformationType: string | undefined;

    @Prop({ required: false, default: '', type: String })
    prompt: string | undefined;

    @Prop({ type: Date, default: Date.now })
    createdAt: Date | undefined;

    @Prop({ default: Date.now, type: Date })
    updatedAt: Date | undefined;
}

export const tranformationSchema =
    SchemaFactory.createForClass(TranformationImage);
