import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartsComponent } from './charts.component';
import { NgChartsModule } from 'ng2-charts';
import { CategoriesChartComponent } from './components/categories-chart/categories-chart.component';
import { TagsChartComponent } from './components/tags-chart/tags-chart.component';
import { ExpensesChartComponent } from './components/expenses-chart/expenses-chart.component';
import { FiltersComponent } from '@components/filters/filters.component';



@NgModule({
  declarations: [
    ChartsComponent,
    CategoriesChartComponent,
    TagsChartComponent,
    ExpensesChartComponent,
  ],
  imports: [
    CommonModule,
    NgChartsModule.forRoot(),
    FiltersComponent,
  ]
})
export class ChartsModule { }
