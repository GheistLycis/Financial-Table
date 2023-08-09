import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import YearDTO from '@DTOs/year';
import { Response as Res } from '@interfaces/Response';
import { environment } from 'src/environments/environment';
import YearForm from '../../classes/YearForm';

@Injectable({
  providedIn: 'root'
})
export class YearService {
  baseRoute = 'years'

  constructor(private http: HttpClient) {}

  list() {
    return this.http.get<Res<YearDTO[]>>(`${environment.apiUrl}/${this.baseRoute}`)
  }

  get(id: YearDTO['id']) {
    return this.http.get<Res<YearDTO>>(`${environment.apiUrl}/${this.baseRoute}/${id}`)
  }

  post(payload: YearForm) {
    return this.http.post<Res<YearDTO>>(`${environment.apiUrl}/${this.baseRoute}`, payload)
  }

  put(id: number, payload: YearForm) {
    return this.http.put<Res<YearDTO>>(`${environment.apiUrl}/${this.baseRoute}/${id}`, payload)
  }

  delete(id: number) {
    return this.http.delete<Res<YearDTO>>(`${environment.apiUrl}/${this.baseRoute}/${id}`)
  }
}
