import { Injectable } from '@angular/core';
import Session from '../../DTOs/session';

@Injectable({
  providedIn: 'root'
})
export class SessionService {
  constructor() { }

  getSession(): Session | null {
    const session = localStorage.getItem('session')
    
    return JSON.parse(session)
  }

  setSession(session: Session): void {
    localStorage.setItem('session', JSON.stringify(session))
  }
  
  logout(): void {
    localStorage.removeItem('session')
  }
}
