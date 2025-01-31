import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request } from 'express';

import { FileLogger } from './lib/logger';

@Injectable()
export class AppMiddleware implements NestMiddleware {
  constructor(private readonly fileLogger: FileLogger) { }
  use(req: Request, _res: unknown, next: () => void) {
    const ip: string | undefined =
      (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress;

    const requestSingle: string = `Request from IP: ${ip} - Method: ${req.method} - URL: ${req.originalUrl}`;

    this.fileLogger.log(requestSingle, 'AppMiddleware');
    next();
  }
}
