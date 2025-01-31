import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
import { UsersModule } from 'src/users/users.module';
import { AuthModule } from 'src/auth/auth.module'; // Import AuthModule

import {
  TranformationImage,
  tranformationSchema,
} from './models/transformation.schema';
import { TransformationController } from './transformation.controller';
import { TransformationService } from './transformation.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: TranformationImage.name, schema: tranformationSchema },
    ]),
    CloudinaryModule,
    forwardRef(() => UsersModule),
    forwardRef(() => AuthModule),
  ],
  providers: [TransformationService],
  controllers: [TransformationController],
  exports: [TransformationService],
})
export class TransformationModule { }