import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SessionService {
  constructor() { }

  isLoggedIn(): boolean {
    return Boolean(localStorage.getItem('email'))
  }
}
