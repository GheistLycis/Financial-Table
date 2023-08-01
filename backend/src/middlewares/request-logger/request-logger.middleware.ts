import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';


@Injectable()
export class RequestLoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const { body, method, originalUrl } = req
    const loggingBody = JSON.parse(JSON.stringify(body))

    if('password' in body) loggingBody['password'] = '--'
    if('newPassword' in body) loggingBody['newPassword'] = '--'

    console.log(`
      (${method}) ${originalUrl}
      BODY: ${JSON.stringify(loggingBody)}
    `)
    
    next()
  }
}
