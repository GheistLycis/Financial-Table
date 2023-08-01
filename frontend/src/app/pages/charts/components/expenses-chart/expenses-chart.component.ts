import { Component, Input } from '@angular/core';
import { ChartConfiguration } from 'chart.js';
import DataLabelsPlugin from 'chartjs-plugin-datalabels';
import MonthDTO from 'src/app/shared/DTOs/month';
import { Subject, map } from 'rxjs';
import ExpenseChartData from 'src/app/shared/interfaces/ExpenseChartData';
import { AnalyticsService } from 'src/app/shared/services/analytics/analytics.service';
import { Palette } from 'src/app/shared/enums/Palette';


@Component({
  selector: 'app-expenses-chart',
  templateUrl: './expenses-chart.component.html',
  styleUrls: ['./expenses-chart.component.scss']
})
export class ExpensesChartComponent {
  @Input() set months(months: MonthDTO[] | null) {
    if(months?.length) this.getData(months.map(({ id }) => id))
  }
  options: ChartConfiguration<'line'>['options'] = {
    color: Palette.tertiary,
    scales: {
      x: {
        ticks: {
          callback: value => value, // impedes float decimal point
          stepSize: 1,
          color: Palette.tertiary,
        },
        title: {
          display: true,
          text: 'Dia',
          color: Palette.tertiary,
          font: {
            family: 'Overpass',
          },
        }
      },
      y: {
        ticks: {
          stepSize: 1,
          color: Palette.tertiary,
          font: {
            family: 'Overpass',
          },
        },
        title: {
          display: true,
          text: 'Registros',
          color: Palette.tertiary,
        }
      },
    },
    elements: {
      line: {
        tension: 0.25,
      },
      point: {
        radius: 4,
        hoverRadius: 7,
      },
    },
    plugins: {
      title: {
        display: true,
        text: 'Gastos ao Longo do Mês',
        color: Palette.tertiary,
        font: {
          size: 20,
          family: 'Overpass',
        },
      },
      datalabels: {
        color: 'black',
        font: {
          size: 16,
          family: 'Overpass',
        },
        formatter: () => null,
      },
      tooltip: {
        callbacks: {
          title: ([ firstPoint ]) => 'Dia ' + firstPoint.label.padStart(2, '0'),
          label: ({ parsed }) => parsed.y + ' registro' + (parsed.y != 1 ? 's' : ''),
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
  data$ = new Subject<ExpenseChartData>()
  plugins = [DataLabelsPlugin]

  constructor(
    private analyticsService: AnalyticsService,
  ) {}

  getData(months: MonthDTO['id'][]): void {
    this.analyticsService.expenseChart(months).pipe(
      map(({ data }) => data)
    ).subscribe(data => this.data$.next(data))
  }
}
