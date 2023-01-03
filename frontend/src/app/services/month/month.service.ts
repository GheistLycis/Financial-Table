import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import MonthDTO from 'src/app/DTOs/month';
import { env } from 'src/environment';
import { Response as Res } from 'src/app/utils/interfaces/response';

@Injectable({
  providedIn: 'root'
})
export class MonthService {
  baseRoute = 'months'

  constructor(private http: HttpClient) {}

  list({ year='' }) {
    return this.http.get<Res<MonthDTO[]>>(`${env.api}/${this.baseRoute}?year=${year}`)
  }

  get(id: string) {
    return this.http.get<Res<MonthDTO>>(`${env.api}/${this.baseRoute}/${id}`)
  }

  post(payload: MonthDTO) {
    return this.http.post<Res<MonthDTO>>(`${env.api}/${this.baseRoute}`, payload)
  }

  put(id: string, payload: MonthDTO) {
    return this.http.put<Res<MonthDTO>>(`${env.api}/${this.baseRoute}/${id}`, payload)
  }

  delete(id: string) {
    return this.http.delete<Res<MonthDTO>>(`${env.api}/${this.baseRoute}/${id}`)
  }
}
