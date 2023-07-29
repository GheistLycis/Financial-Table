import { Component, Input, ViewChild } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartData, ChartDataset } from 'chart.js';
import DatalabelsPlugin from 'chartjs-plugin-datalabels';
import MonthDTO from 'src/app/shared/DTOs/month';
import { AnalyticsService } from 'src/app/shared/services/analytics/analytics.service';
import { Subject, map } from 'rxjs';


const SAMPLE_DATA: ChartData<'doughnut', number[], string> = {
  labels: ['Categoria 1', 'Categoria 2', 'Categoria 3', 'Categoria 4'],
  datasets: [
    { 
      data: [350, 450, 0, 100],
      label: 'Abril',
      backgroundColor: ['red', 'green', 'yellow', 'blue']
    },
    { 
      data: [50, 150, 110, 120],
      label: 'Março',
      backgroundColor: ['red', 'green', 'yellow', 'blue']
    },
    {
      data: [250, 130, 0, 70],
      label: 'Fevereiro',
      backgroundColor: ['red', 'green', 'yellow', 'blue']
    },
    {
      data: [250, 130, 0, 70],
      label: 'Janeiro',
      backgroundColor: ['red', 'green', 'yellow', 'blue']
    },
  ],
}


@Component({
  selector: 'app-categories-chart',
  templateUrl: './categories-chart.component.html',
  styleUrls: ['./categories-chart.component.scss']
})
export class CategoriesChartComponent {
  @Input() set months(months: MonthDTO[]) {
    this.getData(months.map(({ id }) => id))
  }
  @ViewChild(BaseChartDirective) chart!: BaseChartDirective
  options: ChartConfiguration['options'] = {
    responsive: true, //@ts-ignore
    hoverOffset: 10,
    plugins: {
      title: {
        display: true,
        text: 'Gastos por Categoria',
      },
      legend: {
        position: 'top',
      },
      datalabels: {
        color: 'black',
        formatter: (value, ctx): string => {
          const dataset = ctx.dataset as ChartDataset<'doughnut', number[]> 
          const percent = (100 * value / dataset.data.reduce((acc, val) => acc += val, 0))

          return percent.toPrecision(2) + '%'
        },
      }
    },
  }
  data$ = new Subject<ChartData<'doughnut', number[], string>>()
  plugins = [DatalabelsPlugin]

  constructor(
    private analyticsService: AnalyticsService,
  ) {}

  getData(months: MonthDTO['id'][]): void {
    this.analyticsService.categoryChart(months).pipe(
      map(({ data }) => data)
    ).subscribe(data => this.data$.next(data))
  }
}
