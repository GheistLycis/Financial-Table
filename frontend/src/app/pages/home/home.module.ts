import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnalyticsComponent } from './components/analytics/analytics.component';
import { HomeComponent } from './home.component';
import { DirectivesModule } from 'src/app/utils/directives/directives.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';
import { TableComponent } from './components/table/table.component';
import { FiltersComponent } from './components/table/components/filters/filters.component';



@NgModule({
  declarations: [
    HomeComponent,
    AnalyticsComponent,
    TableComponent,
    FiltersComponent,
  ],
  imports: [
    CommonModule,
    DirectivesModule,
    NgSelectModule,
    FormsModule,
  ]
})
export class HomeModule { }
