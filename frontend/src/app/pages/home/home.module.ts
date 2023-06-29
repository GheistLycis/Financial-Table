import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnalyticsComponent } from './components/analytics/analytics.component';
import { HomeComponent } from './home.component';
import { DirectivesModule } from 'src/app/shared/directives/directives.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { ExpensesTableModule } from './components/expenses-table/expenses-table.module';
import { FormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    HomeComponent,
    AnalyticsComponent,
  ],
  imports: [
    CommonModule,
    DirectivesModule,
    ExpensesTableModule,
    NgSelectModule,
    FormsModule,
  ]
})
export class HomeModule { }
