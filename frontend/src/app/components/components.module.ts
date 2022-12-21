import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NavbarComponent } from './navbar/navbar.component';
import { FooterComponent } from './footer/footer.component';
import { SharedModule } from '../utils/shared/shared.module';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [
    NavbarComponent, 
    FooterComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule,
  ],
  exports: [
    NavbarComponent, 
    FooterComponent,
  ]
})
export class ComponentsModule { }
