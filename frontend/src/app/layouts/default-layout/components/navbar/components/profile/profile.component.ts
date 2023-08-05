import { Component, ViewChild, Output, EventEmitter, ElementRef, OnInit, AfterViewInit } from '@angular/core';
import { FormGroup, NgForm } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import UserDTO from 'src/app/shared/DTOs/user';
import UserForm from 'src/app/shared/classes/UserForm';
import { SessionService } from 'src/app/shared/services/session/session.service';
import { UserService } from 'src/app/shared/services/user/user.service';
import { DeleteAccountModalComponent } from './components/delete-account-modal/delete-account-modal.component';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit, AfterViewInit {
  @ViewChild('formModel') formModel!: NgForm
  @ViewChild('nameInput') nameInput!: ElementRef<HTMLInputElement>
  @Output() profileUpdated = new EventEmitter<UserDTO>()
  user!: UserDTO
  form = new UserForm()
  submitted = false
  submittedPassword = false
  resetPassword = false
  
  constructor(
    private userService: UserService,
    private sessionService: SessionService,
    private toastr: ToastrService,
    private modalService: NgbModal,
  ) { }
  
  ngOnInit(): void {
    this.user = this.sessionService.getSession().user
    
    this.userService.get(this.user.id).subscribe(({ data }) => {
      this.form.name = data.name
      this.form.email = data.email
    })
  }
  
  ngAfterViewInit(): void {
    this.nameInput.nativeElement.addEventListener('keyup', e => e.key == 'Enter' && this.nameInput.nativeElement.blur())
  }
  
  validateForm(update: 'name' | 'password'): void {
    if(update == 'name') {
      this.submitted = true
      
      if(this.f['name'].invalid) return
    }
    else {
      this.submittedPassword = true
      
      if(this.f['password'].invalid || this.f['newPassword'].invalid) return
    }
    
    this.submit(update)
  }
  
  submit(update: 'name' | 'password'): void {
    if(update == 'password') {
      this.userService.resetPassword(this.user.id, { 
        password: this.form.password, 
        newPassword: this.form.newPassword 
      }).subscribe(({ message }) => this.toastr.success(message))
    }
    else {
      this.userService.put(this.user.id, { 
        name: this.form.name 
      }).subscribe(({ data }) => this.profileUpdated.emit(data))
    }
  }

  deleteAccount(): void {
    const { result } = this.modalService.open(DeleteAccountModalComponent, { size: 'md' })

    result.then((res: boolean) => {
      if(res) {
        const { id } = this.sessionService.getSession().user

        this.userService.delete(id).subscribe(() => {
          this.toastr.info('Obrigado por usar a plataforma!', 'Até mais!')
          this.sessionService.logout()
        })
      }
    })
  }
  
  get f(): FormGroup['controls'] {
    return this.formModel.form.controls
  }
}
