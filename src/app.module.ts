import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { AuthModule } from './auth/auth.module';
import { CloudinaryService } from './cloudinary/cloudinary.service';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { TransformationModule } from './transformation/transformation.module';
import { UsersModule } from './users/users.module';
import { FileLogger } from './lib/logger';
import { AppMiddleware } from './app.middleware';
import { configureCloudinary } from './config/cloudinary.config';
import { MailModule } from './mail/mail.module';
import { TicketModule } from './ticket/ticket.module';

@Module({
  imports: [
    AuthModule,
    CloudinaryModule,
    TransformationModule,
    UsersModule,
    CacheModule.register(),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env'
    }),
    MongooseModule.forRoot(process.env.MONGO_URI!),
    MailModule,
    TicketModule
  ],
  providers: [
    { provide: FileLogger, useClass: FileLogger },
    CloudinaryService,
    {
      provide: 'CLOUDINARY',
      useFactory: () => {
        configureCloudinary(process.env.CLOUDINARY_CLOUD_NAME!, process.env.CLOUDINARY_API_KEY!, process.env.CLOUDINARY_API_SECRET!);
      }
    }
  ],
  controllers: [],
  exports: [FileLogger]
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AppMiddleware).forRoutes('*');
  }
}
