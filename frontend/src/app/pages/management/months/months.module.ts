import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MonthsComponent } from './months.component';
import { AddEditMonthComponent } from './components/add-edit-month/add-edit-month.component';
import { NgbNavModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { AddEditMonthlyIncomeComponent } from './components/monthly-incomes/components/add-edit-monthly-income/add-edit-monthly-income.component';
import { AddEditMonthlyExpenseComponent } from './components/monthly-expenses/components/add-edit-monthly-expense/add-edit-monthly-expense.component';
import { MonthlyIncomesComponent } from './components/monthly-incomes/monthly-incomes.component';
import { MonthlyExpensesComponent } from './components/monthly-expenses/monthly-expenses.component';
import { CategoriesComponent } from './components/categories/categories.component';
import { GroupsComponent } from './components/categories/components/groups/groups.component';
import { NgxMaskModule } from 'ngx-mask';
import { AddEditCategoryComponent } from './components/categories/components/add-edit-category/add-edit-category.component';
import { AddEditGroupComponent } from './components/categories/components/groups/components/add-edit-group/add-edit-group.component';
import { ComponentsModule } from 'src/app/shared/components/components.module';
import { DuplicateMonthComponent } from './components/duplicate-month/duplicate-month.component';
import { PipesModule } from 'src/app/shared/pipes/pipes.module';



@NgModule({
  declarations: [
    AddEditCategoryComponent,
    AddEditGroupComponent,
    AddEditMonthComponent,
    AddEditMonthlyExpenseComponent,
    AddEditMonthlyIncomeComponent,
    CategoriesComponent,
    GroupsComponent,
    MonthlyExpensesComponent,
    MonthlyIncomesComponent,
    MonthsComponent,
    DuplicateMonthComponent,
  ],
  imports: [
    CommonModule,
    NgbNavModule,
    FormsModule,
    NgSelectModule,
    NgxMaskModule,
    ComponentsModule,
    NgbTooltipModule,
    PipesModule,
  ]
})
export class MonthsModule { }
