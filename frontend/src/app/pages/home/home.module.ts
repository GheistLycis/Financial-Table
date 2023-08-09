import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnalyticsComponent } from './components/analytics/analytics.component';
import { HomeComponent } from './home.component';
import { ExpensesModule } from './components/expenses/expenses.module';
import { CalendarComponent } from './components/calendar/calendar.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { PipesModule } from '@pipes/pipes.module';
import { NgbCarouselModule } from '@ng-bootstrap/ng-bootstrap';
import { TooltipComponent } from '@components/tooltip/tooltip.component';
import { FormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    HomeComponent,
    AnalyticsComponent,
    CalendarComponent,
  ],
  imports: [
    CommonModule,
    ExpensesModule,
    FormsModule,
    NgSelectModule,
    PipesModule,
    NgbCarouselModule,
    TooltipComponent,
  ]
})
export class HomeModule { }
