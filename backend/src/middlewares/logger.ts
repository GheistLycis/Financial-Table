import { Request, Response, NextFunction } from 'express';

export function loggerMiddleware(req: Request, res: Response, next: NextFunction) {
  let queries: any = ''

  if(JSON.stringify(req.query) != '{}') {
    queries = []

    for(let q in req.query) queries.push(`${q}=${req.query[q]}`)

    queries = '?' + queries.join('&')
  }

  console.log(`
    (${req.method}) ${req.path}${queries}
    BODY: ${req.body}
  `)

  next()
}