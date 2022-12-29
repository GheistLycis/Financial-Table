import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import MonthlyEntryDTO from 'src/app/DTOs/monthlyEntry';
import { env } from 'src/environment';

@Injectable({
  providedIn: 'root'
})
export class MonthlyEntryService {
  baseRoute = 'monthly-entries'

  constructor(private http: HttpClient) {}

  list(month: string = ''): Observable<any>{
    return this.http.get(`${env.api}/${this.baseRoute}?month=${month}`)
  }

  get(id: string): Observable<any>{
    return this.http.get(`${env.api}/${this.baseRoute}/${id}`)
  }

  post(payload: MonthlyEntryDTO): Observable<any>{
    return this.http.post(`${env.api}/${this.baseRoute}`, payload)
  }

  put(id: string, payload: MonthlyEntryDTO): Observable<any>{
    return this.http.put(`${env.api}/${this.baseRoute}/${id}`, payload)
  }

  delete(id: string): Observable<any>{
    return this.http.delete(`${env.api}/${this.baseRoute}/${id}`)
  }
}
