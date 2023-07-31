import { Component, Input, ViewChild } from '@angular/core';
import { ChartConfiguration, ChartData } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import DataLabelsPlugin from 'chartjs-plugin-datalabels';
import MonthDTO from 'src/app/shared/DTOs/month';
import { Subject, map } from 'rxjs';
import ExpenseChartData from 'src/app/shared/interfaces/ExpenseChartData';
import { AnalyticsService } from 'src/app/shared/services/analytics/analytics.service';
import { RoundPipe } from 'src/app/shared/pipes/round/round.pipe';

const SAMPLE_DATA: ChartData<'scatter'> = {
  labels: [
    '01',
    '02',
    '03',
    '04'
  ],
  datasets: [
    {
      data: [3, 0, 4, 5],
      label: 'Janeiro',
      pointRadius: 5,
    },
    {
      data: [4, 4, 4, 0],
      label: 'Fevereiro',
      pointRadius: 5,
    },
  ],
}

@Component({
  selector: 'app-expenses-chart',
  templateUrl: './expenses-chart.component.html',
  styleUrls: ['./expenses-chart.component.scss'],
  providers: [RoundPipe]
})
export class ExpensesChartComponent {
  @Input() set months(months: MonthDTO[] | null) {
    if(months?.length) this.getData(months.map(({ id }) => id))
  }
  @ViewChild(BaseChartDirective) chart!: BaseChartDirective
  options: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'Gastos ao Longo do Mês',
      },
      datalabels: {
        color: 'black',
        font: {
          size: 16,
        },
        formatter: () => null,
      },
    },
  }
  data: ChartData<'scatter'> = SAMPLE_DATA
  data$ = new Subject<ExpenseChartData>()
  plugins = [DataLabelsPlugin]

  constructor(
    private analyticsService: AnalyticsService,
    private roundPipe: RoundPipe,
  ) {}

  getData(months: MonthDTO['id'][]): void {
    this.analyticsService.expenseChart(months).pipe(
      map(({ data }) => data)
    ).subscribe(data => this.data$.next(data))
  }
}
