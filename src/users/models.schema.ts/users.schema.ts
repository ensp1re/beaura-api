import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ISubscription, ITransaction, ITransformationDocument } from 'src/interfaces/main.interface';

@Schema()
export class User extends Document {
  @Prop({ type: String, unique: true, required: true, trim: true, ref: 'User' })
  username: string | undefined;

  @Prop({ type: String, unique: true, required: true, trim: true, ref: 'User' })
  email: string | undefined;

  @Prop({ type: String, required: true, trim: true })
  password: string | undefined;

  @Prop({ type: String, required: false, trim: true })
  nickname: string | undefined;

  @Prop({ type: Boolean, required: false, default: false })
  isPrivate: boolean | undefined;

  @Prop({
    type: String,
    required: false,
    default: 'https://res.cloudinary.com/dk5b3j3sh/image/upload/v1626820004/avatars/blank-profile-picture-973460_640'
  })
  profilePicture: string | undefined;

  @Prop({ type: String, default: '' })
  profilePublicId: string | undefined;

  @Prop({ type: String, default: '', required: false })
  bio: string | undefined;

  @Prop({ type: Boolean, default: false })
  emailVerified: boolean | undefined;

  @Prop({ type: String, default: '' })
  emailVerificationToken: string | undefined;

  @Prop({ type: Number, default: 5 })
  creditBalance: number | undefined;

  @Prop({ type: Boolean, default: true })
  isNotificationEnabled: boolean | undefined;

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

  @Prop({ type: [Object], ref: 'TranformationImage', default: [] })
  transformations: ITransformationDocument[] | undefined;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Ticket' }] })
  tickets?: Types.ObjectId[];

  @Prop({ type: String, default: 'User' })
  role: string | undefined;

  @Prop({
    type: [{ type: [Object] }],
    default: []
  })
  transactions: ITransaction[] | undefined;

  @Prop({
    type: [{ type: [Object] }],
    default: []
  })
  subscriptions: ISubscription[] | undefined;

  @Prop({ type: String, default: '' })
  stripeCustomerId: string | undefined;
}

export const UserSchema = SchemaFactory.createForClass(User);
