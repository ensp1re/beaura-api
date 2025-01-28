import { IGenerativeReplace } from '@auth/interfaces/main.interface';
import { Injectable } from '@nestjs/common';
import { UploadApiErrorResponse, UploadApiResponse } from 'cloudinary';
import cloudinary from 'src/config/cloudinary.config';

@Injectable()
export class CloudinaryService {
    async uploadImage(
        file: string,
        public_id?: string,
        overwrite = false,
        invalidate = false,
    ): Promise<UploadApiResponse | UploadApiErrorResponse | undefined> {
        try {

            console.log(file, public_id, overwrite, invalidate);

            return new Promise((resolve, reject) => {
                cloudinary.uploader.upload(
                    file,
                    {
                        public_id,
                        folder: 'beaura/original',
                        overwrite,
                        invalidate,
                        resource_type: 'auto',
                    },
                    (
                        error: UploadApiErrorResponse | undefined,
                        result: UploadApiResponse | undefined,
                    ) => {
                        if (error) { return reject(error); }
                        resolve(result);
                    },
                );
            });
        } catch (error: unknown) {
            if (error instanceof Error) {
                throw new Error(`uploadImage error: ${error.message}`);
            } else {
                throw new Error(`uploadImage error: ${String(error)}`);
            }
        }
    }

    async generativeReplace({
        public_url,
        public_id,
    }: IGenerativeReplace): Promise<
        UploadApiResponse | UploadApiErrorResponse | undefined
    > {
        try {
            const replacedImage = public_url;

            console.log(replacedImage);

            // TODO: Add method when user pays nore credit for best quality

            const uploadResponse = await new Promise<
                UploadApiResponse | UploadApiErrorResponse | undefined
            >((resolve, reject) => {
                setTimeout(() => {
                    cloudinary.uploader.upload(
                        replacedImage!,
                        {
                            folder: 'beaura/replaced',
                            public_id: public_id,
                            overwrite: true,
                            resource_type: 'auto',
                        },
                        (
                            error: UploadApiErrorResponse | undefined,
                            result: UploadApiResponse | undefined,
                        ) => {
                            if (error) { return reject(error); }
                            resolve(result);
                        },
                    );
                }, 10000);
            });

            return uploadResponse;
        } catch (error: unknown) {
            if (error instanceof Error) {
                throw new Error(`generativeReplace error: ${error.message}`);
            } else {
                throw new Error(`generativeReplace error: ${String(error)}`);
            }
        }
    }
}
