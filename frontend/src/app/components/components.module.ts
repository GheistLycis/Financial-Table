import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './navbar/navbar.component';
import { FooterComponent } from './footer/footer.component';
import { RouterModule } from '@angular/router';
import { YearComponent } from './modal/year/year.component';
import { MonthComponent } from './modal/month/month.component';
import { CategoryComponent } from './modal/category/category.component';
import { GroupComponent } from './modal/group/group.component';
import { ExpenseComponent } from './modal/expense/expense.component';
import { MonthlyEntryComponent } from './modal/monthly-entry/monthly-entry.component';
import { SharedModule } from '../utils/shared.module';



@NgModule({
  declarations: [
    NavbarComponent, 
    FooterComponent, 
    YearComponent, 
    MonthComponent, 
    CategoryComponent, 
    GroupComponent, 
    ExpenseComponent, 
    MonthlyEntryComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    SharedModule,
  ],
  exports: [
    NavbarComponent, 
    FooterComponent,
  ]
})
export class ComponentsModule { }
