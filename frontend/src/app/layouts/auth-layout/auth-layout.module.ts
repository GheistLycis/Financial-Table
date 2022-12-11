import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthLayoutComponent } from './auth-layout.component';
import { FormsModule } from '@angular/forms';
import { AuthLayoutRoutingModule } from './auth-layout-routing.module';
import { ComponentsModule } from 'src/app/components/components.module';



@NgModule({
  declarations: [AuthLayoutComponent],
  imports: [
    CommonModule,
    AuthLayoutRoutingModule,
    ComponentsModule,
    FormsModule,
  ]
})
export class AuthLayoutModule { }
