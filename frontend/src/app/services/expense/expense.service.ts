import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import ExpenseDTO from 'src/app/DTOs/expense';
import { env } from 'src/environment';
import { Response as Res } from 'src/app/utils/interfaces/response';

@Injectable({
  providedIn: 'root'
})
export class ExpenseService {
  baseRoute = 'expenses'

  constructor(private http: HttpClient) {}

  list({ month='', category='', group='' }) {
    return this.http.get<Res<ExpenseDTO[]>>(`${env.api}/${this.baseRoute}?month=${month}&category=${category}&group=${group}`)
  }

  get(id: string) {
    return this.http.get<Res<ExpenseDTO[]>>(`${env.api}/${this.baseRoute}/${id}`)
  }

  post(payload: ExpenseDTO) {
    return this.http.post<Res<ExpenseDTO[]>>(`${env.api}/${this.baseRoute}`, payload)
  }

  put(id: string, payload: ExpenseDTO) {
    return this.http.put<Res<ExpenseDTO[]>>(`${env.api}/${this.baseRoute}/${id}`, payload)
  }

  delete(id: string) {
    return this.http.delete<Res<ExpenseDTO[]>>(`${env.api}/${this.baseRoute}/${id}`)
  }
}
