import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { env } from '../../../environment'
import { Observable } from 'rxjs';
import YearDTO from 'src/app/DTOs/year';

@Injectable({
  providedIn: 'root'
})
export class YearService {
  baseRoute = 'years'

  constructor(private http: HttpClient) {}

  list(): Observable<any>{
    return this.http.get(`${env.api}/${this.baseRoute}`)
  }

  get(id: string): Observable<any>{
    return this.http.get(`${env.api}/${this.baseRoute}/${id}`)
  }

  post(payload: YearDTO): Observable<any>{
    return this.http.post(`${env.api}/${this.baseRoute}`, payload)
  }

  put(id: string, payload: YearDTO): Observable<any>{
    return this.http.put(`${env.api}/${this.baseRoute}/${id}`, payload)
  }

  delete(id: string): Observable<any>{
    return this.http.delete(`${env.api}/${this.baseRoute}/${id}`)
  }
}
