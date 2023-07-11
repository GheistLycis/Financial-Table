import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SavingsComponent } from './savings.component';
import { AddEditSavingComponent } from './components/add-edit-saving/add-edit-saving.component';
import { NgbProgressbarModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';



@NgModule({
  declarations: [
    SavingsComponent,
    AddEditSavingComponent,
  ],
  imports: [
    CommonModule,
    NgbTooltipModule,
    NgbProgressbarModule,
  ]
})
export class SavingsModule { }
