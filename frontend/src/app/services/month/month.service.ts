import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import MonthDTO from 'src/app/DTOs/month';
import { env } from 'src/environment';

@Injectable({
  providedIn: 'root'
})
export class MonthService {
  baseRoute = 'months'

  constructor(private http: HttpClient) {}

  list(year: string = ''): Observable<any>{
    return this.http.get(`${env.api}/${this.baseRoute}?year=${year}`)
  }

  get(id: string): Observable<any>{
    return this.http.get(`${env.api}/${this.baseRoute}/${id}`)
  }

  post(payload: MonthDTO): Observable<any>{
    return this.http.post(`${env.api}/${this.baseRoute}`, payload)
  }

  put(id: string, payload: MonthDTO): Observable<any>{
    return this.http.put(`${env.api}/${this.baseRoute}/${id}`, payload)
  }

  delete(id: string): Observable<any>{
    return this.http.delete(`${env.api}/${this.baseRoute}/${id}`)
  }
}
