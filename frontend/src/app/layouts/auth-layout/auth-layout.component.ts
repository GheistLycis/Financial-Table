import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SessionService } from 'src/app/services/session.service';

@Component({
  selector: 'app-auth-layout',
  templateUrl: './auth-layout.component.html',
  styleUrls: ['./auth-layout.component.scss']
})
export class AuthLayoutComponent {
  user!: string

  constructor(
    private session: SessionService,
    private router: Router,
  ) {}

  login() {
    this.session.setUser(this.user)
    this.router.navigate([''])
  }
}
