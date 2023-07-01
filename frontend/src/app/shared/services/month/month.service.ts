import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import MonthDTO from 'src/app/shared/DTOs/month';
import { environment } from 'src/environments/environment';
import { Response as Res } from 'src/app/shared/interfaces/Response';
import MonthForm from '../../classes/MonthForm';

@Injectable({
  providedIn: 'root'
})
export class MonthService {
  baseRoute = 'months'

  constructor(private http: HttpClient) {}

  list({ year='' }) {
    return this.http.get<Res<MonthDTO[]>>(`${environment.apiUrl}/${this.baseRoute}?year=${year}`)
  }

  get(id: string) {
    return this.http.get<Res<MonthDTO>>(`${environment.apiUrl}/${this.baseRoute}/${id}`)
  }

  post(payload: MonthForm) {
    return this.http.post<Res<MonthDTO>>(`${environment.apiUrl}/${this.baseRoute}`, payload)
  }

  put(id: string, payload: MonthForm) {
    return this.http.put<Res<MonthDTO>>(`${environment.apiUrl}/${this.baseRoute}/${id}`, payload)
  }

  delete(id: string) {
    return this.http.delete<Res<MonthDTO>>(`${environment.apiUrl}/${this.baseRoute}/${id}`)
  }
}
