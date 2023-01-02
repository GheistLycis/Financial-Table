import { Request, Response, NextFunction } from 'express';

export function loggerMiddleware(req: Request, res: Response, next: NextFunction) {
  console.log(`
    ${req.method} - ${req.path} (${req.socket.remoteAddress})
    
    -BODY: ${req.body}
    -PARAMS: ${JSON.stringify(req.params)}
    -QUERY: ${JSON.stringify(req.query)}
  `)

  next()
}