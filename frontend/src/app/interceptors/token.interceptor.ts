import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { SessionService } from '../services/session/session.service';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
    constructor(private sessionService: SessionService) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const user = this.sessionService.getUser()
        const token = user && this.sessionService.getToken()
        const isApiUrl = request.url.startsWith(environment.apiUrl)

        if(token && isApiUrl) {
            request = request.clone({
                setHeaders: {
                    Authorization: `Bearer ${token}`
                }
            })
        }

        return next.handle(request)
    }
}