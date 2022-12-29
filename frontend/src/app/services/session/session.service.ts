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
}
