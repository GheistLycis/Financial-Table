import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddEditExpenseComponent } from './components/add-edit-expense/add-edit-expense.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';
import { NgbNavModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxMaskModule } from 'ngx-mask';
import { ExpensesComponent } from './expenses.component';
import { FiltersComponent } from '@components/filters/filters.component';
import { TooltipComponent } from '@components/tooltip/tooltip.component';
import { ScrollDetectionDirective } from '@directives/scroll-detection/scroll-detection.directive';
import { SortableTableDirective } from '@directives/sortable-table/sortable-table.directive';



@NgModule({
  declarations: [
    ExpensesComponent,
    AddEditExpenseComponent,
  ],
  imports: [
    CommonModule,
    NgSelectModule,
    FormsModule,
    NgbNavModule,
    NgxMaskModule,
    NgbTooltipModule,
    FiltersComponent,
    TooltipComponent,
    ScrollDetectionDirective,
    SortableTableDirective,
  ],
  exports: [
    ExpensesComponent,
  ]
})
export class ExpensesModule { }
