import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import MonthDTO from 'src/app/shared/DTOs/month';
import { environment } from 'src/environments/environment';
import { Response as Res } from 'src/app/shared/interfaces/Response';
import MonthForm from '../../classes/MonthForm';
import MonthDuplicationForm from '../../classes/MonthDuplicationForm';
import { queryMaker } from '../queryMaker';
import YearDTO from '../../DTOs/year';

@Injectable({
  providedIn: 'root'
})
export class MonthService {
  baseRoute = 'months'

  constructor(private http: HttpClient) {}

  list(query: { year?: YearDTO['id'] }) {
    return this.http.get<Res<MonthDTO[]>>(`${environment.apiUrl}/${this.baseRoute}?${queryMaker(query)}`)
  }

  get(id: number) {
    return this.http.get<Res<MonthDTO>>(`${environment.apiUrl}/${this.baseRoute}/${id}`)
  }

  post(payload: MonthForm) {
    return this.http.post<Res<MonthDTO>>(`${environment.apiUrl}/${this.baseRoute}`, payload)
  }

  put(id: number, payload: MonthForm) {
    return this.http.put<Res<MonthDTO>>(`${environment.apiUrl}/${this.baseRoute}/${id}`, payload)
  }

  delete(id: number) {
    return this.http.delete<Res<MonthDTO>>(`${environment.apiUrl}/${this.baseRoute}/${id}`)
  }
  
  duplicate(id: number, payload: MonthDuplicationForm) {
    return this.http.post<Res<MonthDTO>>(`${environment.apiUrl}/${this.baseRoute}/duplicate/${id}`, payload)
  }
}
