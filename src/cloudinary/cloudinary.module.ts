import { Module } from '@nestjs/common';
import { CloudinaryService } from './cloudinary.service';
import { configureCloudinary } from '@auth/config/cloudinary.config';

@Module({
    providers: [
        CloudinaryService,
        {
            provide: 'CLOUDINARY',
            useFactory: () => {
                configureCloudinary(
                    process.env.CLOUDINARY_CLOUD_NAME!,
                    process.env.CLOUDINARY_API_KEY!,
                    process.env.CLOUDINARY_API_SECRET!,
                );
            },
        }
    ],
    exports: [CloudinaryService],
})
export class CloudinaryModule {
}
