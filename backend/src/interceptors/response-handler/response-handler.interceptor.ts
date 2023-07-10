import { CallHandler, ExecutionContext, HttpException, Injectable, NestInterceptor } from '@nestjs/common';
import { Request, Response } from 'express';
import { Observable, catchError, throwError, map } from 'rxjs';
import GlobalException, { isInstanceOfGlobalException } from 'src/shared/interfaces/GlobalException';
import GlobalResponse from 'src/shared/interfaces/GlobalResponse';


const warnings = [400, 401, 403, 404, 406]

@Injectable()
export class ResponseHandlerInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const { method, originalUrl, body } = context.switchToHttp().getRequest<Request>()
    const res = context.switchToHttp().getResponse<Response>()
    
    return next
      .handle()
      .pipe(
        catchError((error: GlobalException | Error) => {
          const status = isInstanceOfGlobalException(error) ? error.status : 500
          const errorType = warnings.includes(status) ? 'W' : 'E'
          const time = new Date().toLocaleDateString('pt-BR', { hour: '2-digit', minute: '2-digit' })
        
          console.log(`
            (${errorType}-${status}) 
            ${method} - ${originalUrl}
            ${time}
            MESSAGE: ${error.message}
            BODY: ${JSON.stringify(body)}
          `)
          
          return throwError(() => new HttpException({ message: error.message }, status))
        }),
        map(({ data=null, message='', status=200 }: GlobalResponse) => {
          res.status(status).json({ data, message })
        })
      )
  }
}
