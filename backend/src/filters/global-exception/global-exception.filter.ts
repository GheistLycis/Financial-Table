import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { Request, Response } from 'express';
import GlobalException from '@classes/GlobalException';


const warnings = [400, 401, 403, 404, 406]

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: GlobalException | Error, host: ArgumentsHost) {
    const { method, originalUrl, body } = host.switchToHttp().getRequest<Request>()
    const res = host.switchToHttp().getResponse<Response>()
    const status = exception instanceof GlobalException ? exception.status : 500
    const errorType = warnings.includes(status) ? 'W' : 'E'
    const time = new Date().toLocaleDateString('pt-BR', { hour: '2-digit', minute: '2-digit' })

    if('password' in body) body['password'] = '--'
    if('newPassword' in body) body['newPassword'] = '--'
    
    console.log(`
      (${errorType}-${status}) 
      ${method} - ${originalUrl}
      ${time}
      MESSAGE: ${exception.message}
      BODY: ${JSON.stringify(body)}
    `)
    
    res.status(status).json({ message: exception.message })
  }
}
