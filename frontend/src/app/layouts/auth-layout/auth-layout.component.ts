import { Component, HostListener, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { SessionService } from 'src/app/services/session/session.service';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-auth-layout',
  templateUrl: './auth-layout.component.html',
  styleUrls: ['./auth-layout.component.scss']
})
export class AuthLayoutComponent {
  user!: string
  @ViewChild('btn') button

  constructor(
    private userService: UserService,
    private session: SessionService,
    private router: Router,
  ) {}

  login() {
    this.userService.logIn(this.user).subscribe(({ data }) => {
      this.session.setUser(data.user.name)
      this.session.setToken(data.token)
      this.router.navigate([''])
    })
  }

  @HostListener('document:keypress', ['$event'])
  onKeyPress(e: KeyboardEvent) {
    e.key == 'Enter' && this.button.nativeElement.click()
  }
}
