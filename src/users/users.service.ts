import { Injectable, NotFoundException } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { hash } from 'argon2';
import { IAuthDocument, IUpdatePasswordPayload, IVerifyEmailPayload } from '@auth/interfaces/transformation.interface';
import { User } from './models.schema.ts/users.schema';

@Injectable()
export class UsersService {
    constructor(@InjectModel(User.name) private userModel: Model<User>) { }

    async createUser(data: IAuthDocument): Promise<IAuthDocument> {
        try {
            const hashedPassword = await hash(data.password!);
            const user = new this.userModel({ ...data, password: hashedPassword });

            // Save the user and then retrieve the plain object using `.lean()`
            const savedUser = await user.save();

            // Query for the user with `lean()` to get only the content
            const userData = await this.userModel
                .findById(savedUser._id)
                .lean<IAuthDocument>();

            if (!userData) {
                throw new NotFoundException('User not found');
            }
            return userData;
        } catch (error) {
            if (error instanceof Error) {
                throw new Error('createUser error: ' + error.message);
            }
            throw error;
        }
    }

    async findUserByUsername(username: string): Promise<IAuthDocument> {
        try {
            const user = await this.userModel.findOne({ username });
            if (!user) {
                throw new NotFoundException('User not found');
            }

            return user as IAuthDocument;
        } catch (error) {
            if (error instanceof Error) {
                throw new Error('findUserByUsername error: ' + error.message);
            }
            throw error;
        }
    }

    async getUserByEmailVerificationToken(
        emailVerificationToken: string,
    ): Promise<IAuthDocument> {
        try {
            const user = await this.userModel.findOne({
                emailVerificationToken,
            }).lean().exec();

            if (!user) {
                throw new NotFoundException('User not found');
            }

            return user as IAuthDocument;
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(
                    'getUserByEmailVerificationToken error: ' + error.message,
                );
            }
            throw error;
        }
    }

    async getUserByUsernameOrEmail(
        username: string,
        email: string,
    ): Promise<IAuthDocument> {
        try {

            const user = await this.userModel
                .findOne({ $or: [{ username }, { email }] })
                .lean()
                .exec();

            return user as IAuthDocument;
        } catch (error) {
            if (error instanceof Error) {
                throw new Error('getUserByUsernameOrEmail error: ' + error.message);
            }
            throw error;
        }
    }

    async getUserByEmail(email: string): Promise<IAuthDocument> {
        try {

            console.log(email);
            const user = await this.userModel
                .findOne({ email })
                .lean()
                .exec();

            return user as IAuthDocument;
        } catch (error) {
            if (error instanceof Error) {
                throw new Error('getUserByEmail error: ' + error.message);
            }
            throw error;
        }
    }

    async getUserById(id: string): Promise<IAuthDocument> {
        try {
            const user = await this.userModel.findById({
                _id: id,
            }).lean().exec();

            return user as IAuthDocument;
        } catch (error) {
            if (error instanceof Error) {
                throw new Error('getUserById error: ' + error.message);
            }
            throw error;
        }
    }

    async updateVerifyEmailField(
        userId: string,
        emailVerified: boolean,
        emailVerificationToken?: string,
    ): Promise<void> {
        try {
            const updateData: IVerifyEmailPayload = { emailVerified };
            if (emailVerificationToken) {
                updateData.emailVerificationToken = emailVerificationToken;
            }
            await this.userModel.findByIdAndUpdate(userId, updateData);
        } catch (error) {
            if (error instanceof Error) {
                throw new NotFoundException(
                    'updateVerifyEmailField error: ' + error.message,
                );
            }
            throw error;
        }
    }

    async updatePasswordResetToken(
        userId: string,
        token: string,
        tokenExpiration: Date,
    ): Promise<any> {
        try {
            const updatedUser = await this.userModel.findByIdAndUpdate(
                {
                    _id: userId,
                },
                {
                    passwordResetToken: token,
                    passwordResetTokenExpires: tokenExpiration,
                },
            );

            return {
                id: updatedUser?._id,
                passwordResetToken: token,
                passwordResetTokenExpires: tokenExpiration,
            };
        } catch (error) {
            if (error instanceof Error) {
                throw new Error('updatePasswordResetToken error: ' + error.message);
            }
            throw error;
        }
    }

    async updatePassword(userId: string, password: string): Promise<void> {
        try {
            const hashedPassword = await hash(password);

            const data: IUpdatePasswordPayload = {
                password: hashedPassword,
                passwordResetToken: '',
                passwordResetTokenExpires: new Date(),
            };
            await this.userModel.findByIdAndUpdate(userId, data);
        } catch (error) {
            if (error instanceof Error) {
                throw new Error('updatePassword error: ' + error.message);
            }
            throw error;
        }
    }

    async getUserByPasswordResetToken(token: string): Promise<IAuthDocument> {
        try {
            const user = await this.userModel
                .findOne({
                    passwordResetToken: token,
                })
                .lean()
                .exec();

            if (!user) {
                throw new NotFoundException('User not found');
            }

            return user as IAuthDocument;
        } catch (error) {
            if (error instanceof Error) {
                throw new Error('getUserByPasswordResetToken error: ' + error.message);
            }
            throw error;
        }
    }

    async updateEmailVerificationToken(
        userId: string,
        emailVerificationToken: string,
    ): Promise<void> {
        try {
            await this.userModel.updateOne(
                { _id: userId },
                { emailVerificationToken },
            );
        } catch (error) {
            if (error instanceof Error) {
                throw new Error('updateEmailVerificationToken error: ' + error.message);
            }
            throw error;
        }
    }

    async updateProfileStatus(userId: string, status: string): Promise<void> {
        try {
            await this.userModel.updateOne({ _id: userId }, { status });
        } catch (error) {
            if (error instanceof Error) {
                throw new Error('updateProfileStatus error: ' + error.message);
            }
            throw error;
        }
    }

    async deleteAccount(userId: string): Promise<void> {
        try {
            await this.userModel.findByIdAndDelete(userId);
        } catch (error) {
            if (error instanceof Error) {
                throw new Error('deleteAccount error: ' + error.message);
            }
            throw error;
        }
    }
}
