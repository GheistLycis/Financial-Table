import { Component, Input, ViewChild } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartDataset } from 'chart.js';
import DatalabelsPlugin from 'chartjs-plugin-datalabels';
import MonthDTO from 'src/app/shared/DTOs/month';
import { AnalyticsService } from 'src/app/shared/services/analytics/analytics.service';
import { Subject, map } from 'rxjs';
import { RoundPipe } from 'src/app/shared/pipes/round/round.pipe';
import CategoryChartData from 'src/app/shared/interfaces/CategoryChartData';


@Component({
  selector: 'app-categories-chart',
  templateUrl: './categories-chart.component.html',
  styleUrls: ['./categories-chart.component.scss'],
  providers: [RoundPipe]
})
export class CategoriesChartComponent {
  @Input() set months(months: MonthDTO[] | null) {
    if(months?.length) this.getData(months.map(({ id }) => id))
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
        font: {
          size: 16,
          weight: 700,
        },
        formatter: (value, ctx): string => {
          if(!value) return null

          const dataset = ctx.dataset as ChartDataset<'doughnut', number[]> 
          const percent = (100 * value / dataset.data.reduce((acc, val) => acc += val, 0))

          return this.roundPipe.transform(percent, 'floor') + '%'
        },
      },
    },
  }
  data$ = new Subject<CategoryChartData>()
  plugins = [DatalabelsPlugin]

  constructor(
    private analyticsService: AnalyticsService,
    private roundPipe: RoundPipe,
  ) {}

  getData(months: MonthDTO['id'][]): void {
    this.analyticsService.categoryChart(months).pipe(
      map(({ data }) => data)
    ).subscribe(data => this.data$.next(data))
  }
}
