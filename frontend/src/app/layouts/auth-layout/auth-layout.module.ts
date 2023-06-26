import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthLayoutComponent } from './auth-layout.component';
import { FormsModule } from '@angular/forms';
import { AuthLayoutRoutingModule } from './auth-layout-routing.module';



@NgModule({
  declarations: [AuthLayoutComponent],
  imports: [
    CommonModule,
    AuthLayoutRoutingModule,
    FormsModule,
  ]
})
export class AuthLayoutModule { }
