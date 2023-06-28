import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GeneralWarningComponent } from './modals/general-warning/general-warning.component';
import { AddEditExpenseComponent } from './modals/add-edit-expense/add-edit-expense.component';
import { FormsModule } from '@angular/forms';
import { FiltersComponent } from './filters/filters.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { DirectivesModule } from '../directives/directives.module';
import { NgxMaskModule } from 'ngx-mask';



@NgModule({
  declarations: [
    FiltersComponent,
    GeneralWarningComponent,
    AddEditExpenseComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    NgSelectModule,
    DirectivesModule,
    NgxMaskModule,
  ],
  exports: [
    FiltersComponent,
  ]
})
export class ComponentsModule { }
