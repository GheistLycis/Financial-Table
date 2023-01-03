import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import MonthlyEntryDTO from 'src/app/DTOs/monthlyEntry';
import { env } from 'src/environment';
import { Response as Res } from 'src/app/utils/interfaces/response';

@Injectable({
  providedIn: 'root'
})
export class MonthlyEntryService {
  baseRoute = 'monthly-entries'

  constructor(private http: HttpClient) {}

  list({ month='' }) {
    return this.http.get<Res<MonthlyEntryDTO[]>>(`${env.api}/${this.baseRoute}?month=${month}`)
  }

  get(id: string) {
    return this.http.get<Res<MonthlyEntryDTO>>(`${env.api}/${this.baseRoute}/${id}`)
  }

  post(payload: MonthlyEntryDTO) {
    return this.http.post<Res<MonthlyEntryDTO>>(`${env.api}/${this.baseRoute}`, payload)
  }

  put(id: string, payload: MonthlyEntryDTO) {
    return this.http.put<Res<MonthlyEntryDTO>>(`${env.api}/${this.baseRoute}/${id}`, payload)
  }

  delete(id: string) {
    return this.http.delete<Res<MonthlyEntryDTO>>(`${env.api}/${this.baseRoute}/${id}`)
  }
}
