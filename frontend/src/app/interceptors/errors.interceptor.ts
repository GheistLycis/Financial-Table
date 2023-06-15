import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { SessionService } from '../services/session/session.service';


@Injectable()
export class ErrorsInterceptor implements HttpInterceptor {
  warnings = [400, 403, 404, 406]
  errors = [500]
  
  constructor(
    private sessionService: SessionService,
    private toastr: ToastrService,
  ) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next
      .handle(request)
      .pipe(
        catchError(({ status, error }: HttpErrorResponse) => {
          if(status == 401) {
            this.sessionService.logout()
            location.reload()
          } 
          else if(this.warnings.includes(status)) {
            this.toastr.warning(error.error.message || '', 'Aviso')
          } 
          else if(this.errors.includes(status)) {
            this.toastr.error(error.error.message || '', 'Erro')
          }
          else {
            this.toastr.error('Ocorreu um erro inesperado no sistema. Por gentileza entrar em contato com o suporte.', '')
          }
          
          return throwError(() => new Error(error))
        })
      )
  }
}