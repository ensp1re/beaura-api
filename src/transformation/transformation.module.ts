import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { UsersModule } from 'src/users/users.module';
import { TransformationService } from './transformation.service';
import { TransformationController } from './transformation.controller';
import { forwardRef } from '@nestjs/common';
import {
  TranformationImage,
  tranformationSchema,
} from './models/transformation.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
import { UsersService } from 'src/users/users.service';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@Module({
  exports: [TransformationService],
  providers: [TransformationService, UsersService, CloudinaryService],
  controllers: [TransformationController],
  imports: [
    forwardRef(() => AuthModule),
    forwardRef(() => UsersModule),
    forwardRef(() => CloudinaryModule),

    MongooseModule.forFeature([
      { name: TranformationImage.name, schema: tranformationSchema },
    ]),
  ],
})
export class TransformationModule {}
