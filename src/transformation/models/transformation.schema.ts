import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { IAspectRatioOption, ILikeTransformationPayload, IShareTransformationPayload } from 'src/interfaces/main.interface';

@Schema({ timestamps: true })
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

    @Prop({ type: String, required: false, default: null })
    aspectRatio: IAspectRatioOption | undefined;

    @Prop({ type: Boolean, default: false, required: false })
    isQuality: boolean | undefined;

    @Prop({ type: Boolean, default: false, required: false })
    isPublic: boolean | undefined;

    @Prop({
        type:
            [
                {
                    userId: { type: Types.ObjectId, ref: 'User' },
                    transformationId: { type: Types.ObjectId, ref: 'TransformationImage' },
                    createdAt: { type: Date, default: Date.now },
                    updatedAt: { type: Date, default: Date.now },
                }
            ], default: []
    })
    likes: ILikeTransformationPayload[] | undefined;

    @Prop({
        type:
            [
                {
                    userId: { type: Types.ObjectId, ref: 'User' },
                    transformationId: { type: Types.ObjectId, ref: 'TransformationImage' },
                    createdAt: { type: Date, default: Date.now },
                    updatedAt: { type: Date, default: Date.now },
                }
            ], default: []
    })
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
