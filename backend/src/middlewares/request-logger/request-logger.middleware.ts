import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';


@Injectable()
export class RequestLoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log(`
      (${req.method}) ${req.originalUrl}
      BODY: ${JSON.stringify(req.body)}
    `)
    
    next()
  }
}
