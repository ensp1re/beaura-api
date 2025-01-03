import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ITransformationDocument } from 'src/interfaces/main.interface';




@Schema()
export class User extends Document {
    @Prop({ type: String, unique: true, required: true, trim: true, ref: 'User' })
    username: string | undefined;

    @Prop({ type: String, unique: true, required: true, trim: true, ref: 'User' })
    email: string | undefined;

    @Prop({ type: String, required: true, trim: true })
    password: string | undefined;

    @Prop({
        type: String,
        default:
            'https://res.cloudinary.com/dk5b3j3sh/image/upload/v1626820004/avatars/blank-profile-picture-973460_640',
    })
    profilePicture: string | undefined;

    @Prop({ type: String, default: '' })
    profilePublicId: string | undefined;

    @Prop({ type: Boolean, default: false })
    emailVerified: boolean | undefined;

    @Prop({ type: String, default: '' })
    emailVerificationToken: string | undefined;

    @Prop({ type: Number, default: 0 })
    creditBalance: number | undefined;

    @Prop({ type: String, default: 'free' })
    status: string | undefined;

    @Prop({ type: Date, default: Date.now })
    createdAt: Date | undefined;

    @Prop({ type: Date, default: Date.now })
    updatedAt: Date | undefined;

    @Prop({ type: String, default: '' })
    passwordResetToken: string | undefined;

    @Prop({ type: Date, default: Date.now })
    passwordResetTokenExpires: Date | undefined;

    @Prop({ type: [Object], default: [] })
    transformations: ITransformationDocument[] | undefined;

    @Prop({ type: String, default: 'User' })
    role: string | undefined;
}

export const UserSchema = SchemaFactory.createForClass(User);
