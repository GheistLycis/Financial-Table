import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DefaultLayoutRoutingModule } from './default-layout-routing.module';
import { DefaultLayoutComponent } from './default-layout.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';
import { PipesModule } from 'src/app/shared/pipes/pipes.module';
import { FooterComponent } from './components/footer/footer.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { ProfileComponent } from './components/navbar/components/profile/profile.component';


@NgModule({
  declarations: [
    DefaultLayoutComponent,
    NavbarComponent,
    FooterComponent,
    ProfileComponent
  ],
  imports: [
    CommonModule,
    DefaultLayoutRoutingModule,
    PipesModule,
    FormsModule,
    NgSelectModule,
    NgbDropdownModule,
  ]
})
export class DefaultLayoutModule { }
