import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { SessionService } from '../shared/services/session/session.service';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
    constructor(private sessionService: SessionService) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const token = this.sessionService.getSession()?.token || null
        const isApiUrl = request.url.startsWith(environment.apiUrl)

        if(isApiUrl) {
            request = request.clone({
                setHeaders: {
                    Authorization: `Bearer ${token}`
                }
            })
        }

        return next.handle(request)
    }
}