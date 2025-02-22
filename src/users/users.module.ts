import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from 'src/auth/auth.module';
import { TransformationModule } from 'src/transformation/transformation.module';
import { CloudinaryService } from '@auth/cloudinary/cloudinary.service';

import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User, UserSchema } from './models.schema.ts/users.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    forwardRef(() => AuthModule),
    forwardRef(() => TransformationModule)
  ],
  providers: [UsersService, CloudinaryService],
  controllers: [UsersController],
  exports: [UsersService, MongooseModule]
})
export class UsersModule {}
