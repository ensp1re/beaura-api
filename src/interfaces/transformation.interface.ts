/* eslint-disable @typescript-eslint/no-explicit-any */
import { ITicket } from '@auth/ticket/interfaces/ticket.interface';

import { ITransformationDocument } from './main.interface';

declare global {
  namespace Express {
    interface Request {
      currentUser?: IAuthPayload;
    }
  }
}

export interface IAuthPayload {
  id: number;
  username: string;
  email: string;
  role: Role;
  iat?: number;
}

export interface IPayload {
  _id: string;
  username: string;
  email: string;
  role: Role;
}

export interface IAuth {
  username?: string;
  email?: string;
  profilePicture?: string;
  password: string;
}

export interface IAuthDocument {
  _id?: any;
  username?: string;
  email?: string;
  password?: string;
  nickname?: string;
  bio?: string;
  profilePicture?: string;
  profilePublicId?: string;
  emailVerified?: boolean;
  isPrivate?: boolean;
  emailVerificationToken?: string;
  creditBalance?: number;
  status?: string; // free, starter, premium
  isNotificationEnabled?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  tickets?: ITicket[]; // will add type for this later
  passwordResetToken?: string;
  passwordResetTokenExpires?: Date;
  transformations?: ITransformationDocument[] | []; // will add type for this later
  role?: Role;
}

export interface IAuthResponse {
  message?: string;
  accessToken?: string;
  refreshToken?: string;
  user?: IAuthDocument;
}

export interface ISignUpPayload {
  [key: string]: any;
  username: string;
  email: string;
  password: string;
  profilePicture?: string;
}

export interface ILoginPayload {
  [key: string]: any;
  username: string; // can be username or email
  password: string;
}

export interface IForgotPasswordPayload {
  [key: string]: any;
  email: string;
}

export interface IResetPasswordPayload {
  [key: string]: any;
  password: string;
  confirmPassword: string;
}

export interface IUpdatePasswordPayload {
  password: string;
  passwordResetToken: string;
  passwordResetTokenExpires: Date;
}

export interface IVerifyEmailPayload {
  emailVerified: boolean;
  emailVerificationToken?: string;
}

export interface IIssueTokensResponse {
  accessToken: string;
  refreshToken: string;
}

export enum Role {
  User = 'User',
  Admin = 'Admin',
  Moderator = 'Moderator'
}
