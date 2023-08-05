import { Injectable } from '@angular/core';
import Session from '../../DTOs/session';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class SessionService {
  constructor(
    private router: Router
  ) { }

  getSession(): Session | null {
    const session = localStorage.getItem('session')
    
    return JSON.parse(session)
  }

  setSession(session: Session): void {
    localStorage.setItem('session', JSON.stringify(session))
  }
  
  logout(): void {
    localStorage.removeItem('session')

    this.router.navigate(['login'])
  }
}
