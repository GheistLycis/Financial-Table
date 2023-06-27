import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SessionService {
  constructor() { }

  // USER
  getUser(): string | null {
    return localStorage.getItem('user')
  }

  setUser(user: string): void {
    localStorage.setItem('user', user)
  }
  
  logout(): void {
    localStorage.removeItem('user')
  }
  
  // TOKEN
  getToken(): string | null {
    return localStorage.getItem('token')
  }

  setToken(token: string): void {
    localStorage.setItem('token', token)
  }
}
