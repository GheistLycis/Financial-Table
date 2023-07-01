import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MonthsComponent } from './months.component';
import { AddEditMonthComponent } from './components/add-edit-month/add-edit-month.component';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';



@NgModule({
  declarations: [
    MonthsComponent,
    AddEditMonthComponent,
  ],
  imports: [
    CommonModule,
    NgbNavModule,
    FormsModule,
    NgSelectModule,
  ]
})
export class MonthsModule { }
