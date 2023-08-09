import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DefaultLayoutRoutingModule } from './default-layout-routing.module';
import { DefaultLayoutComponent } from './default-layout.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';
import { PipesModule } from '@pipes/pipes.module';
import { FooterComponent } from './components/footer/footer.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { NgbCollapseModule, NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { ProfileComponent } from './components/navbar/components/profile/profile.component';
import { DeleteAccountModalComponent } from './components/navbar/components/profile/components/delete-account-modal/delete-account-modal.component';
import { OffcanvasComponent } from './components/navbar/components/offcanvas/offcanvas.component';


@NgModule({
  declarations: [
    DefaultLayoutComponent,
    NavbarComponent,
    FooterComponent,
    ProfileComponent,
    DeleteAccountModalComponent,
    OffcanvasComponent
  ],
  imports: [
    CommonModule,
    DefaultLayoutRoutingModule,
    PipesModule,
    FormsModule,
    NgSelectModule,
    NgbDropdownModule,
    NgbCollapseModule,
  ]
})
export class DefaultLayoutModule { }
