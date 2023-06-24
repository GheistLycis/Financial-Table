import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import YearDTO from 'src/app/DTOs/year';
import { Response as Res } from 'src/app/utils/interfaces/response';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class YearService {
  baseRoute = 'years'

  constructor(private http: HttpClient) {}

  list() {
    return this.http.get<Res<YearDTO[]>>(`${environment.apiUrl}/${this.baseRoute}`)
  }

  get(id: string) {
    return this.http.get<Res<YearDTO>>(`${environment.apiUrl}/${this.baseRoute}/${id}`)
  }

  post(payload: YearDTO) {
    return this.http.post<Res<YearDTO>>(`${environment.apiUrl}/${this.baseRoute}`, payload)
  }

  put(id: string, payload: YearDTO) {
    return this.http.put<Res<YearDTO>>(`${environment.apiUrl}/${this.baseRoute}/${id}`, payload)
  }

  delete(id: string) {
    return this.http.delete<Res<YearDTO>>(`${environment.apiUrl}/${this.baseRoute}/${id}`)
  }
}
