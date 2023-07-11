import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import Session from 'src/app/shared/DTOs/session';
import UserDTO from 'src/app/shared/DTOs/user';
import { Response as Res } from 'src/app/shared/interfaces/Response';
import { environment } from 'src/environments/environment';
import UserForm from '../../classes/UserForm';

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

  put(id: UserDTO['id'], payload: UserForm) {
    return this.http.put<Res<UserDTO>>(`${environment.apiUrl}/${this.baseRoute}/${id}`, payload)
  }

  delete(id: UserDTO['id']) {
    return this.http.delete<Res<UserDTO>>(`${environment.apiUrl}/${this.baseRoute}/${id}`)
  }
  
  signUp(payload: UserForm) {
    return this.http.post<Res<Session>>(`${environment.apiUrl}/${this.baseRoute}/signup`, payload)
  }
  
  logIn({ email, password }: UserForm) {
    return this.http.post<Res<Session>>(`${environment.apiUrl}/${this.baseRoute}/login`, { email, password })
  }
  
  resetPassword(email: string) {
    return this.http.post<Res<any>>(`${environment.apiUrl}/${this.baseRoute}/reset-password`, { email })
  }
}
