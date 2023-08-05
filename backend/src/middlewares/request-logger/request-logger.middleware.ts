import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

const PRODUCTION_MODE = process.argv.includes('NODE_ENV=production')

@Injectable()
export class RequestLoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    if(!PRODUCTION_MODE || req.originalUrl.endsWith('health-check')) {
      const { body, method, originalUrl } = req
      const loggingBody = JSON.parse(JSON.stringify(body))
  
      if('password' in body) loggingBody['password'] = '--'
      if('newPassword' in body) loggingBody['newPassword'] = '--'
  
      console.log(`
        (${method}) ${originalUrl}
        BODY: ${JSON.stringify(loggingBody)}
      `)
    }
    
    next()
  }
}
