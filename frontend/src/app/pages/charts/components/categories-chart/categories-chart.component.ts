import { Component, Input } from '@angular/core';
import { ChartConfiguration, ChartDataset } from 'chart.js';
import DatalabelsPlugin from 'chartjs-plugin-datalabels';
import MonthDTO from 'src/app/shared/DTOs/month';
import { AnalyticsService } from 'src/app/shared/services/analytics/analytics.service';
import { Subject, map } from 'rxjs';
import { RoundPipe } from 'src/app/shared/pipes/round/round.pipe';
import { CategoryChartData } from 'src/app/shared/interfaces/CategoryChartData';
import { Palette } from 'src/app/shared/enums/Palette';
import HexToRgba from 'src/app/shared/classes/HexToRgba';


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
  options: ChartConfiguration<'doughnut'>['options'] = { 
    //@ts-ignore
    hoverOffset: 10,
    color: Palette.tertiary,
    plugins: {
      title: {
        display: true,
        text: 'Gastos por Categoria',
        color: Palette.tertiary,
        font: {
          family: 'Overpass',
          size: 20,
        },
      },
      legend: {
        position: 'top',
        labels: {
          font: {
            family: 'Overpass',
          },
        },
      },
      datalabels: {
        color: Palette.tertiary,
        font: {
          size: 16,
          weight: 700,
          family: 'Overpass',
        },
        formatter: (value, ctx): string => {
          if(!value) return null

          const dataset = ctx.dataset as ChartDataset<'doughnut', number[]> 
          const percent = (100 * value / dataset.data.reduce((acc, val) => acc += val, 0))

          return this.roundPipe.transform(percent, 'floor') + '%'
        },
      },
      tooltip: {
        callbacks: {
          label: ({ dataset, parsed }) => `${dataset.label}: R$${this.roundPipe.transform(parsed, 2)}`,
        },
        titleFont: {
          family: 'Overpass',
        },
        bodyFont: {
          family: 'Overpass',
        }
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
      map(({ data }) => {
        const { categories, datasets } = data
        
        return {
          labels: categories.map(({ name }) => name),
          datasets: datasets.map(({ data, label }) => ({
              data,
              label,
              backgroundColor: categories.map(({ color }) => HexToRgba.convert(color, 0.5)),
              borderColor: categories.map(({ color }) => color)
            }))
        }
      })
    ).subscribe(data => this.data$.next(data))
  }
}
