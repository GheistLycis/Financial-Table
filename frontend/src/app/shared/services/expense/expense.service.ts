import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import ExpenseDTO from 'src/app/shared/DTOs/expense';
import { environment } from 'src/environments/environment';
import { Response as Res } from 'src/app/shared/interfaces/Response';
import ExpenseForm from '../../classes/ExpenseForm';
import { queryMaker } from '../queryMaker';
import YearDTO from '../../DTOs/year';
import MonthDTO from '../../DTOs/month';
import CategoryDTO from '../../DTOs/category';
import GroupDTO from '../../DTOs/group';

@Injectable({
  providedIn: 'root'
})
export class ExpenseService {
  baseRoute = 'expenses'

  constructor(private http: HttpClient) {}

  list(query: { year?: YearDTO['id'], month?: MonthDTO['id'], category?: CategoryDTO['id'], group?: GroupDTO['id'] }) {
    return this.http.get<Res<ExpenseDTO[]>>(`${environment.apiUrl}/${this.baseRoute}?${queryMaker(query)}`)
  }

  get(id: number) {
    return this.http.get<Res<ExpenseDTO>>(`${environment.apiUrl}/${this.baseRoute}/${id}`)
  }

  post(payload: ExpenseForm) {
    return this.http.post<Res<ExpenseDTO>>(`${environment.apiUrl}/${this.baseRoute}`, payload)
  }

  put(id: number, payload: ExpenseForm) {
    return this.http.put<Res<ExpenseDTO>>(`${environment.apiUrl}/${this.baseRoute}/${id}`, payload)
  }

  delete(id: number) {
    return this.http.delete<Res<ExpenseDTO>>(`${environment.apiUrl}/${this.baseRoute}/${id}`)
  }
}
