import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import Session from 'src/app/shared/DTOs/session';
import UserDTO from 'src/app/shared/DTOs/user';
import { Response as Res } from 'src/app/shared/interfaces/Response';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  baseRoute = 'users'

  constructor(private http: HttpClient) {}

  list() {
    return this.http.get<Res<UserDTO[]>>(`${environment.apiUrl}/${this.baseRoute}`)
  }

  get(id: UserDTO['id']) {
    return this.http.get<Res<UserDTO>>(`${environment.apiUrl}/${this.baseRoute}/${id}`)
  }

  post(payload: UserDTO) {
    return this.http.post<Res<UserDTO>>(`${environment.apiUrl}/${this.baseRoute}`, payload)
  }

  put(id: number, payload: UserDTO) {
    return this.http.put<Res<UserDTO>>(`${environment.apiUrl}/${this.baseRoute}/${id}`, payload)
  }

  delete(id: number) {
    return this.http.delete<Res<UserDTO>>(`${environment.apiUrl}/${this.baseRoute}/${id}`)
  }
  
  logIn(name: string) {
    return this.http.post<Res<Session>>(`${environment.apiUrl}/${this.baseRoute}/login`, { name })
  }
}
