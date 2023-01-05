import { Request, Response, NextFunction } from 'express';

export function loggerMiddleware(req: Request, res: Response, next: NextFunction) {
  console.time('Time to Completion')
  
  console.log(`
    (${req.method}) ${req.originalUrl}
    BODY: ${JSON.stringify(req.body)}
  `)

  res.on('finish', () => console.timeEnd('Time to Completion'))

  next()
}