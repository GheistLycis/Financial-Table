import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import AuthPayload from 'src/app/shared/interfaces/AuthPayload';
import { SessionService } from 'src/app/shared/services/session/session.service';
import { UserService } from 'src/app/shared/services/user/user.service';


@Component({
  selector: 'app-auth-layout',
  templateUrl: './auth-layout.component.html',
  styleUrls: ['./auth-layout.component.scss']
})
export class AuthLayoutComponent {
  @ViewChild('loginBtn') loginButton!: ElementRef<HTMLButtonElement>
  action: 'login' | 'signup' = 'login'
  user: AuthPayload = { name: undefined, email: undefined, password: undefined }

  constructor(
    private userService: UserService,
    private session: SessionService,
    private router: Router,
    private toastr: ToastrService,
  ) {}
  
  @HostListener('document:keypress', ['$event'])
  onKeyPress(e: KeyboardEvent) {
    e.key == 'Enter' && this.loginButton.nativeElement.click()
  }

  enter(action: typeof this.action) {
    const service = action == 'login'
      ? this.userService.logIn(this.user)
      : this.userService.signUp(this.user)
      
    service.subscribe(({ data }) => {
      this.session.setUser(data.user.name)
      this.session.setToken(data.token)
      this.toastr.info('', `Olá, ${data.user.name}!`)
      this.router.navigate([''])
    })
  }
}
