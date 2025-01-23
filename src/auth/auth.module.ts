import { forwardRef, Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { UsersModule } from '@auth/users/users.module';

import { AuthGuard } from './guards/auth.guard';
import { RolesGuard } from './guards/role.guard';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    forwardRef(() => UsersModule),
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '7d' }
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, CloudinaryService, AuthGuard, RolesGuard],
  exports: [AuthService, JwtModule, AuthGuard, RolesGuard],
})
export class AuthModule { }
