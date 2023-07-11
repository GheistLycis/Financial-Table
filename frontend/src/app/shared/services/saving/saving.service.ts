import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Response as Res } from 'src/app/shared/interfaces/Response';
import SavingDTO from '../../DTOs/SavingDTO';
import SavingForm from '../../classes/SavingForm';

@Injectable({
  providedIn: 'root'
})
export class SavingService {
  baseRoute = 'savings'

  constructor(private http: HttpClient) {}

  list() {
    return this.http.get<Res<SavingDTO[]>>(`${environment.apiUrl}/${this.baseRoute}`)
  }

  get(id: SavingDTO['id']) {
    return this.http.get<Res<SavingDTO>>(`${environment.apiUrl}/${this.baseRoute}/${id}`)
  }

  post(payload: SavingForm) {
    return this.http.post<Res<SavingDTO>>(`${environment.apiUrl}/${this.baseRoute}`, payload)
  }

  put(id: SavingDTO['id'], payload: SavingForm) {
    return this.http.put<Res<SavingDTO>>(`${environment.apiUrl}/${this.baseRoute}/${id}`, payload)
  }

  delete(id: SavingDTO['id']) {
    return this.http.delete<Res<SavingDTO>>(`${environment.apiUrl}/${this.baseRoute}/${id}`)
  }
}
