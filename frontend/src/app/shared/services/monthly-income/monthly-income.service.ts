import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import MonthlyIncomeDTO from 'src/app/shared/DTOs/monthlyIncome';
import { environment } from 'src/environments/environment';
import { Response as Res } from 'src/app/shared/interfaces/Response';
import MonthlyIncomeForm from '../../classes/MonthlyIncomeForm';

@Injectable({
  providedIn: 'root'
})
export class MonthlyIncomeService {
  baseRoute = 'monthly-incomes'

  constructor(private http: HttpClient) {}

  list({ month='' }) {
    return this.http.get<Res<MonthlyIncomeDTO[]>>(`${environment.apiUrl}/${this.baseRoute}?month=${month}`)
  }

  get(id: string) {
    return this.http.get<Res<MonthlyIncomeDTO>>(`${environment.apiUrl}/${this.baseRoute}/${id}`)
  }

  post(payload: MonthlyIncomeForm) {
    return this.http.post<Res<MonthlyIncomeDTO>>(`${environment.apiUrl}/${this.baseRoute}`, payload)
  }

  put(id: string, payload: MonthlyIncomeForm) {
    return this.http.put<Res<MonthlyIncomeDTO>>(`${environment.apiUrl}/${this.baseRoute}/${id}`, payload)
  }

  delete(id: string) {
    return this.http.delete<Res<MonthlyIncomeDTO>>(`${environment.apiUrl}/${this.baseRoute}/${id}`)
  }
}
