import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddEditExpenseComponent } from './components/add-edit-expense/add-edit-expense.component';
import { DirectivesModule } from 'src/app/shared/directives/directives.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';
import { NgbNavModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { ComponentsModule } from 'src/app/shared/components/components.module';
import { NgxMaskModule } from 'ngx-mask';
import { ExpensesComponent } from './expenses.component';



@NgModule({
  declarations: [
    ExpensesComponent,
    AddEditExpenseComponent,
  ],
  imports: [
    CommonModule,
    DirectivesModule,
    NgSelectModule,
    FormsModule,
    NgbNavModule,
    ComponentsModule,
    NgxMaskModule,
    NgbTooltipModule,
  ],
  exports: [
    ExpensesComponent,
  ]
})
export class ExpensesModule { }
