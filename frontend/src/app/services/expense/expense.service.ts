import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import ExpenseDTO from 'src/app/DTOs/expense';
import { env } from 'src/environment';

@Injectable({
  providedIn: 'root'
})
export class ExpenseService {
  baseRoute = 'expenses'

  constructor(private http: HttpClient) {}

  list(group: string = ''): Observable<any>{
    return this.http.get(`${env.api}/${this.baseRoute}?group=${group}`)
  }

  get(id: string): Observable<any>{
    return this.http.get(`${env.api}/${this.baseRoute}/${id}`)
  }

  post(payload: ExpenseDTO): Observable<any>{
    return this.http.post(`${env.api}/${this.baseRoute}`, payload)
  }

  put(id: string, payload: ExpenseDTO): Observable<any>{
    return this.http.put(`${env.api}/${this.baseRoute}/${id}`, payload)
  }

  delete(id: string): Observable<any>{
    return this.http.delete(`${env.api}/${this.baseRoute}/${id}`)
  }
}
