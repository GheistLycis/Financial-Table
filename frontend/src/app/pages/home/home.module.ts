import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnalyticsComponent } from './components/analytics/analytics.component';
import { HomeComponent } from './home.component';
import { DirectivesModule } from 'src/app/shared/directives/directives.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';
import { ExpensesModule } from './components/expenses/expenses.module';



@NgModule({
  declarations: [
    HomeComponent,
    AnalyticsComponent,
  ],
  imports: [
    CommonModule,
    DirectivesModule,
    ExpensesModule,
    NgSelectModule,
    FormsModule,
  ]
})
export class HomeModule { }
