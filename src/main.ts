/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable import/no-named-as-default */
import { NestFactory } from '@nestjs/core';
import cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';
import rateLimit from 'express-rate-limit';
import express, { NextFunction, Request, Response } from 'express';
import compression from 'compression';
import helmet from 'helmet';
import cookieSession from 'cookie-session';
import { DocumentBuilder, SwaggerCustomOptions, SwaggerModule } from '@nestjs/swagger';

import { FileLogger } from './lib/logger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: new FileLogger(),
  });

  console.log(`App is running in ${process.env.NODE_ENV} mode`);

  app.setGlobalPrefix('api');

  const fileLogger = await app.resolve<FileLogger>(FileLogger);
  app.useLogger(fileLogger);

  app.use(cookieParser());

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: 'Too many requests from this IP, please try again after 15 minutes',
  });

  app.use((req: Request, res: Response, next: NextFunction) => {
    limiter(req, res, () => {
      const helmet = require('helmet');

      helmet()(req, res, () => {
        res.setHeader('X-Content-Type-Options', 'nosniff');
        res.setHeader('X-Frame-Options', 'DENY');
        res.setHeader('X-XSS-Protection', '1; mode=block');
        res.setHeader(
          'Strict-Transport-Security',
          'max-age=31536000; includeSubDomains',
        );
        res.setHeader('Content-Security-Policy', 'default-src \'self\'');

        next();
      });
    });
  });

  app.use(compression());
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({
    extended
      : true, limit: '10mb'
  }));
  app.use(helmet());

  app.use(
    cookieSession({
      name: 'session',
      keys: [`${process.env.SECRET_KEY_ONE}`, `${process.env.SECRET_KEY_TWO}`],
      maxAge: 24 * 60 * 60 * 1000,
      secure: process.env.NODE_ENV === 'production',
      ...(process.env.NODE_ENV === 'production' && { sameSite: 'none' }),
    })
  );

  // that's the middleware that will check if the user has a refresh token
  // delete after testing
  app.use((req: Request, _res: Response, next: NextFunction) => {
    if (req.cookies?.refreshToken) {
      req.headers.authorization = `Bearer ${req.cookies.refreshToken}`;
    }
    next();
  });

  
  app.enableCors({
    origin: process.env.BASE_URL || 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    credentials: true,
  });

  const configSwagger = new DocumentBuilder().setTitle('Api for Beaura AI')
    .setDescription('This is the API for Beaura AI')
    .setVersion('1.0')
    .addTag('beaura')
    .addCookieAuth('refreshToken')
    .build();

  app.use((_req: Request, res: Response, next: NextFunction) => {
    res.setHeader('Cross-Origin-Opener-Policy', 'same-origin-allow-popups');
    res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');
    next();
  });

  const customOptions: SwaggerCustomOptions = {
    swaggerOptions: {
      withCredentials: true,
    }
  };

  const document = SwaggerModule.createDocument(app, configSwagger);
  SwaggerModule.setup('api/docs', app, document, customOptions);

  await app.listen(process.env.PORT ?? 3000);
  fileLogger.log(`Application is running on: ${await app.getUrl()}`, 'Main.ts');

}
bootstrap();
