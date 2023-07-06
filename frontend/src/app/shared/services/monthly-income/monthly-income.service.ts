import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import MonthlyIncomeDTO from 'src/app/shared/DTOs/monthlyIncome';
import { environment } from 'src/environments/environment';
import { Response as Res } from 'src/app/shared/interfaces/Response';
import MonthlyIncomeForm from '../../classes/MonthlyIncomeForm';
import { queryMaker } from '../queryMaker';
import MonthDTO from '../../DTOs/month';

@Injectable({
  providedIn: 'root'
})
export class MonthlyIncomeService {
  baseRoute = 'monthly-incomes'

  constructor(private http: HttpClient) {}

  list(query: { month?: MonthDTO['id'] }) {
    return this.http.get<Res<MonthlyIncomeDTO[]>>(`${environment.apiUrl}/${this.baseRoute}?${queryMaker(query)}`)
  }

  get(id: MonthlyIncomeDTO['id']) {
    return this.http.get<Res<MonthlyIncomeDTO>>(`${environment.apiUrl}/${this.baseRoute}/${id}`)
  }

  post(payload: MonthlyIncomeForm) {
    return this.http.post<Res<MonthlyIncomeDTO>>(`${environment.apiUrl}/${this.baseRoute}`, payload)
  }

  put(id: number, payload: MonthlyIncomeForm) {
    return this.http.put<Res<MonthlyIncomeDTO>>(`${environment.apiUrl}/${this.baseRoute}/${id}`, payload)
  }

  delete(id: number) {
    return this.http.delete<Res<MonthlyIncomeDTO>>(`${environment.apiUrl}/${this.baseRoute}/${id}`)
  }
}
