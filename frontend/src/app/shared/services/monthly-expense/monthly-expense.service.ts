import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import MonthlyExpenseDTO from 'src/app/shared/DTOs/monthlyExpense';
import { environment } from 'src/environments/environment';
import { Response as Res } from 'src/app/shared/interfaces/response';

@Injectable({
  providedIn: 'root'
})
export class MonthlyExpenseService {
  baseRoute = 'monthly-expenses'

  constructor(private http: HttpClient) {}

  list({ month='' }) {
    return this.http.get<Res<MonthlyExpenseDTO[]>>(`${environment.apiUrl}/${this.baseRoute}?month=${month}`)
  }

  get(id: string) {
    return this.http.get<Res<MonthlyExpenseDTO>>(`${environment.apiUrl}/${this.baseRoute}/${id}`)
  }

  post(payload: MonthlyExpenseDTO) {
    return this.http.post<Res<MonthlyExpenseDTO>>(`${environment.apiUrl}/${this.baseRoute}`, payload)
  }

  put(id: string, payload: MonthlyExpenseDTO) {
    return this.http.put<Res<MonthlyExpenseDTO>>(`${environment.apiUrl}/${this.baseRoute}/${id}`, payload)
  }

  delete(id: string) {
    return this.http.delete<Res<MonthlyExpenseDTO>>(`${environment.apiUrl}/${this.baseRoute}/${id}`)
  }
}
