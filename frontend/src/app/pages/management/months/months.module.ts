import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MonthsComponent } from './months.component';
import { AddEditMonthComponent } from './components/add-edit-month/add-edit-month.component';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';



@NgModule({
  declarations: [
    MonthsComponent,
    AddEditMonthComponent,
  ],
  imports: [
    CommonModule,
    NgbNavModule,
  ]
})
export class MonthsModule { }
