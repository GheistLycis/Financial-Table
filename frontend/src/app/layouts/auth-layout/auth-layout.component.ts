import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import UserForm from 'src/app/shared/classes/UserForm';
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
  user = new UserForm()

  constructor(
    private userService: UserService,
    private sessionService: SessionService,
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
      this.sessionService.setSession(data)
      this.toastr.success('', `Olá, ${data.user.name}!`)
      this.router.navigate([''])
    })
  }
}
