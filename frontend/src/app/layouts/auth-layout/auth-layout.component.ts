import { Component, HostListener, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { SessionService } from 'src/app/services/session.service';

@Component({
  selector: 'app-auth-layout',
  templateUrl: './auth-layout.component.html',
  styleUrls: ['./auth-layout.component.scss']
})
export class AuthLayoutComponent {
  user!: string
  @ViewChild('btn') button

  constructor(
    private session: SessionService,
    private router: Router,
  ) {}

  login() {
    this.session.setUser(this.user)
    this.router.navigate([''])
  }

  @HostListener('document:keypress', ['$event'])
  onKeyPress(e: KeyboardEvent) {
    e.key == 'Enter' && this.button.nativeElement.click()
  }
}
