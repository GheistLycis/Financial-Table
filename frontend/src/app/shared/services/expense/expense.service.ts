import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import ExpenseDTO from 'src/app/shared/DTOs/expense';
import { environment } from 'src/environments/environment';
import { Response as Res } from 'src/app/shared/interfaces/response';
import ExpenseForm from '../../classes/ExpenseForm';

@Injectable({
  providedIn: 'root'
})
export class ExpenseService {
  baseRoute = 'expenses'

  constructor(private http: HttpClient) {}

  list({ year='', month='', category='', group='' }) {
    return this.http.get<Res<ExpenseDTO[]>>(`${environment.apiUrl}/${this.baseRoute}?year=${year}&month=${month}&category=${category}&group=${group}`)
  }

  get(id: string) {
    return this.http.get<Res<ExpenseDTO>>(`${environment.apiUrl}/${this.baseRoute}/${id}`)
  }

  post(payload: ExpenseForm) {
    return this.http.post<Res<ExpenseDTO>>(`${environment.apiUrl}/${this.baseRoute}`, payload)
  }

  put(id: string, payload: ExpenseForm) {
    return this.http.put<Res<ExpenseDTO>>(`${environment.apiUrl}/${this.baseRoute}/${id}`, payload)
  }

  delete(id: string) {
    return this.http.delete<Res<ExpenseDTO>>(`${environment.apiUrl}/${this.baseRoute}/${id}`)
  }
}
