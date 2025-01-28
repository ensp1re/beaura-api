import { Module, forwardRef } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { UsersModule } from 'src/users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
import { UsersService } from 'src/users/users.service';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

import {
  TranformationImage,
  tranformationSchema,
} from './models/transformation.schema';
import { TransformationController } from './transformation.controller';
import { TransformationService } from './transformation.service';

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
export class TransformationModule { }
