import { Component, ViewChild, Output, EventEmitter, ElementRef, OnInit, AfterViewInit } from '@angular/core';
import { FormGroup, NgForm } from '@angular/forms';
import UserDTO from 'src/app/shared/DTOs/user';
import ProfileForm from 'src/app/shared/classes/UserForm';
import { SessionService } from 'src/app/shared/services/session/session.service';
import { UserService } from 'src/app/shared/services/user/user.service';

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
  form = new ProfileForm()
  submitted = false
  
  constructor(
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
  
  ngAfterViewInit(): void {
    this.nameInput.nativeElement.addEventListener('keyup', e => e.key == 'Enter' && this.nameInput.nativeElement.blur())
  }
  
  validateForm(): void {
    this.submitted = true
    
    if(this.formModel.invalid) return
    
    this.submit()
  }
  
  submit(): void {
    this.userService.put(this.user.id, this.form).subscribe(({ data }) => this.profileUpdated.emit(data))
  }
  
  get f(): FormGroup['controls'] {
    return this.formModel.form.controls
  }
}
