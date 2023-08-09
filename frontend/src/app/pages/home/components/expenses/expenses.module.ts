import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddEditExpenseComponent } from './components/add-edit-expense/add-edit-expense.component';
import { PipesModule } from '@pipes/pipes.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';
import { NgbNavModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxMaskModule } from 'ngx-mask';
import { ExpensesComponent } from './expenses.component';
import { DirectivesModule } from '@directives/directives.module';
import { FiltersComponent } from '@components/filters/filters.component';
import { TooltipComponent } from '@components/tooltip/tooltip.component';



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
    NgxMaskModule,
    NgbTooltipModule,
    DirectivesModule,
    FiltersComponent,
    TooltipComponent,
  ],
  exports: [
    ExpensesComponent,
  ]
})
export class ExpensesModule { }
