import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddEditExpenseComponent } from './components/add-edit-expense/add-edit-expense.component';
import { PipesModule } from 'src/app/shared/pipes/pipes.module';
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
    PipesModule,
    NgSelectModule,
    FormsModule,
    NgbNavModule,
    ComponentsModule,
    NgxMaskModule,
    NgbTooltipModule,
    ComponentsModule,
  ],
  exports: [
    ExpensesComponent,
  ]
})
export class ExpensesModule { }
