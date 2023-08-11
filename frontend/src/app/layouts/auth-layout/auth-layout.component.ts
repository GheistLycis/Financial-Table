import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import UserForm from '@classes/UserForm';
import { SessionService } from '@services/session/session.service';
import { UserService } from '@services/user/user.service';
import { FormGroup, NgForm } from '@angular/forms';


@Component({
  selector: 'app-auth-layout',
  templateUrl: './auth-layout.component.html',
  styleUrls: ['./auth-layout.component.scss']
})
export class AuthLayoutComponent {
  @ViewChild('formModel') formModel!: NgForm
  @ViewChild('enterBtn') enterButton!: ElementRef<HTMLButtonElement>
  action: 'login' | 'signup' = 'login'
  form = new UserForm()

  constructor(
    private userService: UserService,
    private sessionService: SessionService,
    private router: Router,
    private toastr: ToastrService,
  ) {}
  
  @HostListener('document:keypress', ['$event'])
  onKeyPress(e: KeyboardEvent): void {
    e.key == 'Enter' && this.enterButton.nativeElement.click()
  }

  validateForm(): void {    
    if(this.formModel.invalid) return
    
    this.submit()
  }

  submit(): void {
    const service = this.action == 'login'
      ? this.userService.logIn(this.form)
      : this.userService.signUp(this.form)
      
    service.subscribe(({ data }) => {
      this.sessionService.setSession(data)
      this.toastr.success('', `Olá, ${data.user.name}!`)
      this.router.navigate([''])
    })
  }

  get f(): FormGroup['controls'] {
    return this.formModel.controls
  }
}
