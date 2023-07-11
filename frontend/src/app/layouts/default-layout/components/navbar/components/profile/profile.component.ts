import { Component, ViewChild } from '@angular/core';
import { FormGroup, NgForm } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import UserDTO from 'src/app/shared/DTOs/user';
import ProfileForm from 'src/app/shared/classes/UserForm';
import { SessionService } from 'src/app/shared/services/session/session.service';
import { UserService } from 'src/app/shared/services/user/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent {
  @ViewChild('formModel') formModel!: NgForm
  user!: UserDTO
  form = new ProfileForm()
  submitted = false
  
  constructor(
    protected activeModal: NgbActiveModal,
    private userService: UserService,
    private sessionService: SessionService,
  ) { }
  
  ngOnInit(): void {
    this.user = this.sessionService.getSession().user
    
    this.userService.get(this.user.id).subscribe(({ data }) => {
      this.form.name = data.name
      this.form.email = data.email
    })
  }
  
  validateForm(): void {
    this.submitted = true
    
    if(this.formModel.invalid) return
    
    this.submit()
  }
  
  submit(): void {
    this.userService.put(this.user.id, this.form).subscribe({
      next: ({ data }) => this.activeModal.close(data),
      error: () => this.activeModal.close(false)
    })
  }
  
  get f(): FormGroup['controls'] {
    return this.formModel.form.controls
  }
}
